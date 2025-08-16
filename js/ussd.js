// USSD page functionality

class USSDManager {
  constructor() {
    this.vendorData = null;
    this.ussdCode = "*123*ABC12345#";
    this.currentStep = 1;
    this.autoPlayInterval = null;
    this.stepExplanations = {
      1: {
        title: "Step 1: Dial USSD Code",
        text: "Customer dials your unique USSD code on any phone - no internet needed!",
      },
      2: {
        title: "Step 2: Select Payment",
        text: "Customer sees your business info and selects 'Make Payment' option.",
      },
      3: {
        title: "Step 3: Enter Amount",
        text: "Customer enters the amount they want to pay in Rands.",
      },
      4: {
        title: "Step 4: Confirm Payment",
        text: "Customer reviews payment details and enters their PIN to confirm.",
      },
      5: {
        title: "Step 5: Processing",
        text: "Payment is being processed securely through the mobile network.",
      },
      6: {
        title: "Step 6: Success!",
        text: "Payment complete! Both you and customer receive SMS confirmation.",
      },
    };

    this.init();
  }

  init() {
    // Load vendor data
    this.loadVendorData();

    if (!this.vendorData) {
      this.redirectToRegistration();
      return;
    }

    // Update vendor info and USSD code
    this.updateVendorInfo();
    this.updateUSSDCode();

    // Setup demo functionality
    this.setupDemoEventListeners();
  }

  loadVendorData() {
    this.vendorData = CashlessVendor.Storage.get("currentVendor");
    const isRegistered = CashlessVendor.Storage.get("vendorRegistered");

    if (!this.vendorData || !isRegistered) {
      this.vendorData = null;
    } else {
      this.ussdCode =
        this.vendorData.ussdCode ||
        CashlessVendor.generateUSSDCode(this.vendorData.vendorId);
    }
  }

  redirectToRegistration() {
    CashlessVendor.showToast("Please complete registration first", "warning");
    setTimeout(() => {
      CashlessVendor.navigateTo("index.html");
    }, 2000);
  }

  updateVendorInfo() {
    if (!this.vendorData) return;

    const vendorName = document.getElementById("vendor-name");
    const vendorId = document.getElementById("vendor-id-display");
    const vendorInitials = document.getElementById("vendor-initials");
    const businessName = document.getElementById("ussd-business-name");

    if (vendorName) {
      vendorName.textContent = this.vendorData.businessName;
    }

    if (vendorId) {
      vendorId.textContent = this.vendorData.vendorId;
    }

    if (vendorInitials) {
      const initials = this.getInitials(this.vendorData.businessName);
      vendorInitials.textContent = initials;
    }

    if (businessName) {
      businessName.textContent = this.vendorData.businessName;
    }
  }

  updateUSSDCode() {
    const ussdCodeElements = [
      document.getElementById("ussd-code"),
      document.getElementById("display-ussd-code"),
      document.getElementById("main-ussd-code"),
    ];

    ussdCodeElements.forEach((element) => {
      if (element) {
        element.textContent = this.ussdCode;
      }
    });
  }

  getInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  setupDemoEventListeners() {
    // Step navigation buttons
    const stepBtns = document.querySelectorAll(".step-btn");
    stepBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const step = parseInt(e.target.dataset.step);
        this.goToStep(step);
      });
    });

    // Demo control buttons
    const startBtn = document.getElementById("start-ussd-demo");
    const resetBtn = document.getElementById("reset-ussd-demo");
    const autoPlayBtn = document.getElementById("auto-play-demo");

    if (startBtn) {
      startBtn.addEventListener("click", () => this.startDemo());
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetDemo());
    }

    if (autoPlayBtn) {
      autoPlayBtn.addEventListener("click", () => this.toggleAutoPlay());
    }
  }

  goToStep(step) {
    if (step < 1 || step > 6) return;

    // Update current step
    this.currentStep = step;

    // Hide all steps
    const allSteps = document.querySelectorAll(".ussd-step");
    allSteps.forEach((stepEl) => stepEl.classList.remove("active"));

    // Show current step
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
      currentStepEl.classList.add("active");
    }

    // Update step buttons
    const stepBtns = document.querySelectorAll(".step-btn");
    stepBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (parseInt(btn.dataset.step) === step) {
        btn.classList.add("active");
      }
    });

    // Update explanation
    this.updateExplanation(step);
  }

  updateExplanation(step) {
    const explanationEl = document.getElementById("demo-explanation");
    if (explanationEl && this.stepExplanations[step]) {
      const explanation = this.stepExplanations[step];
      explanationEl.innerHTML = `
        <h4>${explanation.title}</h4>
        <p>${explanation.text}</p>
      `;
    }
  }

  startDemo() {
    this.resetDemo();
    this.goToStep(1);
  }

  resetDemo() {
    this.currentStep = 1;
    this.stopAutoPlay();
    this.goToStep(1);
  }

  toggleAutoPlay() {
    const autoPlayBtn = document.getElementById("auto-play-demo");

    if (this.autoPlayInterval) {
      this.stopAutoPlay();
      if (autoPlayBtn) {
        autoPlayBtn.textContent = "Auto Play";
        autoPlayBtn.classList.remove("btn-primary");
        autoPlayBtn.classList.add("btn-outline");
      }
    } else {
      this.startAutoPlay();
      if (autoPlayBtn) {
        autoPlayBtn.textContent = "Stop Auto";
        autoPlayBtn.classList.remove("btn-outline");
        autoPlayBtn.classList.add("btn-primary");
      }
    }
  }

  startAutoPlay() {
    this.resetDemo();

    this.autoPlayInterval = setInterval(() => {
      if (this.currentStep >= 6) {
        // Reset to beginning after completing all steps
        this.resetDemo();
      } else {
        this.goToStep(this.currentStep + 1);
      }
    }, 2500); // Change step every 2.5 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Utility functions
function copyUSSDCode() {
  const ussdCode = document.getElementById("main-ussd-code")?.textContent;
  if (ussdCode) {
    navigator.clipboard
      .writeText(ussdCode)
      .then(() => {
        CashlessVendor.showToast("USSD code copied to clipboard!", "success");
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = ussdCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        CashlessVendor.showToast("USSD code copied to clipboard!", "success");
      });
  }
}

function printUSSDCode() {
  const ussdCode = document.getElementById("main-ussd-code")?.textContent;
  const businessName =
    document.getElementById("ussd-business-name")?.textContent;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>USSD Payment Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 2rem;
                    background: white;
                }
                .code-container {
                    border: 3px solid #c19a6b;
                    border-radius: 12px;
                    padding: 2rem;
                    margin: 2rem auto;
                    max-width: 400px;
                    background: linear-gradient(135deg, #faf7f2 0%, #f5f0e8 100%);
                }
                .code-label {
                    font-size: 1.2rem;
                    color: #8b6f47;
                    margin-bottom: 1rem;
                }
                .code-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #c19a6b;
                    margin: 1rem 0;
                    font-family: monospace;
                }
                .business-name {
                    font-size: 1.5rem;
                    color: #8b6f47;
                    margin-top: 1rem;
                }
                .instructions {
                    margin-top: 2rem;
                    color: #a0826d;
                    font-size: 1rem;
                }
            </style>
        </head>
        <body>
            <div class="code-container">
                <div class="code-label">Dial this code to pay:</div>
                <div class="code-value">${ussdCode}</div>
                <div class="business-name">${businessName}</div>
            </div>
            <div class="instructions">
                <p>1. Dial the code above</p>
                <p>2. Enter payment amount</p>
                <p>3. Confirm with your PIN</p>
                <p>4. Payment complete!</p>
            </div>
        </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.print();
}

function shareUSSDCode() {
  const ussdCode = document.getElementById("main-ussd-code")?.textContent;
  const businessName =
    document.getElementById("ussd-business-name")?.textContent;

  const shareText = `Pay ${businessName} using USSD: ${ussdCode}`;

  if (navigator.share) {
    navigator.share({
      title: `Pay ${businessName}`,
      text: shareText,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      CashlessVendor.showToast("USSD code copied to clipboard!", "success");
    });
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    CashlessVendor.Storage.clear();
    CashlessVendor.navigateTo("index.html");
  }
}

// Initialize USSD when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (
    document.querySelector(".dashboard-layout") &&
    window.location.pathname.includes("ussd")
  ) {
    new USSDManager();
  }
});

// Export for global use
window.USSDManager = USSDManager;
