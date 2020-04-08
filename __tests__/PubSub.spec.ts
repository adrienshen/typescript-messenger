import PubSub from "../src/core/PubSub";
import {PublishEventNames, BasePayload} from "../src/types/publishevents"

describe("PubSub Module", () => {

  beforeEach(() => {
    
  });

  it("should be able to subscribe function to the registry", async () => {
    let F1 = () => { return 1 };
    let F2 = () => { return 2 };

    PubSub.subscribe({
      event: PublishEventNames.UnitTestEvent,
      action: () => F1(),
    })
    PubSub.subscribe({
      event: PublishEventNames.UnitTestEvent,
      action: () => F2(),
    })

    console.log(PubSub.registry);
    expect(PubSub.registry[PublishEventNames.UnitTestEvent].length).toBe(2);
  });

  it("should be able to publish a event that will cause a function to trigger", async () => {
    let foo = "foo";
    // subscribe a test function
    PubSub.subscribe({
      event: PublishEventNames.UnitTestEvent,
      action: () => {
        foo = "bar";
      },
    });

    // publish an event that will cause foo to be assign to "bar"
    PubSub.publish<BasePayload>({
      event: PublishEventNames.UnitTestEvent,
      payload: {},
    });

    expect(PubSub.registry[PublishEventNames.UnitTestEvent].length).toBe(3);
    expect(foo).toBe("bar");
  });

  it("if publish event does not exist in the registry, return and exit the function", async () => {
    
    // publish a non existant event
    let pubSubResults = PubSub.publish<BasePayload>({
      event: PublishEventNames.UnitTestDoesNotExist,
      payload: {},
    });

    expect(PubSub.registry[PublishEventNames.UnitTestEvent].length).toBe(3);
    expect(pubSubResults).toBe(undefined);
  });

})