// Microloans Page JavaScript

class MicroloansManager {
    constructor() {
        this.creditScoring = null;
        this.currentAssessment = null;
        this.vendorId = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading state
            this.showLoadingState();

            // Initialize credit scoring system
            this.creditScoring = new AICreditScoring();

            // Get current vendor
            const vendor = CashlessVendor.Storage.get('currentVendor');
            this.vendorId = vendor ? vendor.id : 'demo_vendor';

            // Update vendor info in sidebar
            this.updateVendorInfo(vendor);

            // Load and display credit assessment
            await this.loadCreditAssessment();

            // Setup event listeners
            this.setupEventListeners();

            // Load existing loans
            this.loadExistingLoans();

        } catch (error) {
            console.error('Error initializing microloans page:', error);
            this.showErrorState('Failed to load microloans page. Please refresh and try again.');
        }
    }

    showLoadingState() {
        // Show loading skeletons
        document.getElementById('credit-score').innerHTML = '<div class="loading-skeleton score-loading"></div>';
        document.getElementById('credit-tier').textContent = 'Loading...';
        document.getElementById('score-description').textContent = 'Analyzing your transaction history...';
        document.getElementById('eligibility-status').textContent = 'Checking...';
        document.getElementById('max-loan-amount').textContent = 'R--,---';

        // Show loading for credit factors
        const factorFills = document.querySelectorAll('.factor-fill');
        factorFills.forEach(fill => {
            fill.className = 'factor-fill loading-skeleton factor-loading';
            fill.style.width = '100%';
        });
    }

    showErrorState(message) {
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="card error-state">
                    <div class="card-content" style="text-align: center; padding: 3rem;">
                        <h3>⚠️ Error Loading Microloans</h3>
                        <p>${message}</p>
                        <button class="btn-primary" onclick="window.location.reload()">
                            🔄 Retry
                        </button>
                    </div>
                </div>
            `;
        }
    }

    updateVendorInfo(vendor) {
        if (vendor) {
            const vendorName = document.getElementById('vendor-name');
            const vendorId = document.getElementById('vendor-id-display');
            const vendorInitials = document.getElementById('vendor-initials');

            if (vendorName) vendorName.textContent = vendor.ownerName || 'Demo Vendor';
            if (vendorId) vendorId.textContent = vendor.id || 'CV-DEMO123';
            if (vendorInitials) {
                const initials = (vendor.ownerName || 'DV').split(' ').map(n => n[0]).join('').toUpperCase();
                vendorInitials.textContent = initials;
            }
        }
    }
    
    async loadCreditAssessment() {
        try {
            if (typeof CashlessVendor !== 'undefined' && CashlessVendor.showToast) {
                CashlessVendor.showToast('🤖 AI analyzing your transaction history...', 'info');
            }

            // Check if credit scoring system is available
            if (!this.creditScoring || typeof this.creditScoring.calculateCreditScore !== 'function') {
                // Fallback to demo data
                this.currentAssessment = this.generateDemoAssessment();
            } else {
                // Calculate credit score
                this.currentAssessment = await this.creditScoring.calculateCreditScore(this.vendorId);
            }

            // Record monitoring metrics
            if (window.systemMonitoring) {
                window.systemMonitoring.recordCreditAssessment(
                    this.vendorId,
                    this.currentAssessment.score,
                    this.currentAssessment.loanTerms.maxLoan > 0
                );
            }

            // Display results
            this.displayCreditScore();
            this.displayCreditFactors();
            this.displayLoanEligibility();
            this.displayCreditInsights();

            if (typeof CashlessVendor !== 'undefined' && CashlessVendor.showToast) {
                CashlessVendor.showToast('✅ Credit assessment complete!', 'success');
            }

        } catch (error) {
            console.error('Error loading credit assessment:', error);
            if (window.systemMonitoring) {
                window.systemMonitoring.recordError('Credit Assessment', error.message, this.vendorId);
            }

            // Fallback to demo data on error
            this.currentAssessment = this.generateDemoAssessment();
            this.displayCreditScore();
            this.displayCreditFactors();
            this.displayLoanEligibility();
            this.displayCreditInsights();

            if (typeof CashlessVendor !== 'undefined' && CashlessVendor.showToast) {
                CashlessVendor.showToast('⚠️ Using demo data - credit system unavailable', 'warning');
            }
        }
    }

    generateDemoAssessment() {
        // Generate realistic demo assessment data
        const baseScore = 0.65 + (Math.random() * 0.25); // Score between 65-90
        const tier = baseScore >= 0.8 ? 'excellent' :
                    baseScore >= 0.65 ? 'good' :
                    baseScore >= 0.5 ? 'fair' : 'poor';

        return {
            score: baseScore,
            tier: tier,
            confidence: 0.85 + (Math.random() * 0.1),
            factors: {
                volume: 0.7 + (Math.random() * 0.25),
                frequency: 0.6 + (Math.random() * 0.3),
                retention: 0.8 + (Math.random() * 0.15),
                reliability: 0.75 + (Math.random() * 0.2),
                growth: 0.65 + (Math.random() * 0.25),
                diversification: 0.55 + (Math.random() * 0.3),
                stability: 0.7 + (Math.random() * 0.2)
            },
            loanTerms: {
                maxLoan: tier === 'excellent' ? 50000 :
                        tier === 'good' ? 25000 :
                        tier === 'fair' ? 10000 : 5000,
                interestRate: tier === 'excellent' ? 0.08 :
                             tier === 'good' ? 0.12 :
                             tier === 'fair' ? 0.18 : 0.25,
                termMonths: tier === 'excellent' ? 24 :
                           tier === 'good' ? 18 :
                           tier === 'fair' ? 12 : 6
            },
            insights: [
                "Your transaction volume shows consistent growth over the past 6 months.",
                "Consider diversifying payment methods to improve your credit score.",
                "Your customer retention rate is above average for street vendors.",
                "Regular transaction patterns indicate stable business operations."
            ]
        };
    }
    
    displayCreditScore() {
        const scoreElement = document.getElementById('credit-score');
        const tierElement = document.getElementById('credit-tier');
        const descriptionElement = document.getElementById('score-description');
        const confidenceElement = document.getElementById('confidence-fill');
        const confidencePercentElement = document.getElementById('confidence-percent');
        const scoreCircle = document.getElementById('score-circle');
        
        if (!this.currentAssessment) return;
        
        const score = Math.round(this.currentAssessment.score * 100);
        const tier = this.currentAssessment.tier;
        const confidence = Math.round(this.currentAssessment.confidence * 100);
        
        // Update score display
        scoreElement.textContent = score;
        tierElement.textContent = tier.charAt(0).toUpperCase() + tier.slice(1);
        confidenceElement.style.width = confidence + '%';
        confidencePercentElement.textContent = confidence + '%';
        
        // Update tier styling
        tierElement.className = `credit-badge tier-${tier}`;
        scoreCircle.className = `score-circle tier-${tier}`;
        
        // Update description
        const descriptions = {
            excellent: 'Outstanding credit profile! You qualify for the best loan terms.',
            good: 'Strong credit profile with competitive loan options available.',
            fair: 'Moderate credit profile. Some loan options available.',
            poor: 'Limited credit history. Small loans available to build credit.',
            denied: 'Insufficient transaction history. Continue building your record.'
        };
        
        descriptionElement.textContent = descriptions[tier] || 'Credit assessment complete.';
    }
    
    displayCreditFactors() {
        if (!this.currentAssessment || !this.currentAssessment.factors) return;

        const factors = this.currentAssessment.factors;

        Object.entries(factors).forEach(([factorName, score]) => {
            const factorFill = document.querySelector(`[data-factor="${factorName}"]`);
            const factorScore = document.querySelector(`.factor-score[data-factor="${factorName}"]`);

            if (factorFill && factorScore) {
                const percentage = Math.round(score * 100);

                // Animate the fill
                setTimeout(() => {
                    factorFill.style.width = percentage + '%';
                }, Math.random() * 500);

                factorScore.textContent = percentage;

                // Color coding based on score
                if (score >= 0.8) factorFill.className = 'factor-fill-large excellent';
                else if (score >= 0.6) factorFill.className = 'factor-fill-large good';
                else if (score >= 0.4) factorFill.className = 'factor-fill-large fair';
                else factorFill.className = 'factor-fill-large poor';
            }
        });
    }
    
    displayLoanEligibility() {
        if (!this.currentAssessment || !this.currentAssessment.loanTerms) return;

        const terms = this.currentAssessment.loanTerms;
        const statusElement = document.getElementById('eligibility-status');
        const maxAmountElement = document.getElementById('max-loan-amount');
        const interestRateElement = document.getElementById('interest-rate');
        const maxTermElement = document.getElementById('max-term');
        const estimatedPaymentElement = document.getElementById('estimated-payment');
        const maxAmountHelpElement = document.getElementById('max-amount-help');

        // Update eligibility status
        if (terms.maxLoan > 0) {
            statusElement.textContent = 'Eligible';
            statusElement.className = 'eligibility-status eligible';
        } else {
            statusElement.textContent = 'Not Eligible';
            statusElement.className = 'eligibility-status not-eligible';
        }

        // Calculate estimated monthly payment for max loan
        const estimatedPayment = terms.maxLoan > 0 ?
            this.calculateMonthlyPayment(terms.maxLoan, terms.interestRate, terms.termMonths) : 0;

        // Update loan terms
        maxAmountElement.textContent = `R${terms.maxLoan.toLocaleString()}`;
        interestRateElement.textContent = `${(terms.interestRate * 100).toFixed(1)}%`;
        maxTermElement.textContent = `${terms.termMonths} months`;
        if (estimatedPaymentElement) {
            estimatedPaymentElement.textContent = `R${estimatedPayment.toLocaleString()}`;
        }
        if (maxAmountHelpElement) {
            maxAmountHelpElement.textContent = `R${terms.maxLoan.toLocaleString()}`;
        }

        // Update form constraints
        const loanAmountInput = document.getElementById('loan-amount');
        if (loanAmountInput) {
            loanAmountInput.max = terms.maxLoan;
            loanAmountInput.disabled = terms.maxLoan === 0;
        }

        // Enable/disable apply button
        const applyBtn = document.getElementById('apply-btn');
        if (applyBtn) {
            applyBtn.disabled = terms.maxLoan === 0;
        }
    }
    
    displayCreditInsights() {
        if (!this.currentAssessment || !this.currentAssessment.insights) return;
        
        const insightsContainer = document.getElementById('credit-insights');
        insightsContainer.innerHTML = '';
        
        this.currentAssessment.insights.forEach((insight, index) => {
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item';
            
            const icons = ['💡', '📈', '🎯', '⭐', '🚀'];
            const icon = icons[index % icons.length];
            
            insightElement.innerHTML = `
                <div class="insight-icon">${icon}</div>
                <div class="insight-content">
                    <p>${insight}</p>
                </div>
            `;
            
            insightsContainer.appendChild(insightElement);
        });
    }
    
    setupEventListeners() {
        // Loan amount input
        const loanAmountInput = document.getElementById('loan-amount');
        if (loanAmountInput) {
            loanAmountInput.addEventListener('input', () => {
                this.updateLoanPreview();
            });
        }
        
        // Loan purpose select
        const loanPurposeSelect = document.getElementById('loan-purpose');
        if (loanPurposeSelect) {
            loanPurposeSelect.addEventListener('change', () => {
                this.updateLoanPreview();
            });
        }
        
        // Loan form submission
        const loanForm = document.getElementById('loan-form');
        if (loanForm) {
            loanForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitLoanApplication();
            });
        }
    }
    
    updateLoanPreview() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const loanPurpose = document.getElementById('loan-purpose').value;
        
        if (!loanAmount || !loanPurpose || !this.currentAssessment) {
            document.getElementById('loan-preview').style.display = 'none';
            return;
        }
        
        const terms = this.currentAssessment.loanTerms;
        const monthlyPayment = this.calculateMonthlyPayment(loanAmount, terms.interestRate, terms.termMonths);
        const totalRepayment = monthlyPayment * terms.termMonths;
        
        // Update preview display
        document.getElementById('preview-amount').textContent = `R${loanAmount.toLocaleString()}`;
        document.getElementById('preview-rate').textContent = `${(terms.interestRate * 100).toFixed(1)}%`;
        document.getElementById('preview-term').textContent = `${terms.termMonths} months`;
        document.getElementById('preview-payment').textContent = `R${monthlyPayment.toLocaleString()}`;
        document.getElementById('preview-total').textContent = `R${totalRepayment.toLocaleString()}`;
        
        document.getElementById('loan-preview').style.display = 'block';
    }
    
    calculateMonthlyPayment(principal, annualRate, termMonths) {
        const monthlyRate = annualRate / 12;
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
        return Math.round(payment * 100) / 100;
    }
    
    async submitLoanApplication() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const loanPurpose = document.getElementById('loan-purpose').value;
        
        if (!loanAmount || !loanPurpose) {
            CashlessVendor.showToast('❌ Please fill in all required fields', 'error');
            return;
        }
        
        if (loanAmount > this.currentAssessment.loanTerms.maxLoan) {
            CashlessVendor.showToast(`❌ Amount exceeds maximum eligible loan of R${this.currentAssessment.loanTerms.maxLoan.toLocaleString()}`, 'error');
            return;
        }
        
        try {
            CashlessVendor.showToast('📋 Processing loan application...', 'info');
            
            const application = await this.creditScoring.submitLoanApplication(
                this.vendorId,
                loanAmount,
                loanPurpose
            );
            
            this.displayApplicationResult(application);
            
        } catch (error) {
            console.error('Error submitting loan application:', error);
            CashlessVendor.showToast('❌ Error processing loan application', 'error');
        }
    }
    
    displayApplicationResult(application) {
        const statusMessages = {
            approved: '🎉 Congratulations! Your loan has been approved and funds will be disbursed within 24 hours.',
            under_review: '⏳ Your application is under review. You will receive a decision within 2-3 business days.',
            needs_review: '📋 Your application requires additional review due to the requested amount.',
            denied: '❌ Unfortunately, your loan application has been denied. Please build more transaction history and reapply.'
        };

        const message = statusMessages[application.status] || 'Application submitted successfully.';
        const toastType = application.status === 'approved' ? 'success' :
                         application.status === 'denied' ? 'error' : 'info';

        CashlessVendor.showToast(message, toastType);

        // Show application details
        this.showApplicationModal(application);

        // Refresh existing loans if approved
        if (application.status === 'approved') {
            setTimeout(() => {
                this.loadExistingLoans();
            }, 1000);
        }
    }

    showApplicationModal(application) {
        // Create and show modal with application details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Loan Application ${application.status === 'approved' ? 'Approved' : 'Submitted'}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="application-details">
                        <div class="detail-row">
                            <span>Application ID:</span>
                            <span>${application.id}</span>
                        </div>
                        <div class="detail-row">
                            <span>Requested Amount:</span>
                            <span>R${application.requestedAmount.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Approved Amount:</span>
                            <span>R${application.recommendedAmount.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Interest Rate:</span>
                            <span>${(application.interestRate * 100).toFixed(1)}%</span>
                        </div>
                        <div class="detail-row">
                            <span>Term:</span>
                            <span>${application.termMonths} months</span>
                        </div>
                        <div class="detail-row">
                            <span>Status:</span>
                            <span class="status-${application.status}">${application.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    loadExistingLoans() {
        // This would load actual loan data in a real implementation
        // For demo purposes, we'll show sample data if there are approved loans
        const existingLoansCard = document.getElementById('existing-loans-card');
        const activeLoansContainer = document.getElementById('active-loans');

        // Show sample loan if credit score is good
        if (this.currentAssessment && this.currentAssessment.tier !== 'denied') {
            existingLoansCard.style.display = 'block';

            // Sample active loan
            activeLoansContainer.innerHTML = `
                <div class="loan-item">
                    <div class="loan-header">
                        <h4>Business Expansion Loan</h4>
                        <span class="loan-status active">Active</span>
                    </div>
                    <div class="loan-details">
                        <div class="loan-progress">
                            <div class="progress-info">
                                <span>R8,500 remaining of R15,000</span>
                                <span>43% paid</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 43%"></div>
                            </div>
                        </div>
                        <div class="loan-payment">
                            <span>Next payment: R1,247 due in 12 days</span>
                            <button class="btn-secondary btn-sm">Make Payment</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Global functions for loan preview
window.calculateLoanPreview = function() {
    if (window.microloansManager) {
        window.microloansManager.updateLoanPreview();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-layout')) {
        window.microloansManager = new MicroloansManager();
    }
});

// Export for global use
window.MicroloansManager = MicroloansManager;
