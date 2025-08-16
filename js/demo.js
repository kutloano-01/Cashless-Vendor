// Demo page functionality

class DemoManager {
    constructor() {
        this.vendorData = null;
        this.demoAmount = 25.50;
        this.processingFee = 0.50;
        
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
        this.updateDemoVendorInfo();
        
        // Setup event listeners
        this.setupEventListeners();
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
    
    updateDemoVendorInfo() {
        if (!this.vendorData) return;
        
        const demoBusinessName = document.getElementById('demo-business-name');
        const demoLocation = document.getElementById('demo-location');
        const demoVendorId = document.getElementById('demo-vendor-id');
        const demoVendorInitials = document.getElementById('demo-vendor-initials');
        
        if (demoBusinessName) {
            demoBusinessName.textContent = this.vendorData.businessName;
        }
        
        if (demoLocation) {
            demoLocation.textContent = this.vendorData.location;
        }
        
        if (demoVendorId) {
            demoVendorId.textContent = this.vendorData.vendorId;
        }
        
        if (demoVendorInitials) {
            const initials = this.getInitials(this.vendorData.businessName);
            demoVendorInitials.textContent = initials;
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
        // Demo amount input
        const demoAmountInput = document.getElementById('demo-amount');
        if (demoAmountInput) {
            demoAmountInput.addEventListener('input', () => {
                this.updateDemoSummary();
            });
        }
        
        // Demo quick amount buttons
        const demoQuickAmountBtns = document.querySelectorAll('#demo-payment .quick-amount-btn');
        demoQuickAmountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const amount = parseFloat(btn.dataset.amount);
                this.setDemoAmount(amount);
                this.updateDemoQuickAmountButtons(btn);
            });
        });
        
        // Demo payment form
        const demoPaymentForm = document.getElementById('demo-payment-form');
        if (demoPaymentForm) {
            demoPaymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processDemoPayment();
            });
        }
    }
    
    setDemoAmount(amount) {
        this.demoAmount = amount;
        const demoAmountInput = document.getElementById('demo-amount');
        if (demoAmountInput) {
            demoAmountInput.value = amount.toFixed(2);
        }
        this.updateDemoSummary();
    }
    
    updateDemoQuickAmountButtons(activeBtn) {
        const demoQuickAmountBtns = document.querySelectorAll('#demo-payment .quick-amount-btn');
        demoQuickAmountBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    updateDemoSummary() {
        const demoAmountInput = document.getElementById('demo-amount');
        const demoSummaryAmount = document.getElementById('demo-summary-amount');
        const demoSummaryTotal = document.getElementById('demo-summary-total');
        
        const amount = parseFloat(demoAmountInput?.value) || 0;
        const total = amount + this.processingFee;
        
        if (demoSummaryAmount) {
            demoSummaryAmount.textContent = CashlessVendor.formatCurrency(amount);
        }
        
        if (demoSummaryTotal) {
            demoSummaryTotal.textContent = CashlessVendor.formatCurrency(total);
        }
        
        this.demoAmount = amount;
    }
    
    async processDemoPayment() {
        // Show processing animation
        const payBtn = document.querySelector('#demo-payment .payment-btn');
        const originalText = payBtn.textContent;
        payBtn.disabled = true;
        payBtn.innerHTML = '<div class="spinner"></div> Processing Demo...';
        
        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success modal
            this.showDemoSuccessModal();
            
        } catch (error) {
            console.error('Demo payment error:', error);
            CashlessVendor.showToast('Demo payment failed', 'error');
        } finally {
            // Restore button
            payBtn.disabled = false;
            payBtn.textContent = originalText;
        }
    }
    
    showDemoSuccessModal() {
        CashlessVendor.showModal('demo-success-modal');
    }
}

// Global functions
function startDemo() {
    const demoPayment = document.getElementById('demo-payment');
    if (demoPayment) {
        demoPayment.style.display = 'block';
        demoPayment.scrollIntoView({ behavior: 'smooth' });
    }
}

function openPaymentLink() {
    const vendorData = CashlessVendor.Storage.get('currentVendor');
    if (vendorData) {
        const paymentUrl = `pay.html?vendor=${vendorData.vendorId}`;
        window.open(paymentUrl, '_blank');
    } else {
        CashlessVendor.showToast('Please complete registration first', 'warning');
    }
}

function restartDemo() {
    CashlessVendor.hideModal('demo-success-modal');
    
    // Reset demo form
    const demoAmountInput = document.getElementById('demo-amount');
    if (demoAmountInput) {
        demoAmountInput.value = '25.50';
    }
    
    // Reset quick amount buttons
    const demoQuickAmountBtns = document.querySelectorAll('#demo-payment .quick-amount-btn');
    demoQuickAmountBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.amount === '25.50') {
            btn.classList.add('active');
        }
    });
    
    // Reset payment method
    const cardRadio = document.querySelector('input[name="demoPaymentMethod"][value="card"]');
    if (cardRadio) {
        cardRadio.checked = true;
    }
    
    // Update summary
    const demoSummaryAmount = document.getElementById('demo-summary-amount');
    const demoSummaryTotal = document.getElementById('demo-summary-total');
    
    if (demoSummaryAmount) {
        demoSummaryAmount.textContent = 'R25.50';
    }
    
    if (demoSummaryTotal) {
        demoSummaryTotal.textContent = 'R26.00';
    }
    
    // Scroll to demo
    const demoPayment = document.getElementById('demo-payment');
    if (demoPayment) {
        demoPayment.scrollIntoView({ behavior: 'smooth' });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        CashlessVendor.Storage.clear();
        CashlessVendor.navigateTo('index.html');
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-layout') && window.location.pathname.includes('demo')) {
        new DemoManager();
    }
});

// Export for global use
window.DemoManager = DemoManager;
