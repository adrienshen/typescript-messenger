import {
  PublishEvent,
  BasePayload,
  Subscription,
  Subscriptions,
  IDictionary,
} from "../types/publishevents";

class PubSub {

  devMode: boolean = (location.origin.indexOf("localhost") > -1) || false;
  registry: IDictionary = {};

  publish<T extends BasePayload>(publishEvent: PublishEvent<T>): void {
    if (!this.registry[publishEvent.event]) return;
    // if (this.devMode) console.log(publishEvent.event + " published!");
    this.registry[publishEvent.event].forEach(func => {
      func.apply(null, [publishEvent.payload]);
    });
  }

  subscribe(subscription: Subscription): void {
    if (!this.registry[subscription.event]) {
      this.registry[subscription.event] = [subscription.action];
    } else {
      this.registry[subscription.event].push(subscription.action);
    }
  }

  subscribeMany(subscriptions: Subscriptions): void {
    subscriptions.event.forEach(event => {
      // console.log("events: ", event, subscriptions.action);
      this.subscribe({
        event: event,
        action: subscriptions.action,
      });
    });
  }

  // unsubscribe(event: string, func: ISubscription) {
  //   if (!this.registry[event]) {
  //     return -1;
  //   }
  //   let eventFns = this.registry[event];
  //   for (let i = 0; i < eventFns.length; i++) {
  //     if (func.name === eventFns[i].name) {
  //       eventFns.splice(i, i+1);
  //     }
  //   }
  //   this.registry[event] = eventFns;
  // }
}

export default new PubSub();