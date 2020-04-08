import RichMessageRenderer from '../renderers/RichMessageRenderer';
import TextMessageRenderer from '../renderers/TextMessageRenderer';
import EmojiTextRenderer from '../renderers/EmojiTextRenderer';
import TextQuickMessageController from '../renderers/quickaction/TextQuickMessageController';
import {IMessage} from '../types';
import {Message} from '../service/ChatbotClientInterfaces';
import {BotMessageRenderer} from '../renderers/MessageRenderer';
import {isQuickMessageText} from '../utils/message-validations';
import { getInputType } from '../constants/InputEntities';
import PubSub from '../core/PubSub';
import { PublishEventNames, MessageStringPayload } from '../types/publishevents';

class RenderRegistry {
  textQuickMessageController: TextQuickMessageController;
  rendererRegistry: BotMessageRenderer[];

  constructor() {
    this.rendererRegistry = [
      new TextMessageRenderer(),
      new RichMessageRenderer(),
      new EmojiTextRenderer(),
    ];
    this.textQuickMessageController = new TextQuickMessageController();

    PubSub.subscribe({
      event: PublishEventNames.TranscriptRenderMessages,
      action: payload => this.renderTranscriptMessages(payload.message),
    });
  }

  registerRenderer(renderer: BotMessageRenderer) {
    this.rendererRegistry.push(renderer);
  }

  renderTranscriptMessages(messages: Message[]) {
    for (let i = 0; i < messages.length; i++) {
      // console.log(messages[i]);
      let lastMessage = (i === (messages.length - 1));
      this.renderMessage(messages[i], lastMessage);
    }
  }

  renderMessage(message: Message, lastMessage: boolean) {
    this.rendererRegistry.forEach(renderer => {
      if (renderer.validates(message)) {
        if (lastMessage && isQuickMessageText(message)) {
          setTimeout(() => {
            this._renderQuickReplys(message);
          }, 500);
        }
        // console.log("lastMessage entities: ", message);
        if (lastMessage && message.expectedEntities && message.expectedEntities.length) {
          let inputType = getInputType(message.expectedEntities[0]);
          this.publishInputTypeChange(inputType);
        }
        return renderer.render(message);
      }
      return false;
    });
  }

  protected publishInputTypeChange(inputType: string) {
    PubSub.publish<MessageStringPayload>({
      event: PublishEventNames.InputTypeChange,
      payload: {
        message: inputType,
      },
    });
  }

  protected _renderQuickReplys(message: IMessage): void {
    this.textQuickMessageController.show(message.actions);
  }

}

export default RenderRegistry;