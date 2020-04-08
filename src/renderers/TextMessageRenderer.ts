import { BotMessageRenderer } from './MessageRenderer';
import { Message } from "../service/ChatbotClientInterfaces"
import { isEmoji } from '../utils/Utils';
import { isQuickMessageText, simpleText, userSimpleText } from '../utils/message-validations';

/*
* Renders simple text messages /chatbot
*
**/
export default class TextMessageRenderer extends BotMessageRenderer {
  constructor() {
    super()
  }

  validates(message: Message) {
    if (isQuickMessageText(message)) return true;
    return (simpleText(message) || userSimpleText(message))
            && !isEmoji(message.text || "");
  }

  render(message: Message, sender?: string): boolean {
    let textMessage = message.text || "...";
    let who: string = message.sender || "user";
    if (sender) who = sender;
    const element: HTMLElement = this.Message(textMessage, who);
    this.removeResponseLoader();
    this.appendToTranscript(element);
    return true;
  }
}
