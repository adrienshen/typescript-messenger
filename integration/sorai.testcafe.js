

import {Selector} from "testcafe";
import { ClientFunction } from "testcafe";
const ElementIds = {
  ChatContainer: "ChatContainer",
  UserActionsContainer: "user-actions-container",
  QuickMessageActions: "quick-message-actions",
  FileUploader: "file-uploader",
  TranscriptAreaUl: "transcript-area-ol",
  TranscriptArea: "transcript-area",
  UserReply: "user-reply",
  ReplySubmit: "reply-submit",
  PluginArea: "plugin-area",
  PayNowAction: "paynow-action",
}

fixture `Sora Chatbot`
  .page `http://localhost:3000/`


test("Chatbot client to sora interface is working", async t => {

  await t.maximizeWindow()
    .setTestSpeed(0.3)
    .switchToIframe("SoraChatFrame")
});
