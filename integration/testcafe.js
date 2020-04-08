import {Selector} from "testcafe";
import {ClientFunction} from "testcafe";
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

const getPageUrl = ClientFunction(() => window.location.href);
const mobileDevicesWidth = 425;
  
test("Chat Iframe loads correctly and basic checks pass", async t => {
  let userReply = Selector("#" + ElementIds.UserReply);
  let submitButton = Selector("#" + ElementIds.ReplySubmit);
  let sendMessage = "hello testcafe";
  let lastMessageAppended = Selector(`#${ElementIds.TranscriptAreaUl} li`).withText(sendMessage);
  const transcriptList = Selector("#" + ElementIds.TranscriptAreaUl).exists;
  let isDisabled;
  let uploadedImage;

  let clientMessageCounter = Selector(`#notif-count-value`);
  console.log("clientMessageCounter: ", clientMessageCounter);

  await t.maximizeWindow()
    .setTestSpeed(0.3)
    .switchToIframe("#SoraChatFrame")
    .expect(transcriptList).ok()

    // is send message hook working?
    .typeText(userReply, sendMessage)
    .click(submitButton)
    .expect(clientMessageCounter.value).eql(0)

  // Test for small screen width less than 800w
  await t.resizeWindow(mobileDevicesWidth, 750)
    .expect(transcriptList).ok();

  // User should not be able to send message if input field is empty after previous message is sent
  userReply = Selector(`#${ElementIds.UserReply}`);
  isDisabled = submitButton.withAttribute("disabled");
  await t
    .expect(isDisabled).ok("should be disabled")
    .expect(userReply.innerText).eql("");

  // Test user send message
  await t
    .typeText(userReply, sendMessage)
    .click(submitButton);
  
  isDisabled = submitButton.withAttribute("disabled");

  await t
    .expect(lastMessageAppended.innerText).eql(sendMessage)
    .expect(userReply.value).eql("")
    .expect(isDisabled).ok("");

  // test cient hooks


  // User should be able to upload image to chatbox
  isDisabled = submitButton.withAttribute("disabled");
  await t
    .setFilesToUpload('#file-uploader', "test_upload.png")
  uploadedImage = Selector(".image-message").exists;
  await t
    .expect(uploadedImage).ok();

  const richActionElem = Selector(".rich-action").nth(0);
  await t
    .expect(richActionElem.innerText).eql("Learn More")
    .click(richActionElem)
});

test("Chatbot transcript area shows and loads in plugin", async t => {

  let userReply = Selector("#" + ElementIds.UserReply);
  const transcriptList = Selector("#" + ElementIds.TranscriptAreaUl).exists;
  let submitButton = Selector("#" + ElementIds.ReplySubmit);
  const paymentPluginCommand = "/payment";

  // Test for small screen width less than 800w
  await t
    .setTestSpeed(0.9)
    .switchToIframe("#SoraChatFrame")
    .resizeWindow(mobileDevicesWidth, 750)
    .expect(transcriptList).ok();

  await t
    .typeText(userReply, paymentPluginCommand)
    .click(submitButton)
    .expect(Selector(".plugin-area--show").exists).ok()
    .switchToIframe("#PluginSandboxFrame")
    .expect(Selector("#paynow-action").exists).ok()
    .click(Selector("#paynow-action"))
    .click(Selector("#secondary-action"))
    .click(Selector("#close-action"))
    .expect(Selector(".plugin-area--show").exists).notOk()
})