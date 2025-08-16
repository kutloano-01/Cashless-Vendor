// AI Credit Scoring System for Vendor Microloans

class AICreditScoring {
    constructor() {
        this.creditFactors = {
            transactionVolume: 0.25,      // Consistent sales volume
            transactionFrequency: 0.20,   // Regular transaction patterns
            customerRetention: 0.15,      // Repeat customers
            paymentReliability: 0.15,     // On-time payment history
            businessGrowth: 0.10,         // Revenue growth trends
            diversification: 0.10,        // Multiple payment methods
            seasonalStability: 0.05       // Consistent across seasons
        };
        
        this.creditTiers = {
            excellent: { min: 0.8, maxLoan: 50000, interestRate: 0.08, term: 24 },
            good: { min: 0.65, maxLoan: 25000, interestRate: 0.12, term: 18 },
            fair: { min: 0.5, maxLoan: 10000, interestRate: 0.18, term: 12 },
            poor: { min: 0.35, maxLoan: 5000, interestRate: 0.25, term: 6 },
            denied: { min: 0, maxLoan: 0, interestRate: 0, term: 0 }
        };
        
        this.loanApplications = new Map();
        this.approvedLoans = new Map();
        this.creditHistory = new Map();
        
        this.init();
    }
    
    init() {
        // Initialize ML models for credit assessment
        this.initializeCreditModels();
        
        // Load existing credit data
        this.loadCreditHistory();
    }
    
    initializeCreditModels() {
        // Simulate ML model initialization
        this.models = {
            creditScoring: {
                algorithm: 'Random Forest',
                accuracy: 0.89,
                features: 47,
                lastTrained: new Date().toISOString(),
                version: '2.1.0'
            },
            fraudDetection: {
                algorithm: 'Neural Network',
                accuracy: 0.94,
                features: 23,
                lastTrained: new Date().toISOString(),
                version: '1.8.0'
            },
            riskAssessment: {
                algorithm: 'Gradient Boosting',
                accuracy: 0.91,
                features: 31,
                lastTrained: new Date().toISOString(),
                version: '1.5.0'
            }
        };
        
        console.log('🤖 AI Credit Scoring models initialized:', this.models);
    }
    
    async calculateCreditScore(vendorId) {
        console.log('🏦 Calculating credit score for vendor:', vendorId);
        
        // Get vendor's transaction history
        const transactionHistory = this.getVendorTransactionHistory(vendorId);
        const vendorProfile = this.getVendorProfile(vendorId);
        
        if (!transactionHistory || transactionHistory.length < 10) {
            return {
                score: 0.2,
                tier: 'denied',
                reason: 'Insufficient transaction history (minimum 10 transactions required)',
                recommendation: 'Continue building transaction history for 2-3 months'
            };
        }
        
        // Calculate individual scoring factors
        const volumeScore = this.calculateVolumeScore(transactionHistory);
        const frequencyScore = this.calculateFrequencyScore(transactionHistory);
        const retentionScore = this.calculateRetentionScore(transactionHistory);
        const reliabilityScore = this.calculateReliabilityScore(vendorProfile);
        const growthScore = this.calculateGrowthScore(transactionHistory);
        const diversificationScore = this.calculateDiversificationScore(transactionHistory);
        const stabilityScore = this.calculateStabilityScore(transactionHistory);
        
        // Weighted credit score calculation
        const creditScore = (
            volumeScore * this.creditFactors.transactionVolume +
            frequencyScore * this.creditFactors.transactionFrequency +
            retentionScore * this.creditFactors.customerRetention +
            reliabilityScore * this.creditFactors.paymentReliability +
            growthScore * this.creditFactors.businessGrowth +
            diversificationScore * this.creditFactors.diversification +
            stabilityScore * this.creditFactors.seasonalStability
        );
        
        const tier = this.getCreditTier(creditScore);
        const loanTerms = this.creditTiers[tier];
        
        return {
            score: Math.round(creditScore * 100) / 100,
            tier: tier,
            confidence: this.calculateConfidence(creditScore),
            loanTerms: loanTerms,
            factors: {
                volume: volumeScore,
                frequency: frequencyScore,
                retention: retentionScore,
                reliability: reliabilityScore,
                growth: growthScore,
                diversification: diversificationScore,
                stability: stabilityScore
            },
            insights: this.generateCreditInsights(creditScore, tier),
            timestamp: new Date().toISOString()
        };
    }
    
    calculateVolumeScore(transactions) {
        // Analyze transaction volume consistency
        const monthlyVolumes = this.groupTransactionsByMonth(transactions);
        const avgMonthlyVolume = monthlyVolumes.reduce((sum, vol) => sum + vol, 0) / monthlyVolumes.length;
        
        // Score based on volume and consistency
        if (avgMonthlyVolume > 15000) return 0.9;
        if (avgMonthlyVolume > 8000) return 0.75;
        if (avgMonthlyVolume > 4000) return 0.6;
        if (avgMonthlyVolume > 2000) return 0.45;
        return 0.3;
    }
    
    calculateFrequencyScore(transactions) {
        // Analyze transaction frequency patterns
        const dailyTransactions = this.groupTransactionsByDay(transactions);
        const avgDailyTransactions = dailyTransactions.reduce((sum, count) => sum + count, 0) / dailyTransactions.length;
        
        // Consistent daily activity scores higher
        if (avgDailyTransactions >= 5) return 0.9;
        if (avgDailyTransactions >= 3) return 0.75;
        if (avgDailyTransactions >= 2) return 0.6;
        if (avgDailyTransactions >= 1) return 0.45;
        return 0.3;
    }
    
    calculateRetentionScore(transactions) {
        // Analyze customer retention patterns
        const uniqueCustomers = new Set(transactions.map(t => t.customerId || 'anonymous')).size;
        const totalTransactions = transactions.length;
        const retentionRate = uniqueCustomers / totalTransactions;
        
        // Higher retention indicates stable business
        if (retentionRate > 0.7) return 0.9;
        if (retentionRate > 0.5) return 0.75;
        if (retentionRate > 0.3) return 0.6;
        return 0.4;
    }
    
    calculateReliabilityScore(vendorProfile) {
        // Simulate payment reliability based on profile
        const accountAge = this.calculateAccountAge(vendorProfile.created);
        const disputeRate = vendorProfile.disputeRate || 0.02;
        const chargebackRate = vendorProfile.chargebackRate || 0.01;
        
        let score = 0.8; // Base score
        
        // Account age bonus
        if (accountAge > 365) score += 0.1;
        else if (accountAge > 180) score += 0.05;
        
        // Penalty for disputes and chargebacks
        score -= disputeRate * 5;
        score -= chargebackRate * 10;
        
        return Math.max(0.1, Math.min(1.0, score));
    }
    
    calculateGrowthScore(transactions) {
        // Analyze business growth trends
        const monthlyRevenues = this.calculateMonthlyRevenues(transactions);
        
        if (monthlyRevenues.length < 3) return 0.5; // Not enough data
        
        const growthRates = [];
        for (let i = 1; i < monthlyRevenues.length; i++) {
            const growthRate = (monthlyRevenues[i] - monthlyRevenues[i-1]) / monthlyRevenues[i-1];
            growthRates.push(growthRate);
        }
        
        const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
        
        if (avgGrowthRate > 0.1) return 0.9;  // 10%+ growth
        if (avgGrowthRate > 0.05) return 0.75; // 5%+ growth
        if (avgGrowthRate > 0) return 0.6;     // Positive growth
        if (avgGrowthRate > -0.05) return 0.4; // Slight decline
        return 0.2; // Significant decline
    }
    
    calculateDiversificationScore(transactions) {
        // Analyze payment method diversity
        const paymentMethods = new Set(transactions.map(t => t.paymentMethod || 'qr')).size;
        const avgTransactionSize = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
        
        let score = 0.5; // Base score
        
        // Bonus for multiple payment methods
        if (paymentMethods >= 3) score += 0.3;
        else if (paymentMethods >= 2) score += 0.2;
        
        // Bonus for reasonable transaction sizes
        if (avgTransactionSize > 20 && avgTransactionSize < 200) score += 0.2;
        
        return Math.min(1.0, score);
    }
    
    calculateStabilityScore(transactions) {
        // Analyze seasonal stability
        const monthlyVariance = this.calculateMonthlyVariance(transactions);
        
        // Lower variance indicates more stability
        if (monthlyVariance < 0.2) return 0.9;
        if (monthlyVariance < 0.4) return 0.75;
        if (monthlyVariance < 0.6) return 0.6;
        return 0.4;
    }
    
    getCreditTier(score) {
        for (const [tier, criteria] of Object.entries(this.creditTiers)) {
            if (score >= criteria.min) {
                return tier;
            }
        }
        return 'denied';
    }
    
    async submitLoanApplication(vendorId, requestedAmount, purpose) {
        console.log('📋 Processing loan application:', { vendorId, requestedAmount, purpose });
        
        const creditAssessment = await this.calculateCreditScore(vendorId);
        const applicationId = 'LA_' + this.generateId();
        
        const application = {
            id: applicationId,
            vendorId: vendorId,
            requestedAmount: requestedAmount,
            purpose: purpose,
            creditScore: creditAssessment.score,
            creditTier: creditAssessment.tier,
            maxEligibleAmount: creditAssessment.loanTerms.maxLoan,
            recommendedAmount: Math.min(requestedAmount, creditAssessment.loanTerms.maxLoan),
            interestRate: creditAssessment.loanTerms.interestRate,
            termMonths: creditAssessment.loanTerms.term,
            status: this.determineApplicationStatus(creditAssessment, requestedAmount),
            submittedAt: new Date().toISOString(),
            assessment: creditAssessment
        };
        
        this.loanApplications.set(applicationId, application);
        
        // Auto-approve small loans for excellent credit
        if (application.status === 'approved' && requestedAmount <= 10000 && creditAssessment.tier === 'excellent') {
            await this.approveLoan(applicationId);
        }
        
        return application;
    }
    
    determineApplicationStatus(creditAssessment, requestedAmount) {
        if (creditAssessment.tier === 'denied') return 'denied';
        if (requestedAmount > creditAssessment.loanTerms.maxLoan) return 'needs_review';
        if (creditAssessment.tier === 'excellent' || creditAssessment.tier === 'good') return 'approved';
        return 'under_review';
    }
    
    async approveLoan(applicationId) {
        const application = this.loanApplications.get(applicationId);
        if (!application) throw new Error('Application not found');
        
        const loanId = 'ML_' + this.generateId();
        const loan = {
            id: loanId,
            applicationId: applicationId,
            vendorId: application.vendorId,
            principal: application.recommendedAmount,
            interestRate: application.interestRate,
            termMonths: application.termMonths,
            monthlyPayment: this.calculateMonthlyPayment(
                application.recommendedAmount, 
                application.interestRate, 
                application.termMonths
            ),
            status: 'active',
            disbursedAt: new Date().toISOString(),
            nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            remainingBalance: application.recommendedAmount,
            paymentsRemaining: application.termMonths
        };
        
        this.approvedLoans.set(loanId, loan);
        application.status = 'approved';
        application.loanId = loanId;
        
        return loan;
    }
    
    calculateMonthlyPayment(principal, annualRate, termMonths) {
        const monthlyRate = annualRate / 12;
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
        return Math.round(payment * 100) / 100;
    }
    
    generateCreditInsights(score, tier) {
        const insights = [];
        
        if (tier === 'excellent') {
            insights.push('Outstanding credit profile - eligible for premium loan terms');
            insights.push('Consider expanding business with inventory financing');
        } else if (tier === 'good') {
            insights.push('Strong credit profile with room for improvement');
            insights.push('Focus on increasing transaction frequency for better terms');
        } else if (tier === 'fair') {
            insights.push('Moderate credit risk - work on building consistent sales');
            insights.push('Consider diversifying payment methods to improve score');
        } else if (tier === 'poor') {
            insights.push('High credit risk - focus on building transaction history');
            insights.push('Small loans available to help establish credit');
        } else {
            insights.push('Insufficient credit history - continue building transaction record');
            insights.push('Reapply after 3 months of consistent sales activity');
        }
        
        return insights;
    }
    
    // Helper methods
    getVendorTransactionHistory(vendorId) {
        // Get from storage or generate sample data
        const stored = CashlessVendor.Storage.get('vendorTransactions');
        return stored || this.generateSampleTransactions(vendorId);
    }
    
    getVendorProfile(vendorId) {
        const vendor = CashlessVendor.Storage.get('currentVendor');
        return vendor || {
            created: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
            disputeRate: 0.01,
            chargebackRate: 0.005
        };
    }
    
    generateSampleTransactions(vendorId) {
        // Generate realistic transaction history for demo
        const transactions = [];
        const now = Date.now();
        
        for (let i = 0; i < 50; i++) {
            const daysAgo = Math.floor(Math.random() * 90);
            const amount = 15 + Math.random() * 100;
            
            transactions.push({
                id: 'tx_' + this.generateId(),
                vendorId: vendorId,
                amount: Math.round(amount * 100) / 100,
                timestamp: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: ['qr', 'ussd', 'card'][Math.floor(Math.random() * 3)],
                customerId: 'cust_' + Math.floor(Math.random() * 20)
            });
        }
        
        return transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    // Additional helper methods for calculations
    groupTransactionsByMonth(transactions) {
        const months = {};
        transactions.forEach(t => {
            const month = new Date(t.timestamp).toISOString().substr(0, 7);
            months[month] = (months[month] || 0) + t.amount;
        });
        return Object.values(months);
    }
    
    groupTransactionsByDay(transactions) {
        const days = {};
        transactions.forEach(t => {
            const day = new Date(t.timestamp).toISOString().substr(0, 10);
            days[day] = (days[day] || 0) + 1;
        });
        return Object.values(days);
    }
    
    calculateAccountAge(createdDate) {
        return Math.floor((Date.now() - new Date(createdDate).getTime()) / (24 * 60 * 60 * 1000));
    }
    
    calculateMonthlyRevenues(transactions) {
        const monthly = this.groupTransactionsByMonth(transactions);
        return monthly;
    }
    
    calculateMonthlyVariance(transactions) {
        const monthly = this.groupTransactionsByMonth(transactions);
        if (monthly.length < 2) return 0.5;
        
        const mean = monthly.reduce((sum, val) => sum + val, 0) / monthly.length;
        const variance = monthly.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthly.length;
        return Math.sqrt(variance) / mean; // Coefficient of variation
    }
    
    calculateConfidence(score) {
        // Higher confidence for extreme scores
        const distance = Math.abs(score - 0.5);
        return Math.min(0.95, 0.7 + distance * 0.5);
    }
    
    loadCreditHistory() {
        // Load existing credit data from storage
        const stored = CashlessVendor.Storage.get('creditHistory');
        if (stored) {
            Object.entries(stored).forEach(([vendorId, history]) => {
                this.creditHistory.set(vendorId, history);
            });
        }
    }
    
    saveCreditHistory() {
        // Save credit data to storage
        const historyObj = {};
        this.creditHistory.forEach((history, vendorId) => {
            historyObj[vendorId] = history;
        });
        CashlessVendor.Storage.set('creditHistory', historyObj);
    }
}

// Export for global use
window.AICreditScoring = AICreditScoring;
