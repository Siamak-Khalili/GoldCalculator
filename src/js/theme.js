class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "system";
    this.systemRadio = document.getElementById("theme-switch-system");
    this.lightRadio = document.getElementById("theme-switch-light");
    this.darkRadio = document.getElementById("theme-switch-dark");
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    this.init();
  }

  // Initializes the theme manager

  init() {
    if (!this.systemRadio || !this.lightRadio || !this.darkRadio) {
      console.warn("Theme switcher radio buttons not found.");
      return;
    }

    // Set up radio buttons
    this.systemRadio.addEventListener("change", () => this.setTheme("system"));
    this.lightRadio.addEventListener("change", () => this.setTheme("light"));
    this.darkRadio.addEventListener("change", () => this.setTheme("dark"));

    // Listen for system theme changes

    this.mediaQuery.addEventListener("change", () => {
      if (this.currentTheme === "system") {
        this.applyTheme();
      }
    });

    // Apply initial theme and update UI
    this.updateRadioButtons();
    this.applyTheme();
  }

  setTheme(theme) {
    if (!["system", "light", "dark"].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    this.currentTheme = theme;
    localStorage.setItem("theme", theme);
    this.updateRadioButtons();
    this.applyTheme();
  }

  // Updates the radio button

  updateRadioButtons() {
    this.systemRadio.checked = this.currentTheme === "system";
    this.lightRadio.checked = this.currentTheme === "light";
    this.darkRadio.checked = this.currentTheme === "dark";
  }

  // Applies the current theme to the document

  applyTheme() {
    const shouldUseDark = this.shouldUseDarkMode();

    if (shouldUseDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  shouldUseDarkMode() {
    switch (this.currentTheme) {
      case "dark":
        return true;
      case "light":
        return false;
      case "system":
        return this.mediaQuery.matches;
      default:
        return false;
    }
  }

  getEffectiveTheme() {
    if (this.currentTheme === "system") {
      return this.mediaQuery.matches ? "dark" : "light";
    }
    return this.currentTheme;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export default ThemeManager;
