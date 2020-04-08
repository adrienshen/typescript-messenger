import PubSub from "../core/PubSub";
import {PublishEventNames} from "../types/publishevents";
import ErrorMessages, { LogError } from "../constants/ErrorMessages";
import ClientSender from "../service/ClientSender";

interface GmtPayload {
  event: string;
  payload?: any;
}

class Analytics {

  constructor(gtmId: string) {
    this.insertGtm(gtmId);
    this.eventSubscriptions();
  }

  eventSubscriptions() {
    PubSub.subscribe({
      event: PublishEventNames.ChatbotMessages,
      action: payload => this.eventRouter({event: "messageReceived", payload}),
    });
    PubSub.subscribe({
      event: PublishEventNames.MessageSentSuccess,
      action: payload => this.eventRouter({event: "messageSent", payload}),
    });
  }

  insertGtm(gtmId: string) {
    let gmtScriptEl = document.createElement("SCRIPT");
    gmtScriptEl.innerText = this.baseGtmScript(gtmId);
    document.getElementsByTagName("head")[0].appendChild(gmtScriptEl);
  }

  protected baseGtmScript = (gtmId: string) =>
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');`

  protected eventRouter = ({event, payload}: GmtPayload) => {
    if (event === "messageSent") this.pushDataLayer(event);
    else if (event === "messageReceived" && this.messageReceivedValidator(payload)) this.handleMessagesReceived(payload.message);
    else this.handleError();
  }

  protected handleMessagesReceived = (messages: any) => {
    for (let i = 0; i < messages.length; i++) {
      // messages[i].event = '{"event":"unhandled","intentName":"unknown"}';
      if (!messages[i].event) {
        continue;
      }
      this.pushDataLayer(
        JSON.parse(messages[i].event).event
      );
    }
  }

  protected handleError = () => {
    LogError(ErrorMessages.NonSpecifiedGtmEvent);
  }

  protected messageReceivedValidator = (payload: any) => payload.message.length;

  pushDataLayer = (eventString: string) => {
    if ('dataLayer' in window && eventString) {
      (window as any).dataLayer.push({ event: eventString });
      ClientSender.onGtmEvent(eventString);
    }
  }

}

export default Analytics;