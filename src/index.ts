import Chatbot from './Chatbot';
import Styler from "./core/Styler";
import {ChatbotOptions} from "./types/index";
import CommandsList from "./constants/CommandList";
import {logClientMessage} from "./utils/Loggers";

window.addEventListener("message", (e: MessageEvent) => {
  const {command, payload} = e.data;
  if (command === CommandsList.Style) {
    if (payload.cssLink)
      Styler.addCustomStyles(payload.cssLink);
    if (payload.styleContents && payload.styleId)
      Styler.addStyleTag(payload.styleId, payload.styleContents);  
  }
  if (command === CommandsList.Init) init(payload);
  if (false)
    logClientMessage(e);
});

function init(payload: ChatbotOptions) {
  if (!payload.tenant) throw new Error("Tenant is required");
  // console.log("ChatbotOptions payload: ", payload);

  new Chatbot({
    tenant: payload.tenant,
    eTag: payload.eTag,
    topScreen: payload.topScreen,
    // eTag: "7f8f9fd9d74fca31a2e2dbfced974f7584c8cdaf",
    // eTag: "e4f092de133fd503e299c6a2b0a809049b9ea957", // RHB eTag
    // eTag: "bfc8bb0427ab6fede9527cb0dc76786260a395df", // UOB eTag
  });
};
