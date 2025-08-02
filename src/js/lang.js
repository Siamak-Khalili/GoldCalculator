class LanguageManager {
  constructor() {
    this.currentLang = document.documentElement.getAttribute("lang") || "fa";
    this.texts = {
      fa: {
        title: "محاسبه‌گر هوشمند قیمت طلا",
        subtitle:
          "ابزاری برای محاسبه سریع و دقیق قیمت نهایی طلا با در نظر گرفتن اجرت، سود و مالیات",
        priceLabel: "نرخ طلا",
        weightLabel: "وزن طلا",
        wagesLabel: "اجرت ساخت",
        profitLabel: "سود فروش",
        priceUnit: "تومان",
        weightUnit: "گرم",
        percentUnit: "درصد",
        finalPriceTitle: "قیمت نهایی محصول",
        finalPriceTooltip: "قیمت طلا + اجرت ساخت + سود + مالیات",
        goldPriceTitle: "قیمت طلای محصول",
        goldPriceTooltip: "وزن ✕ نرخ روز طلا",
        wageAmountTitle: "اجرت ساخت",
        wageAmountTooltip: "قیمت طلا ✕ 18 %",
        profitAmountTitle: "سود فروش طلا",
        profitAmountTooltip: "(قیمت طلا + اجرت ساخت) ✕ 7 %",
        taxAmountTitle: "مالیات",
        taxAmountTooltip: "(سود فروش طلا + اجرت ساخت) ✕ 9 %",
        finalPriceTag: "نهایی",
        goldPriceTag: "نرخ × وزن",
        wagesTag: "18%",
        profitTag: "7%",
        taxTag: "9%",
        // Navigation menu items
        navGoldPrice: "قیمت طلا",
        navCalculator: "محاسبه قیمت طلا",
        navRules: "قوانین و تعرفه‌ها",
        navContact: "ارتباط با ما",
        mobileMenuTitle: "منو",
        // Gold chart section
        chartTitle: "نرخ طلا در یک سال گذشته",
        chartSubtitle: "تحلیل روند قیمت طلای 18 عیار",
        chartPriceLabel: "قیمت",
        chartDateLabel: "تاریخ",
        chartTooltipPriceLabel: "قیمت طلا",
        chartMinPriceLabel: "کمترین قیمت",
        chartMaxPriceLabel: "بیشترین قیمت",
        chartCurrentPriceLabel: "قیمت فعلی",
        chartYearlyChangeLabel: "تغییرات سالانه",
        chartSourcesTitle: "منابع قیمت‌گذاری",
        // Persian solar months
        months: [
          "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
          "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
        ],
      },
      en: {
        title: "Smart Gold Price Calculator",
        subtitle:
          "A tool for quick and accurate calculation of the final gold price, including wages, profit, and tax",
        priceLabel: "Gold Price",
        weightLabel: "Gold Weight",
        wagesLabel: "Labor Cost",
        profitLabel: "Profit Margin",
        priceUnit: "USD",
        weightUnit: "grams",
        percentUnit: "%",
        finalPriceTitle: "Final Product Price",
        finalPriceTooltip: "Gold Price + Labor Cost + Profit + Tax",
        goldPriceTitle: "Product Gold Price",
        goldPriceTooltip: "Weight × Daily Gold Rate",
        wageAmountTitle: "Labor Cost",
        wageAmountTooltip: "Gold Price × 18%",
        profitAmountTitle: "Sales Profit",
        profitAmountTooltip: "(Gold Price + Labor Cost) × 7%",
        taxAmountTitle: "Tax",
        taxAmountTooltip: "(Sales Profit + Labor Cost) × 9%",
        finalPriceTag: "Final",
        goldPriceTag: "Rate × Weight",
        wagesTag: "18%",
        profitTag: "7%",
        taxTag: "9%",
        // Navigation menu items
        navGoldPrice: "Gold Price",
        navCalculator: "Gold Price Calculator",
        navRules: "Rules & Tariffs",
        navContact: "Contact Us",
        mobileMenuTitle: "Menu",
        // Gold chart section
        chartTitle: "Gold Price in the Past Year",
        chartSubtitle: "18 Karat Gold Price Trend Analysis",
        chartPriceLabel: "Price",
        chartDateLabel: "Date",
        chartTooltipPriceLabel: "Gold Price",
        chartMinPriceLabel: "Lowest Price",
        chartMaxPriceLabel: "Highest Price",
        chartCurrentPriceLabel: "Current Price",
        chartYearlyChangeLabel: "Annual Change",
        chartSourcesTitle: "Pricing Sources",
        // English Gregorian months
        months: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
      },
    };

    this.init();
  }

  //  Initializes the language

  init() {
    const langSelect = document.getElementById("lang-select");
    if (!langSelect) {
      console.warn('Language select dropdown with id "lang-select" not found.');
      return;
    }

    langSelect.value = this.currentLang;
    langSelect.addEventListener("change", (e) =>
      this.changeLanguage(e.target.value)
    );

    this.updateLanguage();
  }

  changeLanguage(langCode) {
    if (langCode === this.currentLang) return;

    this.currentLang = langCode;
    this.updateLanguage();
    document.dispatchEvent(
      new CustomEvent("languageChange", {detail: {lang: this.currentLang}})
    );
  }

  //  Updates the page content

  updateLanguage() {
    const lang = this.texts[this.currentLang];

    // Update page direction

    document.documentElement.setAttribute("lang", this.currentLang);
    document.documentElement.setAttribute(
      "dir",
      this.currentLang === "fa" ? "rtl" : "ltr"
    );

    // Update main content

    this.setText("#title", lang.title);
    this.setText("#subtitle", lang.subtitle);

    // Update form labels

    this.setText('label[for="price"] div', lang.priceLabel);
    this.setText('label[for="weight"] div', lang.weightLabel);
    this.setText('label[for="wages"] div', lang.wagesLabel);
    this.setText('label[for="profit"] div', lang.profitLabel);

    // Update unit labels

    const priceUnit = document.querySelector("#price").nextElementSibling;
    if (priceUnit) priceUnit.textContent = lang.priceUnit;

    const weightUnit = document.querySelector("#weight").nextElementSibling;
    if (weightUnit) weightUnit.textContent = lang.weightUnit;

    const wagesUnit = document.querySelector("#wages").nextElementSibling;
    if (wagesUnit) wagesUnit.textContent = lang.percentUnit;

    const profitUnit = document.querySelector("#profit").nextElementSibling;
    if (profitUnit) profitUnit.textContent = lang.percentUnit;

    // Update result section titles

    this.setText("#final-price + p", lang.finalPriceTitle);
    this.setText("#gold-price + p", lang.goldPriceTitle);
    this.setText("#wage-amount + p", lang.wageAmountTitle);
    this.setText("#profit-amount + p", lang.profitAmountTitle);
    this.setText("#tax-amount + p", lang.taxAmountTitle);

    // Update result section tags

    const resultCards = document.querySelectorAll(".relative.group");
    resultCards.forEach((card, index) => {
      const tag = card.querySelector(".text-xs");
      if (tag) {
        switch (index) {
          case 0:
            tag.textContent = lang.finalPriceTag;
            break;
          case 1:
            tag.textContent = lang.goldPriceTag;
            break;
          case 2:
            tag.textContent = lang.wagesTag;
            break;
          case 3:
            tag.textContent = lang.profitTag;
            break;
          case 4:
            tag.textContent = lang.taxTag;
            break;
        }
      }

      // Update tooltips

      const tooltip = card.querySelector(".group-hover\\:flex p");
      if (tooltip) {
        switch (index) {
          case 0:
            tooltip.textContent = lang.finalPriceTooltip;
            break;
          case 1:
            tooltip.textContent = lang.goldPriceTooltip;
            break;
          case 2:
            tooltip.textContent = lang.wageAmountTooltip;
            break;
          case 3:
            tooltip.textContent = lang.profitAmountTooltip;
            break;
          case 4:
            tooltip.textContent = lang.taxAmountTooltip;
            break;
        }
      }
    });

    // Update label positions

    document.querySelectorAll(".unit-label").forEach((el) => {
      el.classList.remove("left-3", "right-3");
      el.classList.add(this.currentLang === "fa" ? "left-3" : "right-3");
    });

    // Update navigation menu items
    this.setText("#nav-gold-price", lang.navGoldPrice);
    this.setText("#nav-calculator", lang.navCalculator);
    this.setText("#nav-rules", lang.navRules);
    this.setText("#nav-contact", lang.navContact);

    // Update mobile navigation menu items
    this.setText("#mobile-nav-gold-price", lang.navGoldPrice);
    this.setText("#mobile-nav-calculator", lang.navCalculator);
    this.setText("#mobile-nav-rules", lang.navRules);
    this.setText("#mobile-nav-contact", lang.navContact);
    this.setText("#mobile-menu-title", lang.mobileMenuTitle);

    // Update chart section
    this.updateChartSection(lang);

    // Update dropdown arrow position for RTL/LTR
    const dropdownArrow = document.getElementById("lang-dropdown-arrow");
    if (dropdownArrow) {
      const dropdownButton = document.getElementById("lang-dropdown-button");
      if (dropdownButton) {

        // No need to change positioning for RTL/LTR
      }
    }
  }

  setText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  updateChartSection(lang) {
    // Update chart section titles and labels
    const chartTitleElement = document.querySelector('section h3');
    if (chartTitleElement) {
      chartTitleElement.textContent = lang.chartTitle;
    }

    const chartSubtitleElement = document.querySelector('section h3 + p');
    if (chartSubtitleElement) {
      chartSubtitleElement.textContent = lang.chartSubtitle;
    }

    // Update stats labels
    const statsLabels = document.querySelectorAll('.grid.grid-cols-2.md\\:grid-cols-4 .text-center p:first-child');
    if (statsLabels.length >= 4) {
      statsLabels[0].textContent = lang.chartMinPriceLabel;
      statsLabels[1].textContent = lang.chartMaxPriceLabel;
      statsLabels[2].textContent = lang.chartCurrentPriceLabel;
      statsLabels[3].textContent = lang.chartYearlyChangeLabel;
    }

    // Update tooltip labels
    const tooltipPriceLabel = document.querySelector('#chartTooltip .flex span:first-child');
    if (tooltipPriceLabel) {
      tooltipPriceLabel.textContent = lang.chartTooltipPriceLabel;
    }

    // Update stats card price label
    const statsPriceLabel = document.querySelector('.bg-white.dark\\:bg-neutral-900\\/80 .flex span:first-child');
    if (statsPriceLabel) {
      statsPriceLabel.textContent = lang.chartPriceLabel;
    }

    // update chart with new language data
    document.dispatchEvent(new CustomEvent('chartLanguageUpdate', {
      detail: { 
        lang: this.currentLang,
        months: lang.months
      }
    }));
  }
}

export default LanguageManager;
