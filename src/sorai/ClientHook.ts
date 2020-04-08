import HooksList from "../constants/HooksList";
import {style} from "../utils/domhelpers";

class ClientHook {

  lastEventTimeStamp: number = 0;

  attachHook(command: string, cb: (message: any) => void) {
    window.addEventListener("message", (e: MessageEvent) => {
      // console.log("new message inside attachHook: ", e);
      if (command === e.data.event) {
        cb(e.data);
      } else {
        this.handleSpecialEvent(e);
      }
    });
  }

  protected handleSpecialEvent(e: MessageEvent) {
    // ignore events that happen within .5 seconds, could be double errors
    if ((e.timeStamp - this.lastEventTimeStamp) < 500) return ;
    this.lastEventTimeStamp = e.timeStamp;    
    console.log("special event e: ", e);

    const {event, message} = e.data;
    if (event === HooksList.TermsLink) this.handleTermsLink(message);
    if (event === HooksList.LearnMoreLink) this.handleLearnMoreLink(message);
    if (event === HooksList.ImageModalSource) this.handleOpenImageModal(message);
  }

  protected handleTermsLink(termsLink: string) {
    // console.log("in handleTermsLink: ", termsLink);
    window.open(termsLink, "_blank");
  }

  protected handleLearnMoreLink(learnMoreLink: string) {
    window.open(learnMoreLink, "_blank");
  }

  protected handleOpenImageModal(imageLink: string) {
    let soraIframe = document.getElementById("SoraChatFrame");
    soraIframe!.style.visibility = "hidden";
    let imageEl = document.createElement("img");
      imageEl.src = imageLink;
      style(imageEl, {
        "width": "95%",
        "borderRadius": ".5rem",
        "cursor": "zoom-out",
        "max-width": "360px",
      });
    let modalEl = document.createElement("div");
      modalEl.classList.add("image-upload-modal");
      style(modalEl, {
        "width": "100vw",
        "height": "100vh",
        "display": "block",
        "textAlign": "center",
        "paddingTop": "10vh",
        "background": "#000",
        "opacity": ".90",
        "zIndex": "9999",
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "right": "0",
        "left": "0",
      });
      modalEl.addEventListener("click", () => {
        modalEl.remove();
        soraIframe!.style.visibility = "visible";
      });
    modalEl.appendChild(imageEl);
    document.body.appendChild(modalEl);
  }
}

export default new ClientHook();