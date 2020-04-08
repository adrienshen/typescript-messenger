import ElementIds from "../../constants/ElementIds";
import PluginBase from "../PluginBase";
import { IPluginChatMessageType } from "../types";

class PluginDomElements {
  payNowAction: HTMLElement | null;
  secondaryButton: HTMLElement | null;
  closePluginEl: HTMLElement | null;

  constructor() {
    this.payNowAction = document.getElementById(ElementIds.PayNowAction);
    this.closePluginEl = document.getElementById("close-action");
  }
}

/**
 * Plugin for Sora must extend from PluginBase
 * must implement methods: onActivate(), onConnect(), onInitPayload()
 * optionally implement: onChatMessage()
 * api interface: sendChatMessage(), showChatMessage()
 * must implement properties: version: string, pluginName: string, pluginScope: string
 */

class HelloPlugin extends PluginBase {
  pluginDomElements: PluginDomElements;
  version: string = "1.0.0";
  pluginName: string = "HelloPlugin";

  constructor() {
    super();
    this.pluginDomElements = new PluginDomElements();
    this.bindEventHandlers();
  }

  // must implement
  public onPluginActivate() {
    console.log("onActivate hook...");
  }

  // must implement
  public onPluginConnect() {
    console.log("onConnect hook...", this.isConnected);

  }

   // must implement
  public onPluginInitPayload() {
    console.log("in onInitPayload handlers", this.pluginOptions);
  }

  public onPluginDestroy() {
    console.log("onDestroy hook...");
  }

  /**
   * Plugin specific logic and implementations
   */
  bindEventHandlers() {
    this.pluginDomElements.payNowAction!.addEventListener("click", () => {
      this.sendMessage("hi, there! plugin connected.", IPluginChatMessageType.HighPriority);
    });

    document.getElementById("secondary-action")!.addEventListener("click", () => {
      this.displayMessage("display this message", IPluginChatMessageType.Normal);
    });

    document.getElementById("close-action")!.addEventListener("click", () => {
      this.disconnect();
    });
  }

  // sayVersion() {
  //   console.log("From hello plugin v" + this.version);
  // }

  processPayment() {
    // ...
    // process payments
    document.getElementById("price")!.innerHTML = "";
    document.getElementById("description")!.innerHTML = "";
    document.body.innerHTML = "Loading..."

    setTimeout(() => {
      document.body.innerHTML = "OK";
    }, 1500)
  }

  updateFields(pluginOptions: any) {
    console.log("Here,..", pluginOptions.amount);
    if (document.getElementById("price")) {
      document.getElementById("price")!.innerHTML =
        "price: " + pluginOptions.amount;
    }
    if (document.getElementById("description")) {
      document.getElementById("description")!.innerHTML =
        "Description: " + pluginOptions.description;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HelloPlugin();
});
