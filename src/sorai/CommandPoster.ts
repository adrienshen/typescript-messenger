import ErrorMessages from "../constants/ErrorMessages";

class CommandPoster {
  iframeEl: HTMLIFrameElement;

  constructor(iframe: HTMLIFrameElement) {
    this.iframeEl = iframe;
  }

  start(command: string, message: any) {
    message.topScreen = {
      topInnerWidth: window.innerWidth,
      topOuterWidth: window.outerWidth,
      topScreenAvailWidth: window.screen.availWidth,
      topScreenWidth: window.screen.width,
    }
    // console.log("send event~", command, message);
    this.postSoraChannel(command, message);
  }

  send(command: string, message: string) {
    this.postSoraChannel(command, message);
  }

  style(command: string, message: any) {
    if (message.styleId) {
        message.styleContents = this.getCustomStyles(message.styleId);
    }
    this.postSoraChannel(command, message);
  }

  tnc(command: string, message: string) {
    this.postSoraChannel(command, message);
  }

  gtm(command: string, message: string) {
    this.postSoraChannel(command, message);
  }

  upload(command: string, message: boolean) {
    this.postSoraChannel(command, message);
  }

  simulateBackend(command: string, message: boolean) {
    this.postSoraChannel(command, message);
  }

  protected getCustomStyles(styleId: string): string {
    let customStyles = document.getElementById(styleId);
    if (customStyles) {
      return customStyles.innerHTML.trim();
    } else {
      throw new Error("Styles Tag Id not found.");
    }
  }

  protected postSoraChannel(command: string, payload: object|string|boolean) {
    let soraChannel = new MessageChannel();
    let post = {command, payload};
    if (this.iframeEl.contentWindow) {
      this.iframeEl.contentWindow.postMessage(post, "*", [soraChannel.port2]);
    } else {
      console.error(ErrorMessages.IframeContentWindowError);
    }
  }

}

export default CommandPoster;