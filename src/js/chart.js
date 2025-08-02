export default class ChartManager {
  constructor(canvasId = "goldPriceChart") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas?.getContext("2d");
    this.tooltip = document.getElementById("chartTooltip");
    this.hoverLine = document.getElementById("hoverLine");
    this.currentPriceDisplay = document.getElementById("currentPriceDisplay");
    this.dateDisplay = document.getElementById("dateDisplay");
    this.tooltipPrice = document.getElementById("tooltipPrice");
    this.tooltipDate = document.getElementById("tooltipDate");
    this.minPriceDisplay = document.getElementById("minPrice");
    this.maxPriceDisplay = document.getElementById("maxPrice");
    this.currentPriceDisplayAlt = document.getElementById("currentPrice");
    this.monthlyChangeDisplay = document.getElementById("monthlyChange");

    // Current language and months
    this.currentLang = document.documentElement.getAttribute("lang") || "fa";

    // Persian solar months
    this.persianMonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    // English Gregorian months
    this.englishMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Set initial months based on current language
    this.months =
      this.currentLang === "fa" ? this.persianMonths : this.englishMonths;

    // Exchange rate: 1 USD = 90,560 Toman
    this.tomanToUsdRate = 90560;

    // Gold prices in Toman
    this.goldPricesToman = [
      6800000, 6780000, 6850000, 6880000, 6950000, 6920000, 7050000, 7080000,
      7020000, 7160000, 7130000, 7189000,
    ];

    // Convert to USD for English
    this.goldPrices =
      this.currentLang === "en"
        ? this.goldPricesToman.map((price) => price / this.tomanToUsdRate)
        : this.goldPricesToman;

    // Animation state tracking
    this.currentFillIndex = -1;
    this.targetFillIndex = -1;
    this.animationFrame = null;
    this.isAnimating = false;

    // Listen for language change
    document.addEventListener("chartLanguageUpdate", (event) => {
      this.handleLanguageChange(event.detail);
    });

    // Initialize chart if canvas exists
    if (this.ctx) {
      this.initChart();
    } else {
      console.error(`Canvas element with ID "${canvasId}" not found!`);
    }
  }

  updateStatistics() {
    // Calculate statistics
    const minPrice = Math.min(...this.goldPrices);
    const maxPrice = Math.max(...this.goldPrices);
    const currentPrice = this.goldPrices[this.goldPrices.length - 1];
    const firstPrice = this.goldPrices[0];
    const yearlyChange = (
      ((currentPrice - firstPrice) / firstPrice) *
      100
    ).toFixed(1);

    // Update DOM elements
    const locale = this.currentLang === "fa" ? "fa-IR" : "en-US";

    if (this.minPriceDisplay) {
      this.minPriceDisplay.textContent = minPrice.toLocaleString(locale);
    }
    if (this.maxPriceDisplay) {
      this.maxPriceDisplay.textContent = maxPrice.toLocaleString(locale);
    }
    if (this.currentPriceDisplayAlt) {
      this.currentPriceDisplayAlt.textContent =
        currentPrice.toLocaleString(locale);
    }
    if (this.monthlyChangeDisplay) {
      this.monthlyChangeDisplay.textContent = `${
        yearlyChange > 0 ? "+" : ""
      }${yearlyChange}%`;
    }
  }

  handleLanguageChange(detail) {
    this.currentLang = detail.lang;
    this.months = detail.months;

    // Update gold prices based on language
    this.goldPrices =
      this.currentLang === "en"
        ? this.goldPricesToman.map((price) => price / this.tomanToUsdRate)
        : this.goldPricesToman;

    // Update chart data
    if (this.chart) {
      this.chart.data.labels = this.months;
      this.chart.data.datasets[0].data = this.goldPrices;
      this.chart.update();
    }

    this.updateDateDisplays();

    this.updateStatistics();
  }

  updateDateDisplays() {
    const currentPrice = this.goldPrices[this.goldPrices.length - 1];
    const currentMonth = this.months[this.months.length - 1];
    const locale = this.currentLang === "fa" ? "fa-IR" : "en-US";

    // Update current price
    if (this.currentPriceDisplay) {
      this.currentPriceDisplay.textContent =
        currentPrice.toLocaleString(locale);
    }

    // Update date display with appropriate calendar system
    if (this.dateDisplay) {
      if (this.currentLang === "fa") {
        // Persian solar calendar
        this.dateDisplay.textContent = `${currentMonth} 1404`;
      } else {
        // English Gregorian calendar
        this.dateDisplay.textContent = `${currentMonth} 2025`;
      }
    }
  }

  // Store chart instance for updates
  initChart() {
    // Create gradients for the chart
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);

    // Orange to green gradient based on price values
    gradient.addColorStop(0, "#f97316"); // orange-500 (low price)
    gradient.addColorStop(0.3, "#f59e0b"); // amber-500
    gradient.addColorStop(0.6, "#eab308"); // yellow-500
    gradient.addColorStop(0.8, "#84cc16"); // lime-500
    gradient.addColorStop(1, "#37c442"); // emerald-500 (high price)

    // Generate point colors based on price values
    const minPrice = Math.min(...this.goldPrices);
    const maxPrice = Math.max(...this.goldPrices);
    const pointColors = this.goldPrices.map((price) => {
      const ratio = (price - minPrice) / (maxPrice - minPrice);
      if (ratio < 0.2) return "#f97316"; // orange-500
      if (ratio < 0.4) return "#f59e0b"; // amber-500
      if (ratio < 0.6) return "#eab308"; // yellow-500
      if (ratio < 0.8) return "#84cc16"; // lime-500
      return "#37c442"; // emerald-500
    });

    // Create chart instance with two datasets
    this.chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: this.months,
        datasets: [
          // Main line dataset
          {
            label: "Gold Price (Toman)",
            data: this.goldPrices,
            borderColor: gradient,
            backgroundColor: "transparent",
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: pointColors,
            pointBorderColor: pointColors,
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: pointColors,
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 3,
            order: 1,
          },
          // Dynamic fill dataset
          {
            label: "Fill Area",
            data: [],
            borderColor: "transparent",
            backgroundColor: "transparent",
            borderWidth: 0,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: {enabled: false},
        },
        scales: {
          x: {
            grid: {display: false},
            ticks: {display: false},
            border: {display: false},
          },
          y: {
            grid: {display: false},
            ticks: {display: false},
            border: {display: false},
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        onHover: (event, activeElements) => {
          // Handle hover interaction with smooth movement
          if (activeElements.length > 0) {
            const chart = activeElements[0].element.$context.chart;
            const canvasPosition = Chart.helpers.getRelativePosition(
              event,
              chart
            );
            const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);

            const exactIndex = Math.max(
              0,
              Math.min(dataX, this.goldPrices.length - 1)
            );
            const dataIndex = Math.round(exactIndex);

            if (dataIndex >= 0 && dataIndex < this.goldPrices.length) {
              const price = this.goldPrices[dataIndex];
              const month = this.months[dataIndex];
              const locale = this.currentLang === "fa" ? "fa-IR" : "en-US";

              // Update main display
              if (this.currentPriceDisplay) {
                this.currentPriceDisplay.textContent =
                  price.toLocaleString(locale);
              }
              if (this.dateDisplay) {
                if (this.currentLang === "fa") {
                  this.dateDisplay.textContent = `${month} 1403`;
                } else {
                  this.dateDisplay.textContent = `${month} 2024`;
                }
              }

              // Update tooltip
              if (this.tooltipPrice) {
                this.tooltipPrice.textContent = price.toLocaleString(locale);
              }
              if (this.tooltipDate) {
                this.tooltipDate.textContent = month;
              }

              this.positionTooltip(canvasPosition.x, canvasPosition.y, chart);

              // Position hover line with smooth transition
              if (this.hoverLine) {
                this.hoverLine.style.transition =
                  "left 0.15s cubic-bezier(0.4, 0, 0.2, 1)";
                this.hoverLine.style.left = `${canvasPosition.x}px`;
                this.hoverLine.style.opacity = "1";
                this.hoverLine.classList.add(
                  "bg-neutral-600",
                  "dark:bg-neutral-400"
                );
              }

              // Set target for smooth fill animation
              this.targetFillIndex = dataIndex;
              this.startSmoothFillAnimation();
            }
          } else {
            // Reset to default values
            this.updateDateDisplays();
            if (this.tooltip) {
              this.tooltip.style.opacity = "0";
            }
            if (this.hoverLine) {
              this.hoverLine.style.opacity = "0";
            }
            // Reset chart fill with animation
            this.targetFillIndex = -1;
            this.startSmoothFillAnimation();
          }
        },
      },
    });

    // Update statistics
    this.updateStatistics();
  }

  positionTooltip(x, y, chart) {
    if (!this.tooltip) return;

    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const chartWidth = chart.canvas.clientWidth;
    const chartHeight = chart.canvas.clientHeight;
    const margin = 20;

    let tooltipX = x;
    let tooltipY = y - tooltipHeight - 10;

    // Smart horizontal positioning
    if (x < chartWidth * 0.3) {
      tooltipX = x + 15;
    } else if (x > chartWidth * 0.7) {
      tooltipX = x - tooltipWidth - 15;
    } else {
      tooltipX = x - tooltipWidth / 2;
    }

    tooltipX = Math.max(
      margin,
      Math.min(tooltipX, chartWidth - tooltipWidth - margin)
    );
    tooltipY = Math.max(
      margin,
      Math.min(tooltipY, chartHeight - tooltipHeight - margin)
    );

    // Apply smooth transition
    this.tooltip.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    this.tooltip.style.left = `${tooltipX}px`;
    this.tooltip.style.top = `${tooltipY}px`;
    this.tooltip.style.opacity = "1";
    this.tooltip.style.transform = "translateY(0)";

    // Apply styling
    this.tooltip.classList.add(
      "bg-white",
      "dark:bg-neutral-900/95",
      "border",
      "border-neutral-200",
      "dark:border-neutral-700",
      "backdrop-blur-sm",
      "shadow-lg",
      "rounded-lg"
    );
  }

  updateChartFill(hoverIndex) {
    if (!this.chart) return;

    const fillData = this.goldPrices.slice(0, hoverIndex + 1);
    const fillLabels = this.months.slice(0, hoverIndex + 1);

    const positionRatio = hoverIndex / (this.goldPrices.length - 1);

    const fillGradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width * positionRatio,
      0
    );

    //  gradient stops based on how hovered
    if (positionRatio <= 0.3) {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.4)"); // orange with opacity
      fillGradient.addColorStop(1, "rgba(245, 158, 11, 0.4)"); // amber with opacity
    } else if (positionRatio <= 0.6) {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.4)"); // orange
      fillGradient.addColorStop(0.5, "rgba(234, 179, 8, 0.4)"); // yellow
      fillGradient.addColorStop(1, "rgba(132, 204, 22, 0.4)"); // lime
    } else {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.4)"); // orange
      fillGradient.addColorStop(0.3, "rgba(245, 158, 11, 0.4)"); // amber
      fillGradient.addColorStop(0.6, "rgba(234, 179, 8, 0.4)"); // yellow
      fillGradient.addColorStop(0.8, "rgba(132, 204, 22, 0.4)"); // lime
      fillGradient.addColorStop(1, "rgba(16, 185, 129, 0.4)"); // emerald
    }

    // Create vertical gradient
    const verticalGradient = this.ctx.createLinearGradient(
      0,
      0,
      0,
      this.canvas.height
    );
    verticalGradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
    verticalGradient.addColorStop(1, "rgba(16, 185, 129, 0.05)");

    // Update the fill
    this.chart.data.datasets[1].data = fillData;
    this.chart.data.datasets[1].backgroundColor = fillGradient;

    // Add null values for  rest  data points to create the cutoff effect
    const remainingData = new Array(
      this.goldPrices.length - fillData.length
    ).fill(null);
    this.chart.data.datasets[1].data = [...fillData, ...remainingData];

    this.chart.update("none"); 
  }

  resetChartFill() {
    if (!this.chart) return;

    this.chart.data.datasets[1].data = new Array(this.goldPrices.length).fill(
      null
    );
    this.chart.data.datasets[1].backgroundColor = "transparent";
    this.chart.update("none");
  }

  startSmoothFillAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.animateFill();
  }

  animateFill() {
    if (!this.chart) {
      this.isAnimating = false;
      return;
    }

    const speed = 0.08; 
    const tolerance = 0.1;


    const diff = this.targetFillIndex - this.currentFillIndex;

    if (Math.abs(diff) < tolerance) {
      this.currentFillIndex = this.targetFillIndex;
      this.isAnimating = false;

      // Update the chart with final position
      if (this.currentFillIndex >= 0) {
        this.updateChartFillSmooth(Math.round(this.currentFillIndex));
      } else {
        this.resetChartFill();
      }
      return;
    }

    this.currentFillIndex += diff * speed;

    // Update chart with current animated position
    if (this.currentFillIndex >= 0) {
      this.updateChartFillSmooth(Math.round(this.currentFillIndex));
    } else {
      this.resetChartFill();
    }

    this.animationFrame = requestAnimationFrame(() => this.animateFill());
  }

  updateChartFillSmooth(hoverIndex) {
    if (!this.chart || hoverIndex < 0) return;

    hoverIndex = Math.max(0, Math.min(hoverIndex, this.goldPrices.length - 1));

    const fillData = this.goldPrices.slice(0, hoverIndex + 1);

    const positionRatio = hoverIndex / (this.goldPrices.length - 1);

    const fillGradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width * positionRatio,
      0
    );

    // Build gradient
    if (positionRatio <= 0.25) {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.3)"); // orange with lower opacity
      fillGradient.addColorStop(1, "rgba(245, 158, 11, 0.3)"); // amber with lower opacity
    } else if (positionRatio <= 0.5) {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.3)"); // orange
      fillGradient.addColorStop(0.4, "rgba(245, 158, 11, 0.3)"); // amber
      fillGradient.addColorStop(1, "rgba(234, 179, 8, 0.3)"); // yellow
    } else if (positionRatio <= 0.75) {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.3)"); // orange
      fillGradient.addColorStop(0.3, "rgba(245, 158, 11, 0.3)"); // amber
      fillGradient.addColorStop(0.6, "rgba(234, 179, 8, 0.3)"); // yellow
      fillGradient.addColorStop(1, "rgba(132, 204, 22, 0.3)"); // lime
    } else {
      fillGradient.addColorStop(0, "rgba(249, 115, 22, 0.3)"); // orange
      fillGradient.addColorStop(0.25, "rgba(245, 158, 11, 0.3)"); // amber
      fillGradient.addColorStop(0.5, "rgba(234, 179, 8, 0.3)"); // yellow
      fillGradient.addColorStop(0.75, "rgba(132, 204, 22, 0.3)"); // lime
      fillGradient.addColorStop(1, "rgba(16, 185, 129, 0.3)"); // emerald
    }

    this.chart.data.datasets[1].data = fillData;
    this.chart.data.datasets[1].backgroundColor = fillGradient;

    const remainingData = new Array(
      this.goldPrices.length - fillData.length
    ).fill(null);
    this.chart.data.datasets[1].data = [...fillData, ...remainingData];

    this.chart.update("none"); 
  }
}
