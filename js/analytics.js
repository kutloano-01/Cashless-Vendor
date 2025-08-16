// Analytics page functionality

class VendorAnalytics {
    constructor() {
        this.vendorData = null;
        this.transactions = [];
        this.currentPeriod = 'week';
        this.analytics = {
            totalRevenue: 0,
            totalTransactions: 0,
            averageTransaction: 0,
            peakHour: '--'
        };
        
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
        
        // Update vendor info in sidebar
        this.updateVendorInfo();
        
        // Load analytics data
        this.loadAnalyticsData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update displays
        this.updateAnalyticsDisplay();
        this.updateTransactionsTable();
    }
    
    loadVendorData() {
        this.vendorData = CashlessVendor.Storage.get('currentVendor');
        const isRegistered = CashlessVendor.Storage.get('vendorRegistered');
        
        if (!this.vendorData || !isRegistered) {
            this.vendorData = null;
        }
    }
    
    redirectToRegistration() {
        CashlessVendor.showToast('Please complete registration first', 'warning');
        setTimeout(() => {
            CashlessVendor.navigateTo('index.html');
        }, 2000);
    }
    
    updateVendorInfo() {
        if (!this.vendorData) return;
        
        const vendorName = document.getElementById('vendor-name');
        const vendorId = document.getElementById('vendor-id-display');
        const vendorInitials = document.getElementById('vendor-initials');
        
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
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    loadAnalyticsData() {
        // Load transactions
        this.transactions = CashlessVendor.Storage.get('vendorTransactions') || [];
        
        // Calculate analytics based on current period
        this.calculateAnalytics();
    }
    
    calculateAnalytics() {
        const filteredTransactions = this.filterTransactionsByPeriod(this.transactions, this.currentPeriod);
        
        this.analytics.totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
        this.analytics.totalTransactions = filteredTransactions.length;
        this.analytics.averageTransaction = this.analytics.totalTransactions > 0 
            ? this.analytics.totalRevenue / this.analytics.totalTransactions 
            : 0;
        this.analytics.peakHour = this.calculatePeakHour(filteredTransactions);
    }
    
    filterTransactionsByPeriod(transactions, period) {
        const now = new Date();
        const startDate = new Date();
        
        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }
        
        return transactions.filter(tx => {
            const txDate = new Date(tx.timestamp);
            return txDate >= startDate && txDate <= now;
        });
    }
    
    calculatePeakHour(transactions) {
        if (transactions.length === 0) return '--';
        
        const hourCounts = {};
        
        transactions.forEach(tx => {
            const hour = new Date(tx.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        const peakHour = Object.keys(hourCounts).reduce((a, b) => 
            hourCounts[a] > hourCounts[b] ? a : b
        );
        
        const hour12 = parseInt(peakHour) % 12 || 12;
        const ampm = parseInt(peakHour) >= 12 ? 'PM' : 'AM';
        
        return `${hour12}:00 ${ampm}`;
    }
    
    setupEventListeners() {
        const periodSelector = document.getElementById('period-selector');
        if (periodSelector) {
            periodSelector.addEventListener('change', (e) => {
                this.currentPeriod = e.target.value;
                this.calculateAnalytics();
                this.updateAnalyticsDisplay();
                this.updateCharts();
            });
        }
    }
    
    updateAnalyticsDisplay() {
        // Update overview stats
        const totalRevenue = document.getElementById('total-revenue');
        const totalTransactions = document.getElementById('total-transactions');
        const avgTransaction = document.getElementById('avg-transaction');
        const peakHour = document.getElementById('peak-hour');
        
        if (totalRevenue) {
            totalRevenue.textContent = CashlessVendor.formatCurrency(this.analytics.totalRevenue);
        }
        
        if (totalTransactions) {
            totalTransactions.textContent = this.analytics.totalTransactions;
        }
        
        if (avgTransaction) {
            avgTransaction.textContent = CashlessVendor.formatCurrency(this.analytics.averageTransaction);
        }
        
        if (peakHour) {
            peakHour.textContent = this.analytics.peakHour;
        }
        
        // Update change indicators (mock data for demo)
        this.updateChangeIndicators();
    }
    
    updateChangeIndicators() {
        const revenueChange = document.getElementById('revenue-change');
        const transactionsChange = document.getElementById('transactions-change');
        const avgChange = document.getElementById('avg-change');
        const peakChange = document.getElementById('peak-change');
        
        if (revenueChange) {
            revenueChange.textContent = '+15.3% from last week';
        }
        
        if (transactionsChange) {
            transactionsChange.textContent = `+${Math.max(0, this.analytics.totalTransactions - 5)} from last week`;
        }
        
        if (avgChange) {
            avgChange.textContent = '+5.2% from last week';
        }
        
        if (peakChange) {
            peakChange.textContent = 'Most active time';
        }
    }
    
    updateCharts() {
        // Update chart data based on current period
        // For demo purposes, we'll use static data
        // In a real app, this would calculate actual data from transactions
        this.updateRevenueChart();
        this.updateVolumeChart();
    }
    
    updateRevenueChart() {
        const chartBars = document.querySelectorAll('#revenue-chart .chart-bar');
        const sampleData = [45.50, 62.30, 35.20, 72.80, 58.90, 78.40, 54.60];
        
        chartBars.forEach((bar, index) => {
            if (sampleData[index]) {
                const value = sampleData[index];
                const percentage = (value / Math.max(...sampleData)) * 100;
                bar.style.height = `${percentage}%`;
                bar.setAttribute('data-value', CashlessVendor.formatCurrency(value));
            }
        });
    }
    
    updateVolumeChart() {
        const chartBars = document.querySelectorAll('#volume-chart .chart-bar');
        const sampleData = [3, 5, 2, 7, 4, 8, 6];
        
        chartBars.forEach((bar, index) => {
            if (sampleData[index]) {
                const value = sampleData[index];
                const percentage = (value / Math.max(...sampleData)) * 100;
                bar.style.height = `${percentage}%`;
                bar.setAttribute('data-value', value.toString());
            }
        });
    }
    
    updateTransactionsTable() {
        const tableContainer = document.getElementById('transactions-table');
        if (!tableContainer) return;
        
        if (this.transactions.length === 0) {
            tableContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3>No transactions yet</h3>
                    <p>Transaction history will appear here once customers start paying.</p>
                </div>
            `;
            return;
        }
        
        const recentTransactions = this.transactions.slice(0, 10);
        
        tableContainer.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentTransactions.map(tx => `
                        <tr>
                            <td>${CashlessVendor.formatDateTime(tx.timestamp)}</td>
                            <td>${tx.customerName || 'Anonymous'}</td>
                            <td>${CashlessVendor.formatCurrency(tx.amount)}</td>
                            <td>${this.formatPaymentMethod(tx.paymentMethod)}</td>
                            <td><span class="status status-${tx.status}">${tx.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    formatPaymentMethod(method) {
        const methods = {
            'card': 'Credit/Debit Card',
            'mobile': 'Mobile Money',
            'bank': 'Bank Transfer'
        };
        return methods[method] || method;
    }
}

// Utility functions
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        CashlessVendor.Storage.clear();
        CashlessVendor.navigateTo('index.html');
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-layout') && window.location.pathname.includes('analytics')) {
        new VendorAnalytics();
    }
});

// Export for global use
window.VendorAnalytics = VendorAnalytics;
