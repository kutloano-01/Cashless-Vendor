// Withdrawals page functionality

class WithdrawalsManager {
    constructor() {
        this.vendorData = null;
        this.availableBalance = 247.85;
        this.processingFee = 2.50;
        this.validator = null;
        
        this.init();
    }
    
    init() {
        // Load vendor data
        this.loadVendorData();
        
        if (!this.vendorData) {
            this.redirectToRegistration();
            return;
        }
        
        // Update vendor info
        this.updateVendorInfo();
        
        // Setup form validation
        this.validator = setupWithdrawalValidation();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update displays
        this.updateBalanceDisplay();
        this.updateSummary();
    }
    
    loadVendorData() {
        this.vendorData = CashlessVendor.Storage.get('currentVendor');
        const isRegistered = CashlessVendor.Storage.get('vendorRegistered');
        
        if (!this.vendorData || !isRegistered) {
            this.vendorData = null;
        }
        
        // Load balance from stats
        const stats = CashlessVendor.Storage.get('vendorStats');
        if (stats && stats.availableBalance) {
            this.availableBalance = stats.availableBalance;
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
        const accountHolderName = document.getElementById('account-holder-name');
        
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
        
        if (accountHolderName) {
            accountHolderName.textContent = this.vendorData.ownerName;
        }
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    updateBalanceDisplay() {
        const availableBalance = document.getElementById('available-balance');
        const withdrawalAmountInput = document.getElementById('withdrawal-amount');
        
        if (availableBalance) {
            availableBalance.textContent = CashlessVendor.formatCurrency(this.availableBalance);
        }
        
        if (withdrawalAmountInput) {
            withdrawalAmountInput.setAttribute('max', this.availableBalance.toString());
        }
        
        // Update amount limits
        const amountLimits = document.querySelector('.amount-limits');
        if (amountLimits) {
            amountLimits.innerHTML = `
                <span>Min: R1.00</span>
                <span>Max: ${CashlessVendor.formatCurrency(this.availableBalance)}</span>
            `;
        }
        
        // Update "All" button
        const allButton = document.querySelector('.quick-amount-btn[data-amount="247.85"]');
        if (allButton) {
            allButton.setAttribute('data-amount', this.availableBalance.toString());
            allButton.textContent = 'All';
        }
    }
    
    setupEventListeners() {
        // Amount input
        const amountInput = document.getElementById('withdrawal-amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                this.updateSummary();
                this.updateSubmitButton();
            });
        }
        
        // Quick amount buttons
        const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        quickAmountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let amount = parseFloat(btn.dataset.amount);
                if (btn.textContent === 'All') {
                    amount = this.availableBalance;
                }
                this.setAmount(amount);
                this.updateQuickAmountButtons(btn);
            });
        });
        
        // Withdrawal form
        const withdrawalForm = document.getElementById('withdrawal-form');
        if (withdrawalForm) {
            withdrawalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processWithdrawal();
            });
        }
    }
    
    setAmount(amount) {
        const amountInput = document.getElementById('withdrawal-amount');
        if (amountInput) {
            amountInput.value = amount.toFixed(2);
        }
        this.updateSummary();
        this.updateSubmitButton();
    }
    
    updateQuickAmountButtons(activeBtn) {
        const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        quickAmountBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    updateSummary() {
        const amountInput = document.getElementById('withdrawal-amount');
        const summaryAmount = document.getElementById('summary-amount');
        const summaryTotal = document.getElementById('summary-total');
        
        const amount = parseFloat(amountInput?.value) || 0;
        const netAmount = Math.max(0, amount - this.processingFee);
        
        if (summaryAmount) {
            summaryAmount.textContent = CashlessVendor.formatCurrency(amount);
        }
        
        if (summaryTotal) {
            summaryTotal.textContent = CashlessVendor.formatCurrency(netAmount);
        }
    }
    
    updateSubmitButton() {
        const submitBtn = document.getElementById('withdraw-btn');
        const amountInput = document.getElementById('withdrawal-amount');
        
        if (!submitBtn || !amountInput) return;
        
        const amount = parseFloat(amountInput.value) || 0;
        const isValid = amount >= 1 && amount <= this.availableBalance;
        
        submitBtn.disabled = !isValid;
    }
    
    async processWithdrawal() {
        const amountInput = document.getElementById('withdrawal-amount');
        const amount = parseFloat(amountInput?.value) || 0;
        
        // Validate amount
        if (amount < 1) {
            CashlessVendor.showToast('Minimum withdrawal amount is R1.00', 'error');
            return;
        }
        
        if (amount > this.availableBalance) {
            CashlessVendor.showToast('Insufficient balance', 'error');
            return;
        }
        
        // Show processing modal
        this.showProcessingModal(amount);
        
        try {
            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Update balance
            this.availableBalance -= amount;
            
            // Update stored stats
            const stats = CashlessVendor.Storage.get('vendorStats') || {};
            stats.availableBalance = this.availableBalance;
            CashlessVendor.Storage.set('vendorStats', stats);
            
            // Show success
            this.showSuccessModal(amount);
            
            // Update displays
            this.updateBalanceDisplay();
            this.setAmount(0);
            
        } catch (error) {
            console.error('Withdrawal error:', error);
            CashlessVendor.showToast('Withdrawal failed. Please try again.', 'error');
        }
    }
    
    showProcessingModal(amount) {
        const processingAmount = document.getElementById('processing-amount');
        if (processingAmount) {
            processingAmount.textContent = CashlessVendor.formatCurrency(amount);
        }
        CashlessVendor.showModal('processing-modal');
    }
    
    showSuccessModal(amount) {
        CashlessVendor.hideModal('processing-modal');
        
        const successAmount = document.getElementById('success-amount');
        const successNet = document.getElementById('success-net');
        const expectedDate = document.getElementById('expected-date');
        
        const netAmount = amount - this.processingFee;
        const expectedDateValue = new Date();
        expectedDateValue.setDate(expectedDateValue.getDate() + 2);
        
        if (successAmount) {
            successAmount.textContent = CashlessVendor.formatCurrency(amount);
        }
        
        if (successNet) {
            successNet.textContent = CashlessVendor.formatCurrency(netAmount);
        }
        
        if (expectedDate) {
            expectedDate.textContent = CashlessVendor.formatDate(expectedDateValue);
        }
        
        CashlessVendor.showModal('success-modal');
    }
}

// Utility functions
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        CashlessVendor.Storage.clear();
        CashlessVendor.navigateTo('index.html');
    }
}

// Initialize withdrawals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-layout') && window.location.pathname.includes('withdrawals')) {
        new WithdrawalsManager();
    }
});

// Export for global use
window.WithdrawalsManager = WithdrawalsManager;
