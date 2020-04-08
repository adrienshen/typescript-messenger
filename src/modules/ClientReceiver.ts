import PubSub from "../core/PubSub";
import {
  PublishEventNames,
} from "../types/publishevents";
import CommandList from "../constants/CommandList";
import TermsConditions from "../renderers/TermsConditions";
import {
  publishGmtInit,
  publishUploadFeatureSwitch,
  publishSendMessageFromClient,
  publishSendInitialMessage,
  publishSimulatedBackend
} from "../utils/publishers";

interface Routes {
  [key: string]: any;
}

class ClientReceiver {
  private sendMessageCount: number = 0;
  private firstMessageSent: boolean = false;
  private remainingMessagesQueue: string[] = [];
  private routes: Routes = {
    "send": (message: string) => this.sendMessage(message),
    "tnc": (message: string) => this.handleTnc(message),
    "gtm": (message: string) => this.handleGtm(message),
    "upload": (message: boolean) => this.handleUpload(message),
    "simulateBackend": (message: string) => this.handleSimulateBackend(message),
  }

  constructor() {
    window.addEventListener("message", (e: MessageEvent) => this.processClientMessages(e), false);
    PubSub.subscribe({
      event: PublishEventNames.MessageResponseRendering,
      action: (payload) => this.processMessageQueue(payload.message),
    });
  }

  processClientMessages(messageEvent: MessageEvent) {
    // console.log("processClientMessages ", messageEvent);
    const {command, payload} = messageEvent.data;
    if (command === CommandList.Style) return;
    if (!payload) return;
    this.routes[command](payload);
  }

  protected sendMessage(message: string) {
    if (!this.sendMessageCount) {
      this.sendMessageCount ++;
      return publishSendInitialMessage(message);
    }

    if (this.firstMessageSent) {
      // This supports sent events that happen after the initial queue of events, such as with
      // button click events from the client
      this.publishSendMessage(message);
    } else {
      // Because first message response is not finished at this point, we need to store the remaining messages in
      // a queue to process after the first message finishes in a sequential manner, one message after another
      this.remainingMessagesQueue.push(message);
    }
    this.sendMessageCount ++;
  }

  protected handleTnc(message: string) {
    TermsConditions.setClientTnc(message);
  }

  protected handleGtm(gtmId: string) {
    publishGmtInit(gtmId);
  }

  protected handleUpload(uploadFeature: boolean) {
    publishUploadFeatureSwitch(uploadFeature);
  }

  protected handleSimulateBackend(backendMessage: any) {
    console.log("backendMessage: ", JSON.parse(backendMessage));
    publishSimulatedBackend([JSON.parse(backendMessage)]);
  }

  protected processMessageQueue(transcriptId: string) {
    this.firstMessageSent = true;
    if (!this.remainingMessagesQueue.length) return;
    if (!transcriptId) return;

    let nextMessage = this.remainingMessagesQueue.shift();
    if (!nextMessage) return this.remainingMessagesQueue;
    if (nextMessage) {
      this.onNextTick(() =>
        this.publishSendMessage(nextMessage as string)
      );
    }
    return this.remainingMessagesQueue;
  }

  protected publishSendMessage(message: string) {
    publishSendMessageFromClient(message);
  }

  protected onNextTick(func: () => void) {
    window.setTimeout(func, 0);
  }

}

export default ClientReceiver;