import MessageRenderer from './MessageRenderer';
// import ClassNames from "../ClassNames";

/*
* Renders current time into a chatbot message
*
**/
class ExperimentalRenderer extends MessageRenderer {
  constructor() {
    super();

    // let $el = this.render();
    // console.log("$el: ", $el);
  }

  // must implement
  validates(message: any) {
    return (message.text && !message.actions && message.time && message.type === "experiment");
  }

  // must implement
  render() {
    return false;
    let elem = this.LI({classNames: ["current-time-message"]}, [
      this.P({classNames: ["header3-text"]}, Date.now()),
    ]);
    this.appendToTranscript(elem);
  }

}

export default ExperimentalRenderer;