// import PubSub from "./PubSub";

class SpecialCommands {

  private logoutCommandEnabled: boolean;

  constructor() {
    this.logoutCommandEnabled = true;
  }

  routeCommand(command: string) {
    if (command && command.match(/^log((\s?)(me)?\s?out)$/i)) {
      return this.logout();
    }
    return false;
  }

  protected logout(): boolean {
    if (!this.logoutCommandEnabled) return false;
    sessionStorage.clear();
    window.location.reload();
    return true;
  }

}

export default new SpecialCommands();