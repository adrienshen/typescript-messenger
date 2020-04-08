export class Storage {

  constructor() {}

  save(key: string, value: any): void {
    if (window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  }

  clearAll(): void {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  }

  getStore() {
    return window.sessionStorage;
  }

}

class ChatbotStorage extends Storage {

  constructor() {
    super();
  }

  saveTranscriptDetails(transcriptId: string, eTag: string = "", tenant: string = "ringgitplus"): void {
    this.save("transcriptId", transcriptId);
    this.save("eTag", eTag);
    this.save("tenant", tenant);
  }

  saveTranscriptId = (transcriptId: string): void => this.save("transcriptId", transcriptId);
  saveTenant = (tenant: string = ""): void => this.save("tenant", tenant);
  saveEtag = (eTag: string = ""): void => this.save("eTag", eTag);

}

export default new ChatbotStorage();
