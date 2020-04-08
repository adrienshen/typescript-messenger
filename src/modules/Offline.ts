import DomElements from "../utils/DomElements";

class Offline {
  constructor() {
    // console.log("Offline handler...", window.navigator.onLine);
    if (!window.navigator.onLine) {
      if (DomElements.offlineComponent)
        DomElements.offlineComponent.style.display = "block";
    }

    window.addEventListener('online', () => {
      if (DomElements.offlineComponent)
        DomElements.offlineComponent.style.display = "none";
    });

    window.addEventListener('offline', () => {
      if (DomElements.offlineComponent)
        DomElements.offlineComponent.style.display = "block";
    });
  }
  
}

export default Offline;