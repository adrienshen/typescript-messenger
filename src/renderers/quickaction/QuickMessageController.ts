import { MessageAction } from "../../types";
import BaseRenderer from "../BaseRenderer";

export default abstract class QuickMessageController extends BaseRenderer {
  visible: boolean = false;
  quickMessages: MessageAction[];

  constructor() {
    super();
    this.quickMessages = [];
  }

  protected ActionButton(options: {className?: string[], innerText: string}): HTMLButtonElement {
    let buttonEl = document.createElement("BUTTON") as HTMLButtonElement;
    if (options.className) {
      buttonEl.classList.add(...Array.from(options.className));
    }
    buttonEl.textContent = options.innerText;
    return buttonEl;
  }

  show(quickMessages: any) {
    this.quickMessages = quickMessages;
    this.visible = true;
    this.render();
  }

  hide() {
    this.visible = false;
    this.quickMessages = [];
    this.render();
  }

  abstract render(): void;
}
