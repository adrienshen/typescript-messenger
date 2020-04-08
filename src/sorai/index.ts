import {ErrorMessages} from "../constants/ClientMessagesInterface";
import CommandPoster from "./CommandPoster";
import IframeLoader from "./IframeLoader";
import Processor from "./Processor";

(function(w) {
  // capture the state of the command arguments queue in the closure
  const {q, s} = w.sorai;
  let capturedQueue = q;
  const [command] = capturedQueue[0];
  const processor = new Processor();
  const iframeLoader = new IframeLoader({
    origin: s.origin,
  });

  if (!capturedQueue) {
    // if no messages in queue, then assign re-assign the sorai function and exit
    console.error(ErrorMessages.ZERO_QUEUE);
    window['sorai'] = processor.soraiRouterFunc.bind(processor);
    return;
  }

  let commandsObj = processor.transformCommandObj(capturedQueue);
  if (processor.isInitCommand(command) && commandsObj["attach"]) {
    // Making sure the iframe is embedded first before processing commands
    iframeLoader.embedSoraFrame(commandsObj["attach"].payload);

  } else {
    console.error(ErrorMessages.NOT_STARTED);
  }

  // Process the command arguements
  iframeLoader.soraIframeEl.addEventListener("load", () => {
    let commandPoster = new CommandPoster(iframeLoader.soraIframeEl);
    processor.setCommandPoster = commandPoster;
    processor.setIframeLoader = iframeLoader;
    processor.processQueue(commandsObj);
  }, false);

  // Finally, sorai() must now be overwritten, since we now want commands to execute
  // immediately after the original commands are processed asynchronously on during
  // load. We need to bind to the soraInterface to execute in that context.
  window['sorai'] = processor.soraiRouterFunc.bind(processor);
}(window));

declare global {
  interface Window {
    sorai: any;
  }
}