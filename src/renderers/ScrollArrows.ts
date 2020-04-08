const throttle = require("lodash.throttle");
import MessageRenderer from "./MessageRenderer";
import ClassNames from "../constants/ClassNames";

class ScrollArrows extends MessageRenderer {

  CARD_WIDTH: number = 243;
  ARROW_SCROLL_TIMEOUT: number = 500;

	scrollContainerListener(elem: HTMLElement): HTMLElement {
    elem.addEventListener("scroll", throttle((e: MouseEvent) => {
      const scrollElem = (e.target as HTMLElement);
      this.arrowVisibilityCheck(scrollElem);
    }, this.ARROW_SCROLL_TIMEOUT));
    return elem;
  }
	
  render() {
    let navigationArrows = new DocumentFragment();
    let leftArrow = this.A({classNames: [ClassNames.Nav, ClassNames.NavPrev]});
    let rightArrow = this.A({classNames: [ClassNames.Nav, ClassNames.NavNext]});
        leftArrow.innerHTML = this.svgPrevArrow();
        leftArrow = this.arrowListener(leftArrow);
        leftArrow.style.visibility = "hidden";
        rightArrow.innerHTML = this.svgNextArrow();
        rightArrow = this.arrowListener(rightArrow);

    navigationArrows.appendChild(leftArrow);
    navigationArrows.appendChild(rightArrow);
    return navigationArrows;
  }

	arrowListener(arrowEl: HTMLAnchorElement): HTMLAnchorElement {
    arrowEl.addEventListener("click", (e: MouseEvent) => {
      let clickedEl = e.target as HTMLElement;
      let targetArrow: HTMLElement|null;

      if (clickedEl.nodeName === "svg") {
        targetArrow = clickedEl.parentElement;
      } else if (clickedEl.nodeName === "path") {
        targetArrow = clickedEl.parentElement!.parentElement;
      } else {
        targetArrow = clickedEl;
      }

      if (!targetArrow || !targetArrow.parentElement) {
        throw new Error("target arrows is null ScrollArrows:46");
        return;
      }

      let direction = (targetArrow.className.indexOf("next") > -1) ? "next" : "prev";
      let scrollDiv = targetArrow.parentElement.firstChild as HTMLElement;
      let scrollLeftPos = scrollDiv.scrollLeft;

      (targetArrow.parentElement.firstChild as HTMLElement).scroll({
        left: scrollLeftPos + (direction === "next" ? this.CARD_WIDTH : - this.CARD_WIDTH),
        behavior: "smooth",
      });

      window.setTimeout(() => {
        this.arrowVisibilityCheck(scrollDiv);
      }, this.ARROW_SCROLL_TIMEOUT);
    });
    return arrowEl;
	}
	
  protected svgPrevArrow(): string {
    return `
      <svg
        data-v-28466af8=""
        fill="#767676"
        width="100%"
        height="100%"
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
      </svg>
    `;
  }

  protected svgNextArrow(): string {
    return `
      <svg
        data-v-28466af8=""
        fill="#767676"
        width="100%"
        height="100%"
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
        </svg>
    `;
  }

  protected arrowVisibilityCheck(scrollDiv: HTMLElement) {
    let scrollLeftPos = scrollDiv.scrollLeft;
    let maxScroll = scrollDiv.scrollWidth - scrollDiv.clientWidth;
    let prev = scrollDiv!.parentElement!.getElementsByClassName(ClassNames.NavPrev)[0] as HTMLElement;
    let next = scrollDiv!.parentElement!.getElementsByClassName(ClassNames.NavNext)[0] as HTMLElement;
    let PADDING = 5;

    if (scrollLeftPos <= PADDING) {
      prev.style.visibility = "hidden";
    } else if (scrollLeftPos >= maxScroll - PADDING) {
      next.style.visibility = "hidden";
    } else {
      prev.style.visibility = "visible";
      next.style.visibility = "visible";
    }
  }

}

export default new ScrollArrows();