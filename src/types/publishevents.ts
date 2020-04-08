import {IMessage} from "./index";
import { IPluginChatMessage } from "../platform/types";

export enum PublishEventNames {
  UnitTestDoesNotExist = "/unittest/notExist",
  UnitTestEvent = "/unittest/event",
  RichElementAction = "/richElement/action",
  QuickMessageAction = "/quickMessage/action",
  ChatbotMessages = "/chatbot/messages",
  TermsRemove = "/terms/remove",
  TranscriptRenderMessages = "transcript/render/messages",
  TranscriptIdReceived = "transcript/id/received",
  UploadFeatureSwitch = "/upload/featureSwitch",
  UploadStarted = "/upload/started",
  UploadFinished = "/upload/finished",
  UploadAppendObject = "/upload/appendObject",
  MessageSending = "/message/sending",
  MessageFirst = "/message/first",
  MessageFirstSent = "/message/first/sent",
  MessageResponseRendering = "/message/responseRendering",
  MessageSentSuccess = "/message/sent",
  TextboxFocus = "/textbox/focus",
  ClientFirstMessage = "/client/firstmessage",
  ClientMessage = "/client/message",
  InputTypeChange = "/input/type/change",
  GmtInit = "/gmt/init",
  PluginReceived = "/plugin/received",
  PluginDisplayMessage = "/plugin/display",
  PluginSendSoraMessage = "/plugin/send",
  DevSimulateBackend = "/dev/simulate/backend",
}

export interface IFunctions {
  (message?: any): void;
}

export interface Subscription {
  event: PublishEventNames;
  action: IFunctions;
}

export interface Subscriptions {
  event: PublishEventNames[];
  action: IFunctions;
}

export interface IDictionary {
  [name: string] : IFunctions[];
}

export interface PublishEvent<T> {
  event: PublishEventNames;
  payload?: T;
}

export interface BasePayload {
  timestamp?: Date;
}

export interface MessageStringPayload extends BasePayload {
  message: string;
}

export interface UploadFeaturePayload extends BasePayload {
  message: boolean;
}

export interface UploadMessagePayload extends BasePayload {
  message: null;
}

export interface ChatbotMessagePayload extends BasePayload {
  message: IMessage[];
}

export interface MessageFirstPayload extends BasePayload {
  message: {
    transcriptId: string;
    tenant: string;
    eTag: string;
    message: {
      text: string;
    }
  }
}

/**
 * Plugin publishers
 */

export interface PluginAction {
  url: string,
  options: {
    amount: number,
    currency: string,
    description: string,
  }
}

export interface PluginActionPayload extends BasePayload {
  message: PluginAction,
}

export interface PluginMessagePayload extends BasePayload {
  message: IPluginChatMessage;
}
