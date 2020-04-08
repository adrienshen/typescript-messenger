import ElementIds from "../constants/ElementIds";
import ClassNames from "../constants/ClassNames";

class DomElements {

  chatContainer: HTMLElement|null;
  transcriptContainer: HTMLElement|null;
  transcriptContainerUl: HTMLElement|null;
  userInputField: HTMLInputElement;
  userSubmit: HTMLButtonElement;
  userActionsContainer: HTMLElement|null;
  fileUploader: HTMLElement|null;
  quickMessageComponent: HTMLElement|null;
  pluginComponent: HTMLElement|null;
  offlineComponent: HTMLElement|null;

  constructor() {
    this.chatContainer = document.getElementById(ElementIds.ChatContainer);
    this.transcriptContainer = document.getElementById(ElementIds.TranscriptArea);
    this.transcriptContainerUl = document.getElementById(ElementIds.TranscriptAreaUl);
    this.userInputField = document.getElementById(ElementIds.UserReply) as HTMLInputElement;
    this.userSubmit = document.getElementById(ElementIds.ReplySubmit) as HTMLButtonElement;
    this.userActionsContainer = document.getElementById(ElementIds.UserActionsContainer);
    this.fileUploader = document.getElementById(ElementIds.FileUploader) as HTMLInputElement;
    this.quickMessageComponent = document.getElementById(ElementIds.QuickMessageActions) as HTMLElement;
    this.offlineComponent = document.getElementsByClassName(ClassNames.OfflineComponent)[0] as HTMLElement;
    this.pluginComponent = document.getElementById(ElementIds.PluginArea) as HTMLElement;
  }

  getCurrentInputFieldValue() {
    let userReplyEl = document.getElementById(ElementIds.UserReply) as HTMLInputElement;
    return userReplyEl.value;
  }

}

export default new DomElements();