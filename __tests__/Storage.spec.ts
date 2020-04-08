//browserMocks.js
var localStorageMock = (function() {
  var store: any = {};

  return {
    getItem: function(key: string) {
        return store[key] || null;
    },
    setItem: function(key: string, value: string) {
        store[key] = value.toString();
    },
    clear: function() {
        store = {};
    },
    getStore: function() {
      return store;
    }
  };

})();

Object.defineProperty(window, 'sessionStorage', {
   value: localStorageMock,
});

import ChatbotStorage, {Storage} from "../src/storage/LocalStorage";

describe("ChatbotStorage Module", () => {

  beforeEach(() => {
    
  });

  it("ChatbotStorage is extended from Storage", async () => {
    let isInstanceOf = ChatbotStorage instanceof Storage;
    expect(isInstanceOf).toBe(true);
  });

  it("should save transcriptId to storage", async () => {
    let transcriptId = "ABC123";
    ChatbotStorage.saveTranscriptId(transcriptId);
    expect(sessionStorage.getItem("transcriptId")).toBe(transcriptId);
  });

  it("should save tenant to storage", async () => {
    let tenant = "ringgitplus";
    ChatbotStorage.saveTenant(tenant);
    expect(sessionStorage.getItem("tenant"));
  });

  it("should save eTag to storage", async () => {
    let eTag = "eTag123";
    ChatbotStorage.saveEtag(eTag);
    expect(sessionStorage.getItem("eTag"));
  });

  it("should delete all transcript detail keys", async () => {
    ChatbotStorage.clearAll();
    expect(sessionStorage.getStore()).toEqual({});
  });

  it("should save all transcript detail keys", async () => {
    ChatbotStorage.saveTranscriptDetails("ASDF1234", "eTag123", "ringgitplus");
    expect(sessionStorage.getStore()).toEqual({
      transcriptId: "ASDF1234",
      eTag: "eTag123",
      tenant: "ringgitplus",
    });
  });

  // it("should return the store", async () => {
  //   let store = ChatbotStorage.getStore();
  //   console.log("store: ", store);
  //   expect(store).toEqual({
  //     transcriptId: "ASDF1234",
  //     eTag: "eTag123",
  //     tenant: "ringgitplus",
  //   });
  // });

});
