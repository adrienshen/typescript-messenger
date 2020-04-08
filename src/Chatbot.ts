import { ChatbotOptions } from "./types";
import ScreenConf from "./utils/ScreenConf";
import ApplicationController from "./core/ApplicationController";

export default class Chatbot {
  applicationController: ApplicationController;
  timeStart: Date;

  constructor(options: ChatbotOptions) {
    if (!options.tenant) throw new Error("Must have tenant for Chatbot to function");
    ScreenConf.setScreenConfig(options.topScreen);
    this.timeStart = new Date();
    this.applicationController = new ApplicationController(
      options.eTag || "",
      options.tenant,
    );
  }
}