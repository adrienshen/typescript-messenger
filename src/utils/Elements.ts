/*
* Basic Dom Elements, DIV, A, IMG
*
**/
class Elements {

  DIV(options: {classNames?:string[], innerText?:string}): HTMLDivElement {
    let divEl = document.createElement("DIV") as HTMLDivElement;
      if (options.innerText) divEl.innerText = options.innerText;
      if (options.classNames) {
        divEl.classList.add(...options.classNames);
      }
      return divEl;
  }

  Anchor(options: {href?: string, innerText: string}): HTMLAnchorElement {
    let aEl = document.createElement("A") as HTMLAnchorElement;
    if (!options) return aEl;
    if (!aEl.href && options.href) aEl.href = options.href;
    aEl.innerText = options.innerText;
    return aEl;
  }

  IMAGE(options: {src?: string, classNames?: string[]}): HTMLImageElement {
    let imageEl = document.createElement("IMG") as HTMLImageElement;
    if (imageEl && options.src) imageEl.src = options.src;
    if (options.classNames) imageEl.classList.add(...options.classNames);
    return imageEl;
  }

  UL(options: {classNames:string[]}): HTMLUListElement {
    let ulEl = document.createElement("UL") as HTMLUListElement;
    if (!options) return ulEl;
    ulEl.classList.add(...options.classNames);
    return ulEl;
  }

  LI(options?: {classNames?:string[], innerText?:string}): HTMLLIElement {
    let liEl = document.createElement("LI") as HTMLLIElement;
    if (!options) return liEl;
    if (liEl && options.innerText) liEl.innerText = options.innerText;
    if (options.classNames && options.classNames.length) {
      liEl.classList.add(...options.classNames);
    }
    return liEl;
  }

}

export default new Elements();