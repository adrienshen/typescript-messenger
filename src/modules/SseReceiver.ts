import PubSub from "../core/PubSub";
import {
  PublishEventNames,
  ChatbotMessagePayload,
  PluginActionPayload,
  PluginAction
} from "../types/publishevents";
import ClientSender from "../service/ClientSender";
import Config from "../constants/Config";
import { Message } from "../service/ChatbotClientInterfaces";
import UserTypes from '../constants/UserTypes';

class SseReceiver {
  
  chatbotStream: string = Config.SSE_CHATBOT;
  eventSource: EventSource;
  mostRecentTimestamp: number | null;

  constructor() {
    PubSub.subscribe({
      event: PublishEventNames.DevSimulateBackend,
      action: payload => this._processMessages(payload.message),
    });
    PubSub.subscribe({
      event: PublishEventNames.TranscriptIdReceived,
      action: payload => this.connectSseStream(payload.message),
    });
  }

  private connectSseStream(transcriptId: string) {
    console.log("connectSseStream", transcriptId);
    if (this.eventSource || !transcriptId) return;
    // const currentTs = Date.now() - 1;
    const sseStreamUrl = Config.TEST_SORA_BASE_URL
      + this.chatbotStream
      + `?transcriptId=${transcriptId}&tenant=ringgitplus&since=${Date.now()/1000}`
    // console.log("sseStram,Url: ", sseStreamUrl);
    this.eventSource = new EventSource(sseStreamUrl);
    this.eventSource.addEventListener("message", messageEvent => this._onMessageEvent(messageEvent as MessageEvent));

    // this.eventSource.onopen = messageEvent => {
    //   console.log("OPEN EVENT: ", messageEvent);
    // }

    // close and errors
    this.eventSource.addEventListener('close', messageEvent => this.sseHandleClose(messageEvent));
    this.eventSource.addEventListener('onerror', messageEvent => this.sseHandleError(messageEvent));
  }

  private sseHandleError(messageEvent: any) {
    console.log("ONERROR:", messageEvent);
    console.log('ERROR (CLOSING): ', messageEvent.data);
    this.eventSource.close();
  }

  private sseHandleClose(messageEvent: any) {
    console.log("CLOSE EVENT:", messageEvent);

    if (!messageEvent.data) {
      this.eventSource.close();
      console.log("CLOSE EVENT: CLOSED");
      return;
    }
    
    const err = JSON.parse(messageEvent.data);
    const http_code = err.error.http_code;
    console.log('Status Code: ', http_code);
    if (err.error.http_code < 500) {
      this.eventSource.close();
      console.log("CLOSE EVENT: CLOSED");
    }
  }

  private _onMessageEvent(messageEvent: MessageEvent) {
    let parsedResp = JSON.parse(messageEvent.data);
    console.log("SSE MESSAGE: ", parsedResp.result.messages, `most recent timestamp: ${this.mostRecentTimestamp}`);

    setTimeout(() => {
      this._processMessages(parsedResp.result.messages);
    }, 1500); // give it some time
  }

  private _processMessages(messages: Message[]) {
    
    // Filter out user messages and duplicate timestamps
    const filteredMessages =
      messages.filter((msg) => (msg.sender === UserTypes.Chatbot)
        && (msg.timestamp !== this.mostRecentTimestamp));

    if ("plugin" in filteredMessages[filteredMessages.length - 1]) {
      return this._handlePluginAction(filteredMessages);
    }
  
    this._publishChatbotMessages(filteredMessages);

    // Store the most recent message timestamp to compare later
    this.mostRecentTimestamp = messages[messages.length - 1].timestamp || null;

    // Send new message to client host incase there is a "new message" listener
    ClientSender.onMessage(JSON.stringify(filteredMessages));
  }

  private _handlePluginAction(messages: Message[]) {
    if (!messages || !messages.length) this._handlePluginActionError();
    let plugin = messages[messages.length - 1].plugin;
    delete messages[messages.length - 1].plugin;

    if (messages.length) {
      this._publishChatbotMessages(messages);
      if (plugin) {
        this._publishLoadPlugin(plugin);
      }
    } else {
      this._handlePluginActionError();
    }

  }

  private _publishChatbotMessages(messages: Message[]) {
    // console.log("messages _publishChatbotMessages: ", messages);
    PubSub.publish<ChatbotMessagePayload>({
      event: PublishEventNames.ChatbotMessages,
      payload: {
        message: messages,
      },
    });
  }

  private _publishLoadPlugin(plugin: PluginAction) {
    PubSub.publish<PluginActionPayload>({
      event: PublishEventNames.PluginReceived,
      payload: {
        message: plugin,
      },
    });
  }

  private _handlePluginActionError() {
    console.error("ErrorHandlingPluginAction: not sure what happened SseReceiver:63");
  };

}

export default SseReceiver;