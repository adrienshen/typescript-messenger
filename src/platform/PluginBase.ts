import { MessagingChannel } from "jschannel";
import {
  IPluginChatMessageType,
  // IPluginChatMessageResponse,
  IPluginChatMessage,
  IChannelMethodBindings
} from "./types";
import UserTypes from "../constants/UserTypes";
// const chan = require("jschannel");

interface IPluginBase {
  /**
   * Plugin name
   */
  pluginName: string;

  /**
   * jschannel connect to parent chatbot
   */
  chatbotChannel: MessagingChannel;

  /**
   * Runs when plugin is loaded and activated
   */
  onPluginActivate(): void;

  /**
   * Runs when plugin is connected
   */
  onPluginConnect(): void;

  /**
   * Sends message to chatbot services
   */
  sendMessage(messageText: string, type: IPluginChatMessageType): void;

  /**
   * Displays message user chat transcript, but does not send to services
   */
  displayMessage(messageText: string, type: IPluginChatMessageType): void;
}

export default abstract class PluginBase implements IPluginBase {

  abstract version: string;
  abstract pluginName: string;
  isConnected: boolean = false;
  isInView: boolean = false;
  pluginOptions: any = {};
  chatbotChannel: MessagingChannel;

  constructor() {
    this.onPluginActivate();
    this._connect();
  }

  sendMessage(messageText: string, messageType: IPluginChatMessageType) {
    // console.log("MESSAGE FROM PLUGIN CHILD: ", messageText, messageType);
    this._sendMessageToSoraServices({
      timestamp: new Date(),
      text: messageText,
      type: messageType,
      pluginName: this.pluginName,
      sender: UserTypes.Plugin,
    });
  }

  displayMessage(messageText: string, messageType: IPluginChatMessageType) {
    // console.log("MESSAGE FROM PLUGIN CHILD: ", messageText, messageType);
    if (messageText.length && messageType) {
      this._sendDisplayMessageToChatbot({
        timestamp: new Date(),
        text: messageText,
        type: messageType,
        pluginName: this.pluginName,
        sender: UserTypes.Plugin,
      });
    }
  }

  private _sendDisplayMessageToChatbot(pluginChatMessage: IPluginChatMessage) {
    // console.log("pluginChatMessage", pluginChatMessage);
    this.chatbotChannel.call({
      method: IChannelMethodBindings.DisplayMessage,
      params: pluginChatMessage,
      success: (response) => console.log("chatbot display response: ", response),
    });
  }

  private _sendMessageToSoraServices(pluginChatMessage: IPluginChatMessage) {
    // console.log("pluginChatMessage", pluginChatMessage);
    this.chatbotChannel.call({
      method: IChannelMethodBindings.SendMessage,
      params: pluginChatMessage,
      success: (response) => console.log("chatbot send response: ", response)
    });
  }

  private async _connect() {
    console.log("this.chatbotChannel: ", this.chatbotChannel);

    await import("jschannel").then((jsChannel: any) => {
      const chan = jsChannel.default;

      this.chatbotChannel = chan.build({
        window: window.parent,
        origin: "*",
        scope: "plugin:channel",
      });
      if (this.chatbotChannel) {
        this.isConnected = true;
        console.log(`Plugin connected to parent chatbot via plugin:channel`);
        this.onPluginConnect();
        this._pluginInitBind();
      }
    });
  }

  private _pluginInitBind() {
    this.chatbotChannel.bind("pluginInit", (transaction: any, payload: any) => {
      // console.log("payload: ", payload);
      if (transaction.origin) {
        this.pluginOptions = payload;
        this.onPluginInitPayload();
        return "ok, payload loaded into plugin";
      } else {
        return console.error("No jschannel origin");
      }
    });
  }

  protected disconnect() {
    this.chatbotChannel.notify({
      method: IChannelMethodBindings.Disconnect,
      params: {},
    });
  }

  abstract onPluginActivate(): void;
  abstract onPluginConnect(): void;
  abstract onPluginInitPayload(): void;
  // abstract render(): void;

}