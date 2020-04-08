import HooksList from "../constants/HooksList";

class ClientSender {

  onMessage(botMessage: string) {
    this.post(HooksList.OnMessage, botMessage);
  }

  onGtmEvent(eventmessage: string) {
    this.post(HooksList.OnGtmEvent, eventmessage);
  }

  beforeSend(message: string) {
    this.post(HooksList.BeforeSend, message);
  }

  afterSend(message: string) {
    this.post(HooksList.AfterSend, message);
  }

  sendTermsLink(link: string) {
    this.post(HooksList.TermsLink, link);
  }

  sendImageModalSrc(imageSource: string) {
    this.post(HooksList.ImageModalSource, imageSource);
  }

  sendLearnMoreLink(link: string) {
    this.post(HooksList.LearnMoreLink, link);
  }

  post(hookEvent: string, message: string) {
    parent.postMessage({event: hookEvent, message: message}, "*");
  }

}

export default new ClientSender();