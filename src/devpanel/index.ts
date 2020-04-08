import { style } from "../utils/domhelpers";
declare var sorai: any;

interface ISimulateBackendMessagePayloads {
  [key: string]: any;
}

const SimulateBackendMessagePayloads: ISimulateBackendMessagePayloads = {
  normal: {
    "text": "Hei there!",
    "sender": "chatbot",
  },
  payment_plugin: {
    "text": "Please pay now",
    "plugin": {
      "url": "https://curiolabs.com/plugins/hello.html",
      "options": {
        "description": "1 Year Car Insurance",
        "currency": "MYR",
        "amount": 120
      }
    }
  }
}

class DevPanel {

  styles: string = `
    <style>
      #tnc-input-dev,
      #styling-input-dev,
      #send-message-dev,
      #backend-message-dev {
        font-family: monospace;
        background: #333;
        color: #eee;
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        padding: 1rem;
        margin-bottom: .5rem;
      }

      #textarea-section-container,
      #backend-message-area {
        position: relative;
      }

      .action-btn {
        position: absolute;
        z-index: 10;
        bottom: 1rem;
        right: .5rem;
        opacity: .85;
      }

      #message-options {
        position: absolute;
        bottom: 20px;
        left: 10px;
        color: white;
      }

      #backend-message-dev {
        height: 160px;
      }

      #send-message-dev {
        height: 40px;
      }
      
      #message-hooks,
      #gtm-hooks,
      #openlink-hooks {
        text-align: right;
      }

      #log-console {
        height: 200px;
        width: 100%;
        background: #333;
        color: white;
        padding: .5rem;
        font-family: monospace;
        box-sizing: border-box;
        overflow-y: scroll;
      }

      #log-console li {
        list-style-type: none;
      }

      h1 {
        margin: 0rem;
        font-size: 1.5rem;
      }
    </style>
  `;

  htmlString: string = `
    <h1>SoraiDevPanel</h1>

    <div id="textarea-section-container">
      <input
        placeholder="send message"
        type="text" id="send-message-dev" />
      <button class="action-btn" id="send-message">send</button><br />
    </div>

    <div id="backend-message-area">
      <textarea
        id="backend-message-dev"
        placeholder="simulate backend message"></textarea>
      <div id="message-options"></div>
      <button class="action-btn" id="send-backend">simulate</button><br />
    </div>
    
    <div id="textarea-section-container">
      <textarea
        id="tnc-input-dev"
        placeholder="type tnc"></textarea>
      <button class="action-btn" id="send-tnc">send tnc</button><br />
    </div>
    
    <div id="textarea-section-container">
      <textarea
        id="styling-input-dev"
        placeholder="type valid css"></textarea>
      <button class="action-btn" id="send-css">send css</button>
    </div>

    <div id="event-hooks">
      <h3>Event Hooks</h3>
      <div id="gtm-hooks">
        <button id="set-notifications">set notification hook</button> |
        <div
          id="notifications-count">Message notifications: <span id="notif-count-value">0</span>
        </div>
      </div>
      <div id="gtm-hooks">Gtm events: <span id="gtm-count">0</span></div>
      <div id="openlink-hooks">Open link hooks: <span id="openlink-count">0</span></div>
    </div>

    <div id="log-console">
      <ul></ul>
    </div>
  `

  sendMessageButtonEl: HTMLElement;
  sendMessageDevEl: HTMLInputElement;
  sendTncButton: HTMLElement;
  sendCssButton: HTMLElement;
  tncContents: HTMLInputElement;
  cssContents: HTMLInputElement;
  customStyleElContents: HTMLElement;
  setNotificationsAction: HTMLElement;
  notificationsCountEl: HTMLElement;
  logConsoleEl: HTMLElement;
  setNotificationsEl: HTMLInputElement;
  gtmCountEl: HTMLElement;
  simulateBackendMessage: HTMLTextAreaElement;
  simulateBackendMessageAction: HTMLElement;
  simulateBackendMessageOptions: HTMLElement;

  constructor() {
    this.generateUserInterface();
    this.cacheDomElements();    
    this.generateMessageOptions();
    this.mountEventListeners();
    this.soraiLogs();
    
    // typescript not letting rewrite of window.open
    // window.open = messageOpenEvent => {
    //   console.log("messageOpenEvent: ", messageOpenEvent);
    //   const openLinksEl = document.getElementById("openlink-count");
    //   if (openLinksEl) {
    //     openLinksEl.innerText = "" + parseInt(openLinksEl.innerText, 10) + 1;
    //   }
    //   if (messageOpenEvent) this.appendSoraLogEventLine("LinkOpenWindow", messageOpenEvent);
    // }
  }

  cacheDomElements() {
    this.sendMessageButtonEl = document.getElementById("send-message") as HTMLElement;
    this.sendMessageDevEl = document.getElementById("send-message-dev") as HTMLInputElement;
    this.sendTncButton = document.getElementById("send-tnc") as HTMLElement;
    this.sendCssButton = document.getElementById("send-css") as HTMLElement;
    this.tncContents = document.getElementById("tnc-input-dev") as HTMLInputElement;
    this.cssContents = document.getElementById("styling-input-dev") as HTMLInputElement;
    this.customStyleElContents = document.getElementById("customStyles") as HTMLElement;
    this.setNotificationsAction = document.getElementById("set-notifications") as HTMLElement;
    this.notificationsCountEl = document.getElementById("notifications-count") as HTMLElement;
    this.logConsoleEl = document.getElementById("log-console") as HTMLElement;
    this.setNotificationsEl = document.getElementById("set-notifications") as HTMLInputElement;
    this.gtmCountEl = document.getElementById("gtm-count") as HTMLElement;
    this.simulateBackendMessage = document.getElementById("backend-message-dev") as HTMLTextAreaElement;
    this.simulateBackendMessageAction = document.getElementById("send-backend") as HTMLElement;
    this.simulateBackendMessageOptions = document.getElementById("message-options") as HTMLElement;
  }

  generateUserInterface() {
    // sorai("send", "From [DevPanel]: is active on this client");
    let devEl = document.createElement("div");
        devEl.id = "DevPanel";

    style(devEl, {
      "position": "fixed",
      "left": "10px",
      "width": "300px",
      "height": "auto",
      "border": "2px solid #333",
      "background": "#4caf50",
      "padding": "1rem",
      "zIndex": "10",
    });

    devEl.innerHTML = `
      ${this.styles}
      ${this.htmlString}
    `;
    document.body.appendChild(devEl);
  }

  generateMessageOptions() {
    const df = new DocumentFragment();
    for (let i = 0; i < Object.keys(SimulateBackendMessagePayloads).length; i++) {
      console.log(SimulateBackendMessagePayloads[Object.keys(SimulateBackendMessagePayloads)[i]]);
      let optionEl = document.createElement("input");
          optionEl.type = "radio";
          optionEl.id = "message";
          optionEl.value = Object.keys(SimulateBackendMessagePayloads)[i];
          optionEl.setAttribute("name", "_message");
          optionEl.addEventListener("change", (e: Event) => this.handleSimulateOptionChange(e));

      let labelEl = document.createElement("label");
      let labelTextEl = document.createTextNode(Object.keys(SimulateBackendMessagePayloads)[i]);
          labelEl.appendChild(labelTextEl);
          labelEl.appendChild(optionEl);
      
      df.appendChild(labelEl);
    }
    this.simulateBackendMessageOptions.appendChild(df);
  }

  handleSimulateOptionChange(e: Event) {
    const {value} = e.target as HTMLInputElement;
    let messagePayload = JSON.stringify(SimulateBackendMessagePayloads[value]);
    this.simulateBackendMessage.value = messagePayload;
  }

  mountEventListeners() {
    console.log("this.sendMessageButtonEl: ", document.getElementById('send-message'));

    this.sendMessageButtonEl!.addEventListener("click", () => {
      const textMessage = this.sendMessageDevEl!.value;
      this.sendMessageDevEl.value = "";
      sorai("send", textMessage);
    });

    this.sendTncButton!.addEventListener("click", () => {
      console.log("tncContents: ", this.tncContents.value);
      sorai("tnc", this.tncContents.value || "example tnc from dev panel");
    });

    this.sendCssButton.addEventListener("click", () => {
      let cssContents = this.cssContents.value;
      this.customStyleElContents.innerHTML = cssContents;
      sorai('style', {styleId: "customStyles"});
    });

    this.setNotificationsAction.addEventListener("click", () => {
      console.log("value of this: ", this);
      let notificationsCount = 0;
      sorai('onMessage', (payload: any) => {
        notificationsCount ++;
        this.notificationsCountEl.innerText = `Message notifications: ${notificationsCount}`;
        
        let timestamp = Date.now();
        let textLogEl = document.createElement("li");
            textLogEl.innerText = timestamp + ": [chatbotOnMessage]: " + payload.message[0].text;
            textLogEl.id = "event-log";
        this.logConsoleEl.appendChild(textLogEl);
        this.logConsoleEl.scrollBy({
          top: this.logConsoleEl.scrollHeight,
          behavior: 'smooth',
        });
      });
      this.setNotificationsEl.innerText = "notifications listening";
      this.setNotificationsEl.style.background = "green";
      this.setNotificationsEl.style.color = "white";
      this.setNotificationsEl.disabled = true;
    });

    this.simulateBackendMessageAction.addEventListener("click", () => {
      let contents = this.simulateBackendMessage.value;
      try {
        // JSON.parse(contents);
        let validJsonString = JSON.stringify(JSON.parse(contents));
        // console.log("before send contents: ", validJsonString);
        sorai("simulateBackend", validJsonString);
      } catch (e) {
        alert("not valid json");
      }
    });
  }

  soraiLogs() {
    let self = this;
    sorai("onGtmEvent", (payload: any) => {
      console.log("DevPanel: ", payload);
      self.appendSoraLogEventLine(payload.event, payload.message);
      self.incrementGtmCount();
    });
  }

  incrementGtmCount() {
    let count = this.gtmCountEl.innerText;
    this.gtmCountEl.innerText = (Number(count) + 1).toString();
  }

  appendSoraLogEventLine(event: any, messagePayloadString: string) {
    let textLogEl = document.createElement("li");
      textLogEl.className = "event-log";
      textLogEl.innerText = Date.now() + `: [${event}]: ` + messagePayloadString;
    this.logConsoleEl.appendChild(textLogEl);
  }

}

if (window.innerWidth > 800) {
  new DevPanel();
}
