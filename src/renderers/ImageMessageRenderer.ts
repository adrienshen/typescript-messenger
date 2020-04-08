import MessageRenderer from "./MessageRenderer";
import ClientSender from "../service/ClientSender";

class ImageMessageRenderer extends MessageRenderer {
  constructor() {
    super();
  }

  switchImageSrc(newImgSrc: string) {
    let elem = document.getElementsByClassName("image-message");
    let lastImageElem = elem[elem.length - 1];
    lastImageElem.setAttribute("src", newImgSrc);
  }

  render(message: any): void {
    let container = this.LI({classNames: ["image-message-container"]});
    let imageEl = this.IMG({src: message.imageurl, classNames: ["image-message"]});
    imageEl = this.imageAddClickListener(imageEl);
    container.appendChild(imageEl);
    this.appendToTranscript(container);
  }

  imageAddClickListener(imageEl: HTMLImageElement): HTMLImageElement {
    imageEl.addEventListener("click", () => {
      ClientSender.sendImageModalSrc(imageEl.src);
    });
    return imageEl;
  }

}

export default ImageMessageRenderer;