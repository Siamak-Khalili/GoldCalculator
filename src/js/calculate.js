class GoldCalculator {
  constructor() {
    this.inputs = {
      price: document.getElementById("price"),
      weight: document.getElementById("weight"),
      wages: document.getElementById("wages"),
      profit: document.getElementById("profit"),
    };

    this.outputs = {
      goldPrice: document.getElementById("gold-price"),
      wageAmount: document.getElementById("wage-amount"),
      profitAmount: document.getElementById("profit-amount"),
      taxAmount: document.getElementById("tax-amount"),
      finalPrice: document.getElementById("final-price"),
    };

    this.badges = {
      wageBadge: document.getElementById("wage-badge"),
      profitBadge: document.getElementById("profit-badge"),
    };

    this.currentLang = document.documentElement.getAttribute("lang") || "fa";
    this.tomanToUsdRate = 90560; // 1 USD = 90,560 Toman

    this.setDefaultInputs();
    this.addListeners();
    this.clearOutputs();
  }

  // Sets default input values

  setDefaultInputs() {
    const defaultPriceToman = "7189000";
    const defaultPriceUsd = (
      parseInt(defaultPriceToman.replace(/,/g, "")) / this.tomanToUsdRate
    ).toFixed(2);
    this.inputs.price.value = this.formatForLang(
      this.currentLang === "fa" ? defaultPriceToman : defaultPriceUsd
    );
    this.inputs.weight.value = "";
    this.inputs.wages.value = this.formatForLang("18");
    this.inputs.profit.value = this.formatForLang("7");
  }

  //  Adds input event
  addListeners() {
    Object.values(this.inputs).forEach((input) => {
      input.addEventListener("input", () => {
        this.convertInputToFormat(input);
        this.calculate();
      });
    });

    document.addEventListener("languageChange", (e) => {
      this.currentLang = e.detail.lang;
      this.setDefaultInputs();
      this.calculate();
    });
  }

  convertInputToFormat(input) {
    const isPriceInput = input === this.inputs.price;
    const value = input.value
      .replace(/,/g, "")
      .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    
    // Always format price input with commas, others only if they have values
    if (isPriceInput) {
      input.value = this.formatForLang(cleanedValue || "0", true);
    } else {
      input.value = this.formatForLang(cleanedValue || "0", false);
    }
  }

  formatWithCommas(numberStr, isPriceInput = false) {
    if (!numberStr || numberStr === "0")
      return this.currentLang === "fa" ? "۰" : "0";
    
    // Always add commas for price input, for others only if they're long enough
    if (isPriceInput) {
      return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // For non-price inputs, only add commas if the number is 4+ digits
      return numberStr.length >= 4 ? numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : numberStr;
    }
  }

  formatForLang(numberStr, isPriceInput = false) {
    let formatted = this.formatWithCommas(numberStr, isPriceInput);
    if (this.currentLang === "fa") {
      formatted = this.toPersianDigits(formatted);
    }
    return formatted;
  }

  toPersianDigits(str) {
    return str.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  }

  getNumericValue(inputEl) {
    const value = inputEl.value
      .replace(/,/g, "")
      .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
    return parseFloat(value) || 0;
  }

  convertPrice(price) {
    return this.currentLang === "en" ? price / this.tomanToUsdRate : price;
  }

  // Calculates gold prices

  calculate() {
    let rate = this.getNumericValue(this.inputs.price);
    if (this.currentLang === "en") {
      rate *= this.tomanToUsdRate;
    }
    const weight = this.getNumericValue(this.inputs.weight);
    const wagePercent = this.getNumericValue(this.inputs.wages);
    const profitPercent = this.getNumericValue(this.inputs.profit);

    // Update badges with current percentages
    this.updateBadges(wagePercent, profitPercent);

    if (weight <= 0) {
      this.clearOutputs();
      return;
    }

    const goldPrice = rate * weight;
    const wageAmount = goldPrice * (wagePercent / 100);
    const profitAmount = (goldPrice + wageAmount) * (profitPercent / 100);
    const taxAmount = (wageAmount + profitAmount) * 0.09;
    const finalPrice = goldPrice + wageAmount + profitAmount + taxAmount;

    this.setOutput(this.outputs.goldPrice, this.convertPrice(goldPrice));
    this.setOutput(this.outputs.wageAmount, this.convertPrice(wageAmount));
    this.setOutput(this.outputs.profitAmount, this.convertPrice(profitAmount));
    this.setOutput(this.outputs.taxAmount, this.convertPrice(taxAmount));
    this.setOutput(this.outputs.finalPrice, this.convertPrice(finalPrice));
  }

  // Clears all output

  clearOutputs() {
    Object.values(this.outputs).forEach((el) => {
      el.textContent = this.formatForLang("0");
    });
  }

  setOutput(el, value) {
    const formatted = this.formatForLang(Math.round(value).toString(), true);
    el.textContent = formatted;
  }

  // Updates badge percentages
  updateBadges(wagePercent, profitPercent) {
    if (this.badges.wageBadge) {
      this.badges.wageBadge.textContent = this.formatForLang(wagePercent.toString()) + "%";
    }
    if (this.badges.profitBadge) {
      this.badges.profitBadge.textContent = this.formatForLang(profitPercent.toString()) + "%";
    }
  }
}

export default GoldCalculator;