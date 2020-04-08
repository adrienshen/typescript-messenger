import { BotMessageRenderer } from "./MessageRenderer";
import {MessageAction, IMessage} from "../types/index";
import {appendMultipleChildren} from "../utils/domhelpers";
import ClassNames from "../constants/ClassNames";
import ErrorMessages from "../constants/ErrorMessages";
import PubSub from "../core/PubSub";
import {PublishEventNames, MessageStringPayload} from "../types/publishevents";
import ClientSender from "../service/ClientSender";
import ScrollArrows from "./ScrollArrows";
import UserTypes from "../constants/UserTypes";
import ScreenConf from "../utils/ScreenConf";

/*
* Renders rich markup and images returned from /chatbot
*
**/
export default class RichMessageRenderer extends BotMessageRenderer {

  constructor() {
    super();
  }

  private richElement({text, elements, sender}: IMessage): boolean {
    let check = (!text && elements && sender === UserTypes.Chatbot);
    return Boolean(check);
  }

  validates(message: IMessage): boolean {
    return this.richElement(message);
  }

  render(message: IMessage): boolean {
    let elements = message.elements;
    if (elements && elements!.length) {
      let listEl = this.LI({classNames: [ClassNames.RichList]});
      let scrollCtn = this.DIV();
      if (ScreenConf.shouldDisplayScrollArrows()) {
        scrollCtn = ScrollArrows.scrollContainerListener(scrollCtn) as HTMLDivElement;
      }
      for (let j = 0; j < elements.length; j++) {
        let richElement = this.renderElement(elements[j]);
        scrollCtn.appendChild(richElement);
      }
      listEl.appendChild(scrollCtn);
      if (ScreenConf.shouldDisplayScrollArrows()) {
        listEl.appendChild(ScrollArrows.render());
      }
      this.transcriptContainerUl.appendChild(listEl);
    } else {
      throw new Error(ErrorMessages.NoRichElementsToRender);
    }
    return true;
  }
  
  protected renderElement(element: IMessage) {
    const {title, text, imageurl, actions} = element;
    let listOfChildren = [];
    let elementContainer = this.ARTICLE();
    if (title && text) {
      listOfChildren.push(this.elementTitleContainer(title, text));
    }
    if (imageurl) {
      listOfChildren.push(this.elementImage(imageurl));
    }
    if (actions && actions.length) {
      listOfChildren.push(this.elementActions(actions));
    }

    let richElement = appendMultipleChildren(elementContainer, listOfChildren);
    return richElement;
  }
  
  protected elementImage(imageSource: string): HTMLElement {
    return this.PICTURE({classNames: [ClassNames.RichElementPicture]}, [
      this.IMG({
          src: imageSource,
          classNames: [ClassNames.RichElementImage],
          height: "150",
          width: "240",
      })
    ]);
  }

  protected elementTitleContainer(title: string, subTitle: string): HTMLElement {
    return this.HGROUP({classNames: [ClassNames.RichElementTitleContainer]}, [
      this.H2({classNames: [ClassNames.RichElementTitle]}, title),
      this.H3({classNames: [ClassNames.RichElementSubTitle]}, subTitle),
    ]);
  }
  
  protected elementActions(actions: MessageAction[]): DocumentFragment {
    let fragmentEl = new DocumentFragment();
    for (let i = 0; i < actions.length; i++) {
      let {title, url} = actions[i];
      let anchorEl = this.A({
        href: url || "#",
        classNames: [ClassNames.RichAction],
      }, title);
      if (url) {
        anchorEl = this.attachLinkListener(anchorEl);
      } else {
        anchorEl = this.attachedActionListener(anchorEl);
      }
      fragmentEl.appendChild(anchorEl);
    }
    return fragmentEl;
  }

  protected attachLinkListener(anchorEl: HTMLAnchorElement) {
    anchorEl.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      let elem = e.target as HTMLAnchorElement;
      ClientSender.sendLearnMoreLink(elem.href);
    });
    return anchorEl;
  }

  protected attachedActionListener(anchorEl: HTMLAnchorElement) {
    anchorEl.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      let elem = e.target as HTMLElement;
      PubSub.publish<MessageStringPayload>({
        event: PublishEventNames.RichElementAction,
        payload: {
          message: elem.innerText,
        },
      });
    }, false);
    return anchorEl;
  }
  
}