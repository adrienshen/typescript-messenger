import TextMessageRenderer from "../../renderers/TextMessageRenderer";
import {removeAllChildNodes, style} from "../../utils/domhelpers";
import PubSub from '../../core/PubSub';
import {
  PublishEventNames,
  MessageStringPayload
} from "../../types/publishevents";
import DomElements from "../../utils/DomElements";
import ErrorMessages, { LogError } from "../../constants/ErrorMessages";
const throttle = require("lodash.throttle");

import QuickMessageController from './QuickMessageController';

export default class TextQuickMessageController extends QuickMessageController {
  textMessageRenderer: TextMessageRenderer;
  bottomPadding: number = 30;

  constructor() {
    super();
    this.textMessageRenderer = new TextMessageRenderer();
    PubSub.subscribe({
      event: PublishEventNames.MessageSending,
      action: () => this.hide(),
    });

    DomElements.transcriptContainer!.addEventListener("scroll", throttle((e: MouseEvent) => {
      if (e.srcElement!.clientHeight + e.srcElement!.scrollTop >= (e.srcElement!.scrollHeight - this.bottomPadding)) {
        this.translateIntoView();
      } else {
        this.translateOutView();
      }
    }, 500));
  }

  render() {
    if ((!this.visible || !this.quickMessages.length) && DomElements.quickMessageComponent) {
      removeAllChildNodes(DomElements.quickMessageComponent);
    }

    let fragmentEl = new DocumentFragment();
    for (let i = 0; i < this.quickMessages.length; i++) {
      let actionButtonEl = this.ActionButton({
        className: ["QuickMessageButton"],
        innerText: (this.quickMessages[i].title || ""),
      });
      actionButtonEl.addEventListener("click", e => this.handleQuickTextMessageClick(e), false);
      let liEl = this.LI();
      liEl.appendChild(actionButtonEl);
      fragmentEl.appendChild(liEl);
    }
    let rightSpacingEl = this.LI();
    style(rightSpacingEl, {
      minWidth: "1px",
    });
    fragmentEl.appendChild(rightSpacingEl);

    if (DomElements.quickMessageComponent) {
      removeAllChildNodes(DomElements.quickMessageComponent);
      DomElements.quickMessageComponent!.appendChild(fragmentEl);
      this.translateIntoView();
    } else {
      LogError(ErrorMessages.QuickMessageComponentMissing);
    }
  }
  
  translateIntoView() {
    if (DomElements.quickMessageComponent) {
      style(DomElements.quickMessageComponent, {
        "display": "flex",
        "flexFlow": "row nowrap",
        "transform": "translateY(-55px)",
      });
    } else {
      LogError(ErrorMessages.QuickMessageUnableTranslate);
    }
  }

  translateOutView() {
    if (DomElements.quickMessageComponent) {
      style(DomElements.quickMessageComponent, {
        "transform": "translateY(55px)",
      });
    } else {
      LogError(ErrorMessages.QuickMessageUnableTranslate);
    }
  }

  handleQuickTextMessageClick(e: Event) {
    this.hide();
    PubSub.publish<MessageStringPayload>({
      event: PublishEventNames.QuickMessageAction,
      payload: {
        message: (e.target as HTMLElement).innerText,
      }
    });
  }
}