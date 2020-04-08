import ChatbotStorage from "../storage/LocalStorage";
import RenderRegistry from "./RenderRegistry";
import Analytics from "../modules/Analytics";
import PubSub from "../core/PubSub";
import { PublishEventNames } from "../types/publishevents";
import Logger from "../utils/Loggers";
import UiController from "./UiController";
import Transcript from "../modules/Transcript";
import Offline from "../modules/Offline";
import UserMessageSender from "../modules/UserMessageSender";
import DocumentUploader from "../modules/DocumentUploader";
import SseReceiver from "../modules/SseReceiver";
import ClientReceiver from "../modules/ClientReceiver";
import {PluginArea} from "../platform/PluginArea";

class ApplicationController {
  // Core
  uiController: UiController = new UiController();
  renderRegistry: RenderRegistry = new RenderRegistry();

  // Base modules
  googleAnalytics: Analytics;
  transcript: Transcript;
  userMessageSender: UserMessageSender;
  documentUploader: DocumentUploader = new DocumentUploader();

  // Communication modules
  sseReceiver: SseReceiver;
  clientReceiver: ClientReceiver;

  // Plugins and platform
  // pluginSandbox: PluginSandbox = new this.pluginSandbox();
  pluginArea: PluginArea = new PluginArea();

  constructor(eTag: string, tenant: string) {
    this.attachTranscript(eTag, tenant);
    this.attachUserMessageSender();
    this.attachSseReceiver();
    this.attachClientReceiver();
    this.subscriptions();
    new Offline();
  }

  protected attachTranscript(eTag: string, tenant: string) {
    try {
      this.transcript = new Transcript(
        this.getTransciptIdFromStorage(),
        eTag,
        tenant,
      );  
    } catch(err) {
      this.handleTranscriptLoadingError();
    }
  }

  protected attachUserMessageSender() {
    this.userMessageSender = new UserMessageSender();
  }

  protected attachSseReceiver() {
    this.sseReceiver = new SseReceiver();
  }

  protected attachClientReceiver() {
    this.clientReceiver = new ClientReceiver();
  }

  protected handleTranscriptLoadingError() {
    Logger.transcriptLoadingError();
    this.uiController.transcriptLoadingError();
  }

  protected getTransciptIdFromStorage() {
    return ChatbotStorage.getStore().transcriptId || "";
  }

  protected subscriptions() {
    PubSub.subscribe({
      event: PublishEventNames.GmtInit,
      action: (payload) => this.initGtm(payload.message),
    });
  }

  protected initGtm(gtmId: string) {
    if (!this.googleAnalytics && gtmId) {
      this.googleAnalytics = new Analytics(gtmId);
    } else {
      Logger.gtmInitError();
    }
  }
}

export default ApplicationController;