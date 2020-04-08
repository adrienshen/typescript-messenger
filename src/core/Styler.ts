class Styler {
  customStylesId: string;
  customStylesLink: string;

  addCustomStyles(cssLink: string) {
    this.customStylesId = cssLink;
    let customStyles = document.createElement("link");
        customStyles.id = "customStyles";
        customStyles.type = "text/css";
        customStyles.rel = "stylesheet";
        customStyles.href = cssLink;
    this.insertCustomStyles(customStyles);
  }
  
  addStyleTag(styleId: string, styleContents: string) {
    this.customStylesId = styleId;
    let customStyleTag = document.createElement("style");  
        customStyleTag.innerHTML = styleContents;
        customStyleTag.id = styleId;
    this.insertCustomStyles(customStyleTag);
  }
  
  protected insertCustomStyles(customStyles: HTMLElement) {
    let defaultStyleTag = document.getElementsByTagName("style")[0];
    let headTag = defaultStyleTag.parentNode;
    if (defaultStyleTag && headTag) {
      headTag.insertBefore(customStyles, defaultStyleTag.nextSibling);
    }
  }
}

export default new Styler();