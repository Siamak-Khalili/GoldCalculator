import GoldCalculator from "./calculate.js";
import LanguageManager from "./lang.js";
import ThemeManager from "./theme.js";
import DropdownManager from "./dropdown.js";
import MenuManager from "./menu.js";
import ChartManager from "./chart.js";

document.addEventListener("DOMContentLoaded", () => {
  new GoldCalculator();
  new LanguageManager();
  new ThemeManager();
  new DropdownManager();
  new MenuManager();
  new ChartManager();
});
