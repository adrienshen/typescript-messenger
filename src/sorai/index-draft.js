
// The sora client interface to be embeddable into client pages
// use a closure for now to experiment with functionality.

(function(w) {
  
  const SORA_CHAT_IFRAME_ID = "SoraChatFrame";
  const IFRAME_LOCATION = "iframe.html";
  const ERROR_MESSAGES = {
    DUP_IFRAME: "SORA IFRAME already exists on page, aborting duplicate initiation",
    CONTAINER_NOT_EXIST: container => `Container provided to sorai(): ${container} does not exist.`,
    NOT_STARTED: "First sorai cmd in queue has to be sorai('start')",
    UNSUPPORTED_COMMAND: command => `Command ${command} not support by sora client interface`,
    ZERO_QUEUE: "No messages in w.sorai.q",
  };
  const POSTMESSAGE_TIMEOUT = 500;
  let soraChannel;
  let soraIframeEl;

  const isStartCommand = command => command === "start";

  if (!w.sorai.q) {
    // if not messages in queue, then assign re-assign the sorai function and exit
    console.error(ERROR_MESSAGES.ZERO_QUEUE);
    window['sorai'] = soraiRouterFunc;
    return;
  }

  const [command, startOptions] = w.sorai.q[0];
  let capturedQueue = w.sorai.q;

  if (isStartCommand(command)) {
    embedSoraFrame(startOptions);
    soraIframeEl.addEventListener("load", e => {
      console.log(soraIframeEl + " Loaded");
      processQueue(capturedQueue);
    }, false);
  } else {
    console.error(ERROR_MESSAGES.NOT_STARTED);
  }

  function processQueue(messageQueue) {
    console.log("mq: ", messageQueue);

    if (messageQueue.length) {
      for (let i = 0; i < messageQueue.length; i++) {
        const [command, payload] = messageQueue[i];
        console.log(`${i}: command: ${command}, payload: ${payload}`);
        soraiRouterFunc(command, payload);
      }
    }

  }

  function embedSoraFrame(startOptions) {
    // console.log('Hello Sorai!', startOptions.containerId);

    if (soraIframeEl) {
      console.error(ERROR_MESSAGES.DUP_IFRAME);
      return false;
    }

    soraIframeEl = document.createElement('IFRAME');
    soraIframeEl.src = IFRAME_LOCATION;
    soraIframeEl.id = SORA_CHAT_IFRAME_ID;
    soraIframeEl.width = 375;
    soraIframeEl.height = 700;
    soraIframeEl.style.height = '75vh';

    if (startOptions.containerId) {
      try {
        document.getElementById(startOptions.containerId).appendChild(soraIframeEl);
      } catch(err) {
        console.error(ERROR_MESSAGES.CONTAINER_NOT_EXIST(startOptions.containerId));
      }
    } else {
      soraIframeEl.style.position = 'absolute';
      soraIframeEl.style.bottom = '0px';
      soraIframeEl.style.right = '10px';
      document.body.appendChild(soraIframeEl);
    }

    // replace setTimeout with some clever stuff later
    // postSoraChannel("start", startOptions);
  }

  function setGtm(command, gtmId) {
    postSoraChannel(command, gtmId);
  }

  function send(command, message) {
    postSoraChannel(command, message);
  }



  function postSoraChannel(command, payload) {
    soraChannel = new MessageChannel();
    let post = {command, payload};  
    soraIframeEl.contentWindow.postMessage(post, "*", [soraChannel.port2]);
    soraChannel.port1.onmessage = e => {
      console.log("message from Sora: ", e);
    };
  }

  function soraiRouterFunc(command, payload) {
    // console.log('execute immediately...', command, payload);
    if (isStartCommand(command)) return postSoraChannel(command, payload);
    if (command === "setGtm") return setGtm(command, payload);
    if (command === "send") return send(command, payload);
    if (command === "hide") return hideSoraFrame();
    if (command === "show") return showSoraFrame();

    // If it get here, then the command is not supported
    console.error(ERROR_MESSAGES.UNSUPPORTED_COMMAND(command));
  }

  function hideSoraFrame() {
    soraIframeEl.style.visibility = "hidden";
    soraIframeEl.style.height = "0px";
  }

  function showSoraFrame() {
    soraIframeEl.style.height = '75vh';
    soraIframeEl.style.visibility = "visible";
  }

  // Finally sorai must now be overwritten, since we now want commands to execute immediately after the original commands are processed async.
  window['sorai'] = soraiRouterFunc;

}(window));
