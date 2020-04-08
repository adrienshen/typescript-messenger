enum ErrorMessages {
  NonSpecifiedGtmEvent = "NonSpecifiedGtmEvent: Non specified GTM event",
  UnknownMessageType = "UnknownMessageType: Unknown message type without appropriate renderer",
  FailureFetchTranscript = "FailureFetchTranscript: Error in fetching transcipt",
  ErrorPreparingUpload = "ErrorPreparingUpload: Error when preparing file for upload, response details is empty",
  ErrorGeneratingPlaceholder = "ErrorGeneratingPlaceholder: Unknown upload type, can not generate placeholder message",
  ErrorFileType = "ErrorFileType: Files type seems to be unsupported, please upload only images or .pdf files",
  NoRichElementsToRender = "NoRichElementsToRender: No rich elements to render, length of 0 or null",
  SendMessageFailure = "SendMessageFailure: error upon sending user message, check /chatbot/message apis",
  IframeContentWindowError = "IframeContentWindowError: Iframe content window not exist. Can not post message to iframe",
  TranscriptLoadingError = "TranscriptLoadingError: Can not load transcript",
  GetTranscriptError = "GetTranscriptError: No response && response.data from ChatbotClient.getTranscript",
  QuickMessageComponentMissing = "QuickMessageComponentMissing: No component found",
  QuickMessageUnableTranslate = "QuickMessageUnableTranslate: can not translate",
  GtmInitError = "GtmInitError: gtm already started or gtmId not correct format",
}

export const LogError = (errorMessage: ErrorMessages, errorObj?: Error) => {
  // Handle error logic
  console.error(errorMessage);
  if (errorObj) console.error(errorObj);
}

export default ErrorMessages;