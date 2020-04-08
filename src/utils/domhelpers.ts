export function removeAllChildNodes(node: HTMLElement): void {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  };
};

export function insertAfter(referenceNode: HTMLElement, newNode: HTMLElement) {
  referenceNode!.parentNode!.insertBefore( newNode, referenceNode.nextSibling );
}

export function appendMultipleChildren(
  container: HTMLElement,
  childs: (HTMLElement | DocumentFragment)[]): any {
  if (!childs.length) return -1;
  for (let i = 0; i < childs.length; i++) {
    container.appendChild(childs[i]);
  }
  return container;
}

interface StyleOptions {
  [key: string]: string;
}

export function style(htmlElem: HTMLElement, styleOptions: StyleOptions): HTMLElement | number {
  if (!Object.keys(styleOptions).length) return -1;

  let s: any;
  for (s in styleOptions) {
    htmlElem.style[s] = styleOptions[s];
  }

  return htmlElem;
}
