import PubSub from "../core/PubSub";
import {
  PublishEventNames,
} from "../types/publishevents";
import {
  publishTermsConditionsRemove,
  publishFirstMessageSent,
  publishMessageSending,
  publishMessageSentSuccessEvent,
  publishTextboxFocus
} from "../utils/publishers";
import ChatbotStorage from "../storage/LocalStorage";
import {ChatbotClient} from "../service/ChatbotClient";

import {SendMessageRequest, Message} from "../service/ChatbotClientInterfaces";
import ErrorMessages from "../constants/ErrorMessages";
import { IMessage } from "../types";
import DomElements from "../utils/DomElements";

import TextMessageRenderer from "../renderers/TextMessageRenderer";
import EmojiTextRenderer from "../renderers/EmojiTextRenderer";
import {isEmoji} from "../utils/Utils";

import SpecialCommands from "./SpecialCommands";

class UserMessageSender {
  textMessageRenderer: TextMessageRenderer = new TextMessageRenderer();
  emojiTextRenderer: EmojiTextRenderer = new EmojiTextRenderer();
  timeStamp: number = 0;

  constructor() {
    this.mountListeners();
    this.subscriptions();
    this.focusTextField();
  }

  mountListeners() {
    this.mountMessageSendListener();
    this.mountTexboxEnterListener();
    this.mountTextboxFocusListener();
    this.mountTextboxChangeListener();
  }

  protected subscriptions() {
    const {
      RichElementAction,
      QuickMessageAction,
      ClientMessage,
      UploadFinished,
      ChatbotMessages,
      MessageFirst,
      UploadStarted,
      InputTypeChange,
      PluginSendSoraMessage,
    } = PublishEventNames;

    PubSub.subscribeMany({
      event: [RichElementAction, QuickMessageAction, ClientMessage,],
      action: payload => this.messageActionWatcher(payload.message),
    });
    PubSub.subscribeMany({
      event: [
        UploadFinished,
        ChatbotMessages,
      ],
      action: () => this.setUserInputLock(false),
    });
    PubSub.subscribe({
      event: MessageFirst,
      action: payload => this.sendFirstApplyMessage(payload.message),
    });
    PubSub.subscribe({
      event: UploadStarted,
      action: () => this.setUserInputLock(true),
    });
    PubSub.subscribe({
      event: InputTypeChange,
      action: payload => this.changeInputType(payload.message),
    });
    PubSub.subscribe({
      event: PluginSendSoraMessage,
      action: payload => this.sendPluginMessage(payload.message),
    });
  }

  protected mountMessageSendListener(): void {
    if (DomElements.userSubmit)
      DomElements.userSubmit.addEventListener("click", () => this.send(), false);
  }

  protected mountTextboxFocusListener(): void {
    if (DomElements.userInputField.parentElement) {
      DomElements.userInputField.parentElement.addEventListener("click", () => {
        publishTextboxFocus();
      }, false);
    }
  }

  protected mountTextboxChangeListener(): void {
    DomElements.userInputField.addEventListener("input", e => this.onMessageFieldChange(e.target), false);
  }

  protected mountTexboxEnterListener(): void {
    DomElements.userInputField.addEventListener("keyup", ({key}) => {
      if (key === "Enter") this.send();
      if (key === "Escape") this.clearUserInput();
      return;
    }, false);
  }

  protected onMessageFieldChange(target: any) {
    DomElements.userSubmit.disabled = !target.value.length;
  }

  protected focusTextField = () => DomElements.userInputField.focus();
  protected messageActionWatcher = (message: string) => this.send(message);

  send(optionalMessageText?: string): void {
    this.setUserInputLock(true);
    publishTermsConditionsRemove();
    let userMessage = optionalMessageText || DomElements.getCurrentInputFieldValue();
    userMessage = userMessage.trim();

    if (this.handleInvalidInputs(userMessage)) return;
    // Handles commands like "logout"
    if (SpecialCommands.routeCommand(userMessage)) return;

    let message = {text: userMessage};
    const {transcriptId, eTag, tenant} = ChatbotStorage.getStore();
    let payload = {transcriptId, message, eTag, tenant};

    publishMessageSending();
    this.sendUserMessage(payload);
  }

  handleInvalidInputs(userMessage: string): boolean {
    /* Handle invalid text inputs */
    if (!userMessage.length) return true;
    return false;
  }

  protected handleSendUserMessage(message: Message) {
    if (isEmoji(message.text || "")) return this.emojiTextRenderer.render(message);

    // Don't render "Apply for..."
    if (message.isFirst) return;
    return this.textMessageRenderer.render(message);
  }

  // There are two sendMessage() right now because, sendLocalMessage()
  // is for local express sse mock server.
  public async sendFirstApplyMessage(payload: SendMessageRequest) {
    try {
      await ChatbotClient.sendMessage(payload);
      this.handleSendMessageSuccess(payload.message);
      publishFirstMessageSent();
    } catch(err) {
      this.handleSendMessageFailure(err);
    }
  }

  protected async sendUserMessage(payload: SendMessageRequest) {
    try {
      // await ChatbotClient.sendLocalMessage(payload);
      await ChatbotClient.sendMessage(payload);
      this.handleSendMessageSuccess(payload.message);
    } catch(err) {
      this.handleSendMessageFailure(err);
    }
  }

  protected async sendPluginMessage(pluginPayload: any) {
    // implement sending plugin message
    console.log("sendPluginMessage: ", pluginPayload);
  }

  protected handleSendMessageSuccess(message: IMessage) {
    this.handleSendUserMessage(message);
    this.textMessageRenderer.appendResponseLoader();
    publishMessageSentSuccessEvent();
    this.clearUserInput();
    DomElements.userInputField.focus();
  }

  protected handleSendMessageFailure(err: Error) {
    console.error(ErrorMessages.SendMessageFailure, err);
    window.setTimeout(() => {
      this.setUserInputLock(false);
      DomElements.userInputField.focus();
    }, 1000);
    window.setTimeout(() => {
      publishTextboxFocus();
    }, 1300);
  }

  clearUserInput() {
    this.timeStamp = 0;
    DomElements.userInputField.value = "";
  }

  setUserInputLock(inputState: boolean): boolean {
    let textFieldValue = DomElements.userInputField.value;
    DomElements.userInputField.disabled = inputState;
    DomElements.userSubmit.disabled = inputState;
    if (inputState === false) {
      // check if textfield is empty or not
      DomElements.userSubmit.disabled = textFieldValue ? false : true;
      this.focusTextField();
    }
    return inputState;
  }

  changeInputType(inputType: string): void {
    DomElements.userInputField.type = inputType;
  }

}

export default UserMessageSender;
