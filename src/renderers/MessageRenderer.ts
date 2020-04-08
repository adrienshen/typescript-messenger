import ClassNames from "../constants/ClassNames";
import ElementIds from "../constants/ElementIds";
import { ThreeDotsIndicator } from "../utils/SvgIcons";
import BaseRenderer from "./BaseRenderer";

export default abstract class MessageRenderer extends BaseRenderer {

  protected transcriptContainerUl: HTMLUListElement;

  constructor() {
    super();
    this.transcriptContainerUl =
      document.getElementById(ElementIds.TranscriptAreaUl) as HTMLUListElement;
  }

  protected Message = (textMessage: string, sender: string): HTMLElement => this.LI({dataSender: sender}, textMessage);

  append(parentElement: HTMLElement, innerElement: HTMLElement) {
    parentElement.appendChild(innerElement);
  }

  appendResponseLoader() {
    let loaderEl = this.LI({
      classNames: [ClassNames.MessageItem, ClassNames.FromChatbot, ClassNames.ResponseLoader]
    });
    loaderEl.innerHTML = ThreeDotsIndicator();
    this.appendToTranscript(loaderEl);
  }

  removeResponseLoader() {
    let loaderEl = document.getElementsByClassName(ClassNames.ResponseLoader)[0];
    if (loaderEl) loaderEl.remove();
  }

  appendToTranscript(elem: HTMLElement) {
    this.transcriptContainerUl.appendChild(elem);
  }

  removeLastMessageElement(count: number = 1): void {
    // optional count to remove multiple elements.
    for (let i: number = 0; i < count; i++) {
      if (this.transcriptContainerUl.lastElementChild && this.transcriptContainerUl.lastElementChild) {
        this.transcriptContainerUl.removeChild(
          this.transcriptContainerUl.lastElementChild
        );
      }
    }
  }
}

export abstract class BotMessageRenderer extends MessageRenderer {
  constructor() {
    super();
  }

  abstract validates(message: any): boolean;
  abstract render(message: any): void;
}
