import ChatbotStorage from "../storage/LocalStorage";
import {Message} from '../service/ChatbotClientInterfaces';
import {ChatbotClient} from '../service/ChatbotClient';
import PubSub from '../core/PubSub';
import {
  PublishEventNames,
} from "../types/publishevents";
import ErrorMessages, { LogError } from "../constants/ErrorMessages";
import DomElements from "../utils/DomElements";
import ElementIds from "../constants/ElementIds";
import {
  publishTermsConditionsRemove,
  sendFirstQuery,
  publishRenderTranscriptMessages,
  publishMessageResponseRendering,
  publishTranscriptIdReceived
} from "../utils/publishers";
import Config from "../constants/Config";

export default class Transcript {
  initialQuery: string;
  transcriptId: string;
  tenant: string;
  since: any;
  eTag: string;
  timeout: number;

  constructor(transcriptId: string, eTag: string, tenant: string) {
    console.log("transcriptId: ", transcriptId);
    this.transcriptId = transcriptId;
    // this.transcriptId = "-0n_33MlawoOc0-OE38ss-MA5QOKY_2oqE_1jZ-o6B4=";
    this.tenant = tenant;
    this.eTag = eTag;
    this.timeout = 100;

    this.mountEventListerners();
  }

  protected mountEventListerners() {
    const {
      TextboxFocus,
      QuickMessageAction,
      UploadAppendObject,
      MessageSending,
      ChatbotMessages,
      MessageFirstSent,
      ClientFirstMessage,
      PluginDisplayMessage,
    } = PublishEventNames;

    PubSub.subscribeMany({
      event: [TextboxFocus, QuickMessageAction, UploadAppendObject, MessageSending,],
      action: () => this.scrollBottom(),
    }),
    PubSub.subscribe({
      event: ChatbotMessages,
      action: payload => this.renderTranscriptMessages(payload.message),
    });
    PubSub.subscribe({
      event: MessageFirstSent,
      action: () => this.fetchTranscript(),
    });
    PubSub.subscribe({
      event: ClientFirstMessage,
      action: payload => this.onFirstClientMessageFetchTranscript(payload.message),
    });
    PubSub.subscribe({
      event: PluginDisplayMessage,
      action: payload => this.renderPluginDisplayMessage(payload.message),
    });
  }

  protected onFirstClientMessageFetchTranscript(initialMessage: string) {
    this.initialQuery = initialMessage;
    this.fetchTranscript();
  }

  async fetchTranscript() {
    try {
      let response = await ChatbotClient.getTranscript(this.getTranscriptOpts());
      let {data, statusCode} = response;
      if (response && data && (statusCode === 200)) {
        this.storeTranscriptId(data.transcriptId);
        this.handleTranscriptResponse(response.data);
      } else {
        LogError(ErrorMessages.GetTranscriptError);
      }
    } catch(err) {
      LogError(ErrorMessages.FailureFetchTranscript, err);
    }
  }

  protected getTranscriptOpts() {
    let transcriptOpts = {
      tenant: this.tenant || "ringgitplus",
      eTag: this.eTag || "",
      timeout: this.timeout,
      transcriptId: this.transcriptId,
    }
    return transcriptOpts;
  }

  protected storeTranscriptId(transcriptId: string): void {
    this.transcriptId = transcriptId;
    ChatbotStorage.saveTranscriptId(transcriptId);
    ChatbotStorage.saveTenant(this.tenant);
  }

  protected handleTranscriptResponse(respTranscript: any) {
    if (respTranscript.messages && respTranscript.transcriptId) {
      this.renderTranscriptMessages(respTranscript.messages);
      publishTranscriptIdReceived(respTranscript.transcriptId);
      return;
    }

    return sendFirstQuery({
      transcriptId: this.transcriptId,
      message: {
        text: this.initialQuery,
        isFirst: true 
      },
      eTag: this.eTag,
      tenant: this.tenant,
    });
  }

  renderTranscriptMessages(messages: Message[]): void {
    if (this.transcriptId && this.initialQuery) publishMessageResponseRendering(this.transcriptId);
    // Beginning of chat has 4 messages before any user generated message
    if (messages.length > Config.TNC_MINIMUM) publishTermsConditionsRemove();
    if (messages.length) {
      console.log("TRANSCRIPT{} ", messages, Date.now());
      publishRenderTranscriptMessages(messages);
    }

    this.scrollBottom();
  }

  renderPluginDisplayMessage(pluginMessage: any[]) {
    // implement append transcript message to Transcript
    console.log("renderPluginDisplayMessage: ", pluginMessage);
  }

  scrollBottom() {
    if (!DomElements.transcriptContainer) {
      DomElements.transcriptContainer = document.getElementById(ElementIds.TranscriptArea);
    }
    window.setTimeout(() => {
      DomElements.transcriptContainer!.scrollBy({
        top: DomElements.transcriptContainer!.scrollHeight,
        behavior: 'smooth',
      });
    }, 300); /* must wait 300ms for android keyboard to rise */
  }

}
