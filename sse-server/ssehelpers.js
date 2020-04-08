
let exportFuncs = {};

exportFuncs.addEventStreamHeaders = res => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
};

exportFuncs.send200MessageReceived = res => {
  res
    .status(200)
    .send({
      sent: true,
      timestamp: Date.now(),
    });
}

exportFuncs.coerceSSE = (responseData, eventTag) => {
  if (eventTag) {
    return `event: ${eventTag}\ndata: ${responseData} \n\n`;
  }
  return `data: ${responseData} \n\n`;
}

exportFuncs.genChatbotResponseSSE = client => {
  const text = client.message.text;
  const transcriptId = client.transcriptId;
  if (isPaymentRequestTest(text)) {
    return handlePaymentPluginTest(transcriptId, text);
  }
  return handleNormalMessage(transcriptId, text);
}

handleNormalMessage = (transcriptId, text) => {
  let respJson = {transcriptId: transcriptId, messages: []};
  let botResponse = doAdvanceNlpStuff(text);
  respJson.messages.push(newTranscriptMessage(text));
  respJson.messages.push(newTranscriptMessage(botResponse, "chatbot"));
  respJson.messages.push(newTranscriptMessage("Try again.", "chatbot"));
  return JSON.stringify(respJson);
}

doAdvanceNlpStuff = text => (text.toLowerCase().indexOf("hello") > -1)
  ? "Hello yourself!"
  : "Sorry, I am still learning.";

newTranscriptMessage = (text, sender) => {
  let timestamp = Date.now();
  let messageObj = {
    text,
    timestamp
  };
  if (sender === "chatbot") {
    messageObj.sender = "chatbot";
  }
  return messageObj;
}

isPaymentRequestTest = message => (message.toLowerCase().indexOf("/payment") > -1)

handlePaymentPluginTest = (transcriptId, clientMessage) => {
  let respJson = {transcriptId: transcriptId, messages: []};
  respJson.messages.push(newTranscriptMessage(clientMessage));
  respJson.messages.push({
    text: "Loading payment widget",
    timestamp: Date.now(),
    sender: "chatbot",
  });
  respJson.messages.push({
    text: "Please pay now",
    plugin: {
      url: "https://curiolabs.com/plugins/hello.html",
      options: {
        description: "1 Year Car Insurance",
        currency: "MYR",
        amount: 120,
      },
    },
    timestamp: Date.now(),
    sender: "chatbot",
  });

  console.log("respJson payments: ", respJson);
  return JSON.stringify(respJson);
}

module.exports = exportFuncs;
