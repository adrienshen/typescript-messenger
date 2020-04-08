import MessageRenderer from './MessageRenderer';
// import { Message } from "../service/ChatbotClientInterfaces";
import ClientSender from '../service/ClientSender';
import ClassNames from '../constants/ClassNames';

/*
* Renders pdf uploaded link
*
**/
export default class PdfLinkRenderer extends MessageRenderer {
  constructor() {
    super();
  }

  render(fileUrl?: string, text?: string): void {
    let linkEl = this.A({
        href: fileUrl,
        classNames: [ClassNames.PdfFile],
    }, text);
    linkEl = this.addEventListener(linkEl);
    let listEl = this.LI({dataSender: "chatbot"});
    listEl.appendChild(linkEl);
    this.appendToTranscript(listEl);
  }

  addEventListener(linkEl: HTMLAnchorElement) {
    linkEl.addEventListener("click", e => {
      e.preventDefault();
      ClientSender.sendTermsLink(linkEl.href);
    });
    return linkEl;
  }
}
