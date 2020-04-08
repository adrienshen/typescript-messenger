import DomElements from "../utils/DomElements";

class UiController {

  constructor() {

  }

  transcriptLoadingError() {
    let divEl = document.createElement("DIV");
    divEl.textContent = "Transcript loading error";
    DomElements.transcriptContainerUl!.appendChild(divEl);
  }

}

export default UiController;