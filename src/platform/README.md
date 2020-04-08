
Plugins are implemented in javascript or typescript classes or functions. This is flexible.

Plugins must implement the SoraExtendability API by extending from PluginBase{}
PluginBase{} will have hooks to comm. with ChatbotCore{} through different iframe contexts usiong jschannel library.

- onActivate
- onChatMessage
- primaryAction
- Transcript.showUserMessage()
- Transcript.sendMessage()
- Chatbot.notification()
- Plugin.register()
- Plugin.close()
- Plugin.reload()


Proposed render api usage:

  public render() {
    const {SECTION, H2, InputButton} = PluginUiElements;
    const h2Attr = {
      id: "section-id",
      onclick: () => alert("section was clicked!"),
    }
    const inputButtonAttr = {
      className: "inputbutton-classname",
      onclick: () => console.log("Do something..."),
    }
    return (
      SECTION({}, [
        H2(h2Attr, "Hello Plugin"),
        InputButton(inputButtonAttr, "press here")
      ])
    )
  }


Develop test cafe tests for plugin environment