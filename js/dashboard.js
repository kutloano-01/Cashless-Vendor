// Dashboard functionality with dynamic vendor data

class VendorDashboard {
  constructor() {
    this.vendorData = null;
    this.stats = {
      totalEarnings: 0,
      todayEarnings: 0,
      todaySales: 0,
      averageSale: 0,
      availableBalance: 0,
    };
    this.transactions = [];

    this.init();
  }

  init() {
    // Load vendor data
    this.loadVendorData();

    // Check if vendor is registered
    if (!this.vendorData) {
      this.redirectToRegistration();
      return;
    }

    // Update UI with vendor data
    this.updateVendorInfo();
    this.loadDashboardData();
    this.setupEventListeners();

    // Generate sample data for demo
    this.generateSampleData();
  }

  loadVendorData() {
    this.vendorData = CashlessVendor.Storage.get("currentVendor");
    const isRegistered = CashlessVendor.Storage.get("vendorRegistered");

    if (!this.vendorData || !isRegistered) {
      this.vendorData = null;
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

    // Update sidebar vendor info
    const vendorName = document.getElementById("vendor-name");
    const vendorId = document.getElementById("vendor-id-display");
    const vendorInitials = document.getElementById("vendor-initials");

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

    // Update QR modal info
    this.updateQRModalInfo();
  }

  updateQRModalInfo() {
    const qrBusinessName = document.getElementById("qr-business-name");
    const qrLocation = document.getElementById("qr-location");
    const qrVendorId = document.getElementById("qr-vendor-id");
    const paymentUrl = document.getElementById("payment-url");
    const ussdCode = document.getElementById("ussd-code");

    if (qrBusinessName) {
      qrBusinessName.textContent = this.vendorData.businessName;
    }

    if (qrLocation) {
      qrLocation.textContent = this.vendorData.location;
    }

    if (qrVendorId) {
      qrVendorId.textContent = this.vendorData.vendorId;
    }

    if (paymentUrl) {
      const url = `${window.location.origin}/pay.html?vendor=${this.vendorData.vendorId}`;
      paymentUrl.value = url;
    }

    if (ussdCode) {
      ussdCode.textContent = this.vendorData.ussdCode;
    }
  }

  getInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  loadDashboardData() {
    // Load stats from localStorage or use defaults
    const savedStats = CashlessVendor.Storage.get("vendorStats");
    if (savedStats) {
      this.stats = { ...this.stats, ...savedStats };
    }

    // Load transactions
    const savedTransactions = CashlessVendor.Storage.get("vendorTransactions");
    if (savedTransactions) {
      this.transactions = savedTransactions;
    }

    this.updateStatsDisplay();
    this.updateTransactionsList();
  }

  updateStatsDisplay() {
    // Update stat cards
    const totalEarnings = document.getElementById("total-earnings");
    const todaySales = document.getElementById("today-sales");
    const averageSale = document.getElementById("average-sale");
    const availableBalance = document.getElementById("available-balance");

    const earningsChange = document.getElementById("earnings-change");
    const salesChange = document.getElementById("sales-change");
    const averageChange = document.getElementById("average-change");
    const balanceChange = document.getElementById("balance-change");

    if (totalEarnings) {
      totalEarnings.textContent = CashlessVendor.formatCurrency(
        this.stats.totalEarnings
      );
    }

    if (todaySales) {
      todaySales.textContent = this.stats.todaySales;
    }

    if (averageSale) {
      averageSale.textContent = CashlessVendor.formatCurrency(
        this.stats.averageSale
      );
    }

    if (availableBalance) {
      availableBalance.textContent = CashlessVendor.formatCurrency(
        this.stats.availableBalance
      );
    }

    if (earningsChange) {
      earningsChange.textContent = `+${CashlessVendor.formatCurrency(
        this.stats.todayEarnings
      )} today`;
    }

    if (salesChange) {
      salesChange.textContent = "transactions";
    }

    if (averageChange) {
      averageChange.textContent = "per transaction";
    }

    if (balanceChange) {
      balanceChange.textContent = "ready to withdraw";
    }
  }

  updateTransactionsList() {
    const transactionsList = document.getElementById("transactions-list");
    if (!transactionsList) return;

    if (this.transactions.length === 0) {
      transactionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>No transactions yet</h3>
                    <p>Your recent transactions will appear here once customers start paying.</p>
                    <button class="btn btn-primary" onclick="showQRCode()">Show QR Code</button>
                </div>
            `;
      return;
    }

    const recentTransactions = this.transactions.slice(0, 5);
    transactionsList.innerHTML = recentTransactions
      .map(
        (transaction) => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-customer">${
                      transaction.customerName || "Anonymous Customer"
                    }</div>
                    <div class="transaction-time">${CashlessVendor.formatDateTime(
                      transaction.timestamp
                    )}</div>
                </div>
                <div class="transaction-amount">
                    <span class="amount">${CashlessVendor.formatCurrency(
                      transaction.amount
                    )}</span>
                    <span class="status status-${transaction.status}">${
          transaction.status
        }</span>
                </div>
            </div>
        `
      )
      .join("");
  }

  generateSampleData() {
    // Generate sample data for demo purposes
    if (this.transactions.length === 0) {
      const sampleTransactions = [
        {
          id: "tx-001",
          customerName: "John Smith",
          amount: 25.5,
          status: "completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        },
        {
          id: "tx-002",
          customerName: "Sarah Johnson",
          amount: 15.75,
          status: "completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "tx-003",
          customerName: "Mike Wilson",
          amount: 42.0,
          status: "completed",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        },
      ];

      this.transactions = sampleTransactions;
      CashlessVendor.Storage.set("vendorTransactions", this.transactions);

      // Update stats based on sample data
      this.stats.totalEarnings = 247.85;
      this.stats.todayEarnings = 83.25;
      this.stats.todaySales = 3;
      this.stats.averageSale = 27.75;
      this.stats.availableBalance = 247.85;

      CashlessVendor.Storage.set("vendorStats", this.stats);

      this.updateStatsDisplay();
      this.updateTransactionsList();
    }
  }

  setupEventListeners() {
    // QR Code modal events are handled in the HTML onclick attributes
    // Additional event listeners can be added here
  }
}

// QR Code functionality
function showQRCode() {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  if (!vendorData) {
    CashlessVendor.showToast("Vendor data not found", "error");
    return;
  }

  // Generate actual QR code
  generateQRCodeForModal(vendorData.vendorId);
  CashlessVendor.showModal("qr-modal");
}

function copyPaymentUrl() {
  const paymentUrl = document.getElementById("payment-url");
  if (paymentUrl) {
    paymentUrl.select();
    document.execCommand("copy");
    CashlessVendor.showToast("Payment URL copied to clipboard!", "success");
  }
}

function downloadQR() {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  if (vendorData) {
    downloadQRCode(
      vendorData.vendorId,
      `${vendorData.businessName}-qr-code.png`
    );
    CashlessVendor.showToast("QR code downloaded!", "success");
  }
}

function printQR() {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  if (vendorData) {
    createPrintableQRCode(vendorData.vendorId);
  } else {
    window.print();
  }
}

function sharePaymentLink() {
  const vendorData = CashlessVendor.Storage.get("currentVendor");
  if (!vendorData) return;

  const url = `${window.location.origin}/pay.html?vendor=${vendorData.vendorId}`;

  if (navigator.share) {
    navigator.share({
      title: `Pay ${vendorData.businessName}`,
      text: `Pay ${vendorData.businessName} using CashlessVendor`,
      url: url,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      CashlessVendor.showToast("Payment link copied to clipboard!", "success");
    });
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    CashlessVendor.Storage.clear();
    CashlessVendor.navigateTo("index.html");
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".dashboard-layout")) {
    new VendorDashboard();
  }
});

// Export for global use
window.VendorDashboard = VendorDashboard;
