class MenuManager {
  constructor() {
    this.menuButton = document.getElementById("mobile-menu-button");
    this.navMenu = document.getElementById("nav-menu");
    this.menuLines = this.menuButton.querySelectorAll("span");

    if (!this.menuButton || !this.navMenu || this.menuLines.length !== 2) {
      console.error("Menu elements not found!");
      return;
    }

    this.init();
  }

  init() {
    // Toggle menu on button click
    this.menuButton.addEventListener("click", () => {
      const isOpen = !this.navMenu.classList.contains("translate-y-full");
      this.toggleMenu(!isOpen);
    });

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (!this.navMenu.contains(e.target) && !this.menuButton.contains(e.target)) {
        this.toggleMenu(false);
      }
    });

    // Close menu on nav item click
    this.navMenu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", () => {
        this.toggleMenu(false);
      });
    });
  }

  toggleMenu(isOpen) {
    this.navMenu.classList.toggle("translate-y-full", !isOpen);
    this.navMenu.classList.toggle("hidden", !isOpen);

    // Toggle rotate
    if (isOpen) {
      this.menuLines[0].classList.add("rotate-45", "translate-y-1");
      this.menuLines[1].classList.add("-rotate-45", "-translate-y-1");
    } else {
      this.menuLines[0].classList.remove("rotate-45", "translate-y-1");
      this.menuLines[1].classList.remove("-rotate-45", "-translate-y-1");
    }

    this.menuButton.setAttribute("aria-expanded", isOpen);
  }
}

export default MenuManager;