
"use strict";

import DomElements from "../utils/DomElements";
import ClassNames from "../constants/ClassNames";
import PubSub from "../core/PubSub";
import { PublishEventNames, PluginAction } from "../types/publishevents";
import { MessagingChannel } from "jschannel";
import { IChannelMethodBindings, IPluginChatMessage } from "./types";
import { publishPluginDisplayMessage, publishPluginSendSoraMessage } from "../utils/publishers";

// -- slides itself up and down
// -- closes conn. with plugins
// -- only loads one plugin at a time, and mananges all plugins
// -- handles and routes plugin iframe comm. data to the rest of chatbot, eg. Transcript{}
// -- handles and routes chatbot comm. to the plugin iframe

export class PluginArea {

  pluginAreaInView: boolean = false;
  pluginLoaded: boolean = false;
  pluginName: string;
  private pluginIframe: HTMLIFrameElement;
  private iframeSrc: string = "plugins/hello.html"; // temporary
  private pluginsChan: MessagingChannel;

  constructor() {
    console.log("plugin area: ", DomElements.pluginComponent);

    PubSub.subscribe({
      event: PublishEventNames.PluginReceived,
      action: payload => this.handlePluginReceived(payload.message),
    });
    PubSub.subscribe({
      event: PublishEventNames.MessageSending,
      action: () => this.slideOutOfView(),
    });
  }

  private handlePluginReceived(plugin: PluginAction) {
    console.log("plugin action: ", plugin);
    this.loadPluginIframe(plugin);
  }

  private loadPluginIframe(plugin: PluginAction) {
    if (DomElements.pluginComponent) {
      this.pluginIframe = DomElements.pluginComponent.getElementsByTagName("iframe")[0];
      console.log("iframe inside plugin area: ", this.pluginIframe);
      this.slideIntoView();
      this.pluginIframe.id = "PluginSandboxFrame";
      this.pluginIframe.src = this.iframeSrc;
      this.postMessageChannels(plugin);
      return this.pluginIframe.src;
    } else {
      this.logComponentNotFound();
      return false;
    }
  }

  private async postMessageChannels(plugin: PluginAction) {
    await import(/* webpackChunkName: "jschannel" */'jschannel').then((jschannel: any) => {
      const chan = jschannel.default;

      this.pluginsChan = chan.build({
        window: this.pluginIframe.contentWindow,
        origin: "*",
        scope: "plugin:channel",
        onReady: () => {
          console.log("channel is ready!");
        }
      });

      this.pluginsChan.call({
        method: IChannelMethodBindings.PluginInit,
        params: plugin.options,
        success: (resp: any) => {
          console.log(resp.toString());
        },
      });

      this.pluginsChan.bind(IChannelMethodBindings.SendMessage, (context: any, params: IPluginChatMessage) => {
        console.log("IChannelMethodBindings.SendMessage: ", params);
        if (!context.origin) throw "no origin";
        publishPluginSendSoraMessage(params);
      });

      this.pluginsChan.bind(IChannelMethodBindings.DisplayMessage, (context: any, params: any) => {
        console.log("IChannelMethodBindings.DisplayMessage: ", params);
        if (!context.origin) throw "no origin";
        publishPluginDisplayMessage(params);
      });

      this.pluginsChan.bind(IChannelMethodBindings.Disconnect, (context: any, params: any) => {
        console.log("IChannelMethodBindings.Disconnect: ", params);
        if (!context.origin) throw "no origin";
        this.slideOutOfView();
      });

    });

  }

  private slideIntoView() {
    if (!this.pluginAreaInView && DomElements.pluginComponent && DomElements.chatContainer) {
      this.pluginAreaInView = true;
      let pluginArea = DomElements.pluginComponent.classList.add(ClassNames.PluginAreaShow);
      DomElements.chatContainer.classList.add(ClassNames.ChatContainerPlugin);
      return pluginArea;
    }
    this.logComponentNotFound();
  }

  private slideOutOfView() {
    if (this.pluginAreaInView) {
      if (DomElements.pluginComponent && DomElements.chatContainer) {
        this.pluginAreaInView = false;
        DomElements.chatContainer.classList.remove(ClassNames.ChatContainerPlugin);
        this.destroyIframeContents();
        return DomElements.pluginComponent.classList.remove(ClassNames.PluginAreaShow);
      } else {
        this.logComponentNotFound();
      }
    }
    return;
  }

  logComponentNotFound() {
    throw Error("DomElements.pluginComponent: does not exist");
  }

  private destroyIframeContents() {
    // ... destroy the inner html / clear listeners here
    if (this.pluginIframe) {
      this.pluginsChan.destroy();
      this.pluginIframe.src = "about:blank";
      this.pluginIframe.innerHTML = "";      
      console.log('iframe destroy: ', this.pluginIframe.src);
    }
  }
}
