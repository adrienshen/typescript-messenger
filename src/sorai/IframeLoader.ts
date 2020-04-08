import {ErrorMessages, IframeOptions} from "../constants/ClientMessagesInterface";
import {style} from "../utils/domhelpers"

class IframeLoader {
  timeStarted: Date;
  SORA_CHAT_IFRAME_ID: string = "SoraChatFrame";
  IFRAME_LOCATION: string;
  IFRAME_BASE_WIDTH: string = "100%";
  IFRAME_BASE_HEIGHT: string = "100%";
  POSTMESSAGE_TIMEOUT: number = 500;
  soraIframeEl: HTMLIFrameElement;

  constructor(options: {origin: string}) {
    this.timeStarted = new Date();
    // console.log("!", options.origin);
    this.IFRAME_LOCATION = options.origin
      ? `${options.origin}/iframe.html`
      : '/iframe.html'
  }

  attachSoraFrame(containerObj: any) {
    this.soraIframeEl.style.height = this.IFRAME_BASE_HEIGHT;
    this.soraIframeEl.style.visibility = "visible";
    if (containerObj && containerObj.containerId) {
      this.soraIframeEl.style.position = "static";
      this.appendContainerIframe(containerObj.containerId);
    } else {
      this.soraIframeEl.style.right = "10px";
    }
  }

  detachSoraFrame() {
    style(this.soraIframeEl, {
      "visibility": "hidden",
      "height": "0px",
      "position": "absolute",
      "right": "9999px",
    });
  }

  embedSoraFrame(startOptions: IframeOptions) {
    if (this.soraIframeEl) {
      console.error(ErrorMessages.DUP_IFRAME);
      return false;
    }
    this.loadDefaultIframe();
    (startOptions && startOptions.containerId)
      ? this.appendContainerIframe(startOptions)
      : this.appendAbsoluteIframe();

    this.detachSoraFrame();
    return this.soraIframeEl;
  }

  protected loadDefaultIframe() {
    this.soraIframeEl = document.createElement("IFRAME") as HTMLIFrameElement;
    this.soraIframeEl.src = this.IFRAME_LOCATION;
    this.soraIframeEl.id = this.SORA_CHAT_IFRAME_ID;
    this.soraIframeEl.width = this.IFRAME_BASE_WIDTH;
    style(this.soraIframeEl, {
      "border": "none",
      "height": this.IFRAME_BASE_HEIGHT,
      "maxWidth": (window.innerWidth > 800) ? "425px" : "100vw",
    });
  }

  protected appendAbsoluteIframe() {
    this.soraIframeEl.style.position = 'absolute';
    
    let containerEl = document.createElement("DIV");
    containerEl.classList.add("iframe-ctn");
    style(containerEl, {
      "position": "fixed",
      "right": "0",
      "bottom": "0",
      "left": "0",
      "top": "0",
      "overflowY": "hidden",
    });
    containerEl.appendChild(this.soraIframeEl);
    document.body.appendChild(containerEl);

    (window.innerWidth > 800)
      ? this.desktopPositioning()
      : this.devicesPositioning();
  }

  protected desktopPositioning() {
    style(this.soraIframeEl, {
      "bottom": '0px',
      "right": '10px',
    });
  }

  protected devicesPositioning() {
    style(this.soraIframeEl, {
      "top": '0px',
      "left": '0px',
    });
  }

  protected appendContainerIframe({containerId}: IframeOptions) {
    if (!containerId) return;
    try {
      let elem = document.getElementById(containerId);
      if (elem) {
        elem.appendChild(this.soraIframeEl);
      }
    } catch(err) {
      console.error(ErrorMessages.CONTAINER_NOT_EXIST(containerId));
    }
  }

}

export default IframeLoader;