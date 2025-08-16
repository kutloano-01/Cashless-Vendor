// Payment interface functionality

class PaymentInterface {
    constructor() {
        this.vendorId = null;
        this.vendorData = null;
        this.amount = 0;
        this.processingFee = 0.50; // Fixed processing fee
        this.validator = null;
        
        this.init();
    }
    
    init() {
        // Get vendor ID from URL
        this.vendorId = CashlessVendor.getUrlParameter('vendor');
        
        if (!this.vendorId) {
            this.showError('Invalid payment link. Vendor ID not found.');
            return;
        }
        
        // Load vendor data
        this.loadVendorData();
        
        // Setup form validation
        this.validator = setupPaymentValidation();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateVendorInfo();
        this.updateSummary();
    }
    
    loadVendorData() {
        // In a real app, this would fetch from an API
        // For demo, we'll use the stored vendor data or create sample data
        const storedVendor = CashlessVendor.Storage.get('currentVendor');
        
        if (storedVendor && storedVendor.vendorId === this.vendorId) {
            this.vendorData = storedVendor;
        } else {
            // Create sample vendor data for demo
            this.vendorData = {
                vendorId: this.vendorId,
                businessName: "Maria's Fresh Fruits",
                ownerName: "Maria Santos",
                location: "Corner of Main St & 5th Ave",
                businessType: "food"
            };
        }
    }
    
    updateVendorInfo() {
        if (!this.vendorData) return;
        
        const businessName = document.getElementById('vendor-business-name');
        const location = document.getElementById('vendor-location');
        const vendorIdBadge = document.getElementById('vendor-id-badge');
        const avatarText = document.getElementById('vendor-avatar-text');
        
        if (businessName) {
            businessName.textContent = this.vendorData.businessName;
        }
        
        if (location) {
            location.textContent = this.vendorData.location;
        }
        
        if (vendorIdBadge) {
            vendorIdBadge.textContent = this.vendorData.vendorId;
        }
        
        if (avatarText) {
            const initials = this.getInitials(this.vendorData.businessName);
            avatarText.textContent = initials;
        }
    }
    
    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    setupEventListeners() {
        // Amount input
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => {
                this.updateAmount();
                this.updateSummary();
            });
        }
        
        // Quick amount buttons
        const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        quickAmountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const amount = parseFloat(btn.dataset.amount);
                this.setAmount(amount);
                this.updateQuickAmountButtons(btn);
            });
        });
        
        // Payment form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
    }
    
    updateAmount() {
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            this.amount = parseFloat(amountInput.value) || 0;
        }
    }
    
    setAmount(amount) {
        this.amount = amount;
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.value = amount.toFixed(2);
        }
        this.updateSummary();
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
        const summaryAmount = document.getElementById('summary-amount');
        const summaryFee = document.getElementById('summary-fee');
        const summaryTotal = document.getElementById('summary-total');
        
        const total = this.amount + this.processingFee;
        
        if (summaryAmount) {
            summaryAmount.textContent = CashlessVendor.formatCurrency(this.amount);
        }
        
        if (summaryFee) {
            summaryFee.textContent = CashlessVendor.formatCurrency(this.processingFee);
        }
        
        if (summaryTotal) {
            summaryTotal.textContent = CashlessVendor.formatCurrency(total);
        }
    }
    
    async processPayment() {
        // Validate form
        if (!this.validator.validateAll()) {
            CashlessVendor.showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        if (this.amount < 0.01) {
            CashlessVendor.showToast('Please enter a valid amount', 'error');
            return;
        }
        
        // Get payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if (!paymentMethod) {
            CashlessVendor.showToast('Please select a payment method', 'error');
            return;
        }
        
        // Show processing modal
        this.showProcessingModal();
        
        try {
            // Simulate payment processing
            const result = await this.simulatePayment(paymentMethod);
            
            if (result.success) {
                this.showSuccessModal(result);
                this.recordTransaction(result);
            } else {
                this.showErrorModal(result.error);
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showErrorModal('Payment processing failed. Please try again.');
        }
    }
    
    showProcessingModal() {
        const processingAmount = document.getElementById('processing-amount');
        if (processingAmount) {
            processingAmount.textContent = CashlessVendor.formatCurrency(this.amount + this.processingFee);
        }
        CashlessVendor.showModal('processing-modal');
    }
    
    async simulatePayment(paymentMethod) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            return {
                success: true,
                transactionId: this.generateTransactionId(),
                amount: this.amount,
                fee: this.processingFee,
                total: this.amount + this.processingFee,
                paymentMethod: paymentMethod,
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: 'Payment was declined by your bank. Please try a different payment method.'
            };
        }
    }
    
    generateTransactionId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'TXN-';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    showSuccessModal(result) {
        CashlessVendor.hideModal('processing-modal');
        
        const successAmount = document.getElementById('success-amount');
        const successVendor = document.getElementById('success-vendor');
        const successTransactionId = document.getElementById('success-transaction-id');
        
        if (successAmount) {
            successAmount.textContent = CashlessVendor.formatCurrency(result.total);
        }
        
        if (successVendor) {
            successVendor.textContent = this.vendorData.businessName;
        }
        
        if (successTransactionId) {
            successTransactionId.textContent = result.transactionId;
        }
        
        CashlessVendor.showModal('success-modal');
    }
    
    showErrorModal(errorMessage) {
        CashlessVendor.hideModal('processing-modal');
        
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = errorMessage;
        }
        
        CashlessVendor.showModal('error-modal');
    }
    
    showError(message) {
        const container = document.querySelector('.payment-main .container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h2>Payment Error</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="window.close()">Close</button>
                </div>
            `;
        }
    }
    
    recordTransaction(result) {
        // Record transaction for the vendor
        const transaction = {
            id: result.transactionId,
            vendorId: this.vendorId,
            amount: result.amount,
            fee: result.fee,
            total: result.total,
            paymentMethod: result.paymentMethod,
            status: 'completed',
            timestamp: result.timestamp,
            customerName: 'Anonymous Customer' // In real app, this would come from user auth
        };
        
        // Save to vendor's transaction history
        let transactions = CashlessVendor.Storage.get('vendorTransactions') || [];
        transactions.unshift(transaction); // Add to beginning
        CashlessVendor.Storage.set('vendorTransactions', transactions);
        
        // Update vendor stats
        let stats = CashlessVendor.Storage.get('vendorStats') || {
            totalEarnings: 0,
            todayEarnings: 0,
            todaySales: 0,
            averageSale: 0,
            availableBalance: 0
        };
        
        stats.totalEarnings += result.amount;
        stats.todayEarnings += result.amount;
        stats.todaySales += 1;
        stats.averageSale = stats.totalEarnings / stats.todaySales;
        stats.availableBalance += result.amount;
        
        CashlessVendor.Storage.set('vendorStats', stats);
    }
}

// Utility functions
function printReceipt() {
    window.print();
}

// Initialize payment interface when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.payment-layout')) {
        new PaymentInterface();
    }
});

// Export for global use
window.PaymentInterface = PaymentInterface;
