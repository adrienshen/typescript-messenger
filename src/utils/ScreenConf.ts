import { TopScreen } from "../types";

class ScreenConf {

  topInnerWidth: number;
  topOuterWidth: number;
  topScreenAvailWidth: number;
  topScreenWidth: number;

  setScreenConfig(screenOptions: TopScreen) {
    this.topInnerWidth = screenOptions.topInnerWidth;
    this.topOuterWidth = screenOptions.topOuterWidth;
    this.topScreenAvailWidth = screenOptions.topScreenAvailWidth;
    this.topScreenWidth = screenOptions.topScreenWidth;
  }

  shouldDisplayScrollArrows() {
    // Display scroll arrows only for larger screens
    return this.topInnerWidth >= 650;
  }

}

export default new ScreenConf();