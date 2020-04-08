import ErrorMessages from "../constants/ErrorMessages";

export function logClientMessage({data, ports}: MessageEvent) {
  console.log("e.data: ", data.payload);
  ports[0].postMessage(`Sora: "${data.command}" message received`);
}

class Logger {

  gtmInitError() {
    console.error(ErrorMessages.GtmInitError);
  }

  transcriptLoadingError() {
    console.error(ErrorMessages.TranscriptLoadingError);
  }

}

export default new Logger();