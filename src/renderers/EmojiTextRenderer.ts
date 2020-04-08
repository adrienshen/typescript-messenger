import { BotMessageRenderer } from './MessageRenderer';
import { Message } from "../service/ChatbotClientInterfaces";
import ClassNames from "../constants/ClassNames";
import { isEmoji } from '../utils/Utils';
import { userSimpleText, simpleText } from '../utils/message-validations';

/*
* Renders emoji text messages /chatbot
* @validates
* @render
**/

class EmojiTextRenderer extends BotMessageRenderer {
  constructor() {
    super();
  }

  validates(message: Message) {
    return Boolean((simpleText(message) || userSimpleText(message))
      && (message.text && isEmoji(message.text)));
  }

  render(message: Message) {
    let containerEl = this.LI({classNames: [ClassNames.EmojiTextMessage]}, message.text);
    this.appendToTranscript(containerEl);
    return true;
  }
}

export default EmojiTextRenderer;