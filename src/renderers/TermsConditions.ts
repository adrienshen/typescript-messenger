import ClientSender from "../service/ClientSender";
import PubSub from "../core/PubSub";
import { PublishEventNames } from "../types/publishevents";

class TermsConditions {

  private termsConditionsArea: HTMLElement | null = document.getElementById("privacy-agreement");
  private tncMessage: string;

  setClientTnc(message: string) {
    this.tncMessage = message;
    this.termsConditionsArea!.innerHTML = this.tncMessage;
    this.attachCustomLinkEvent();

    PubSub.subscribe({
      event: PublishEventNames.TermsRemove,
      action: () => this.removeTermsConditions(),
    });
  }

  attachCustomLinkEvent() {
    let termsLinks = document.querySelectorAll("#privacy-agreement a");
    for (let i = 0; i < termsLinks.length; i++) {
      termsLinks[i].addEventListener("click", e => {
        e.preventDefault();
        let clickedLink = (e.target as HTMLAnchorElement).href;
        console.log("clicked", clickedLink);
        ClientSender.sendTermsLink(clickedLink);
      });
    }
  }

  removeTermsConditions() {
    if (this.termsConditionsArea) {
      this.termsConditionsArea.remove();
    }
  }

}

export default new TermsConditions();