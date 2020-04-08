
export interface ElementAttributes {
  classNames?: string[],
  src?: string,
  href?: string,
  dataSender?: string,
  alt?: string,
  id?: string,
  width?: string,
  height?: string,
}

export interface InputElementAttributes {
  id?: string,
  classNames?: string[],
  type?: string,
  for?: string,
  disabled?: boolean,
}

export default abstract class BaseRenderer {
  constructor() {}

  protected addAttributes(element: HTMLElement, attributes?: any) {
    if (!attributes) return element;
    if (attributes.classNames) element.classList.add(...attributes.classNames);
    if (attributes.id) element = element.id = attributes.id;
    if (attributes.src) (element as HTMLImageElement).src = attributes.src;
    if (attributes.height) (element as HTMLImageElement).height = attributes.height;
    if (attributes.width) (element as HTMLImageElement).width = attributes.width;
    if (attributes.alt) (element as HTMLImageElement).alt = attributes.alt;
    if (attributes.href) (element as HTMLAnchorElement).href = attributes.href;
    if (attributes.dataSender) element.dataset.sender = attributes.dataSender;
    return element;
  }

  protected addTextContent(element: HTMLElement, textContent?: string | number): HTMLElement {
    if (textContent) element.innerText = textContent.toString();
    return element;
  }

  protected renderNode(name: string, attributes?: Object, children?: any) {
    let $element = document.createElement(name);
    $element = this.addAttributes($element, attributes);
    if (typeof children === "string" || typeof children === "number") {
      $element = this.addTextContent($element, children);
    }
    
    if (typeof children === "object" && children.length) {
      // render nested elements
      children
        .map((elem: HTMLElement) => elem)
        .forEach($element.appendChild.bind($element));
      return $element;
    }

    return $element;
  }

  protected DIV = (attrs?: ElementAttributes, children?: any): HTMLDivElement => this.renderNode("DIV", attrs, children) as HTMLDivElement; 
  protected ARTICLE = (attrs?: ElementAttributes, children?: any): HTMLElement => this.renderNode("ARTICLE", attrs, children) as HTMLElement;
  protected H1 = (attrs?: ElementAttributes, children?: any): HTMLHeadElement => this.renderNode("H1", attrs, children) as HTMLHeadElement;
  protected H2 = (attrs?: ElementAttributes, children?: any): HTMLElement => this.renderNode("H2", attrs, children) as HTMLHeadingElement;
  protected H3 = (attrs?: ElementAttributes, children?: any): HTMLElement => this.renderNode("H3", attrs, children) as HTMLHeadingElement;
  protected A = (attrs?: ElementAttributes, children?: any): HTMLAnchorElement => this.renderNode("A", attrs, children) as HTMLAnchorElement;
  protected P = (attrs?: ElementAttributes, children?: any): HTMLParagraphElement => this.renderNode("P", attrs, children) as HTMLParagraphElement;
  protected SPAN = (attrs?: ElementAttributes, children?: any): HTMLSpanElement => this.renderNode("SPAN", attrs, children) as HTMLImageElement;  
  protected LI = (attrs?: ElementAttributes, children?: any): HTMLLIElement => this.renderNode("LI", attrs, children) as HTMLLIElement;
  protected UL = (attrs?: ElementAttributes, children?: any): HTMLUListElement => this.renderNode("UL", attrs, children) as HTMLUListElement;
  protected HGROUP = (attrs?: ElementAttributes, children?: any): HTMLElement => this.renderNode("HGROUP", attrs, children) as HTMLElement;
  protected PICTURE = (attrs?: ElementAttributes, children?: any): HTMLElement => this.renderNode("PICTURE", attrs, children) as HTMLPictureElement;
  protected IMG = (attrs?: ElementAttributes): HTMLImageElement => this.renderNode("IMG", attrs) as HTMLImageElement;
}