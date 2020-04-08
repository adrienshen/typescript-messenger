import UserTypes from "../../constants/UserTypes";

"user strict";

export enum IPluginChatMessageType {
  Normal = "normal",
  HighPriority = "high_priority",
  Error = "error",
}

export interface IPluginChatMessage {
  timestamp: Date;
  text: string;
  type: IPluginChatMessageType;
  pluginName: string;
  sender: UserTypes;
}

export enum IPluginChatMessageResponseResult {
  Success = "success",
  Failed = "failed",
}

export interface IPluginChatMessageResponse {
  message: IPluginChatMessage;
  results: IPluginChatMessageResponseResult;
}

export enum IChannelMethodBindings {
  PluginInit = "pluginInit",
  ClosePlugin = "closePlugin",
  SendMessage = "sendMessage",
  DisplayMessage = "displayMessage",
  Disconnect = "disconnect",
}