// AI-Powered Fraud Detection System

class AIFraudDetection {
    constructor() {
        this.riskFactors = {
            unusualAmount: 0.3,
            rapidTransactions: 0.4,
            newLocation: 0.2,
            timeOfDay: 0.1,
            deviceFingerprint: 0.3,
            behaviorPattern: 0.4
        };
        
        this.riskThresholds = {
            low: 0.3,
            medium: 0.6,
            high: 0.8
        };
        
        this.transactionHistory = [];
        this.vendorProfiles = new Map();
        
        this.init();
    }
    
    init() {
        // Load historical data for ML training simulation
        this.loadHistoricalData();
        
        // Initialize ML models (simulated)
        this.initializeModels();
    }
    
    loadHistoricalData() {
        // Simulate loading transaction history for pattern analysis
        const sampleHistory = [
            { amount: 25.50, time: '14:30', location: 'downtown', risk: 0.1 },
            { amount: 15.75, time: '12:15', location: 'downtown', risk: 0.05 },
            { amount: 500.00, time: '03:45', location: 'unknown', risk: 0.9 },
            { amount: 42.00, time: '16:20', location: 'downtown', risk: 0.15 }
        ];
        
        this.transactionHistory = sampleHistory;
    }
    
    initializeModels() {
        // Simulate ML model initialization
        this.models = {
            anomalyDetection: {
                trained: true,
                accuracy: 0.94,
                lastUpdated: new Date().toISOString()
            },
            behaviorAnalysis: {
                trained: true,
                accuracy: 0.89,
                lastUpdated: new Date().toISOString()
            },
            riskScoring: {
                trained: true,
                accuracy: 0.92,
                lastUpdated: new Date().toISOString()
            }
        };
    }
    
    analyzeTransaction(transactionData) {
        const {
            amount,
            vendorId,
            customerLocation,
            timestamp,
            deviceInfo,
            paymentMethod
        } = transactionData;
        
        // Calculate individual risk scores
        const amountRisk = this.calculateAmountRisk(amount, vendorId);
        const locationRisk = this.calculateLocationRisk(customerLocation, vendorId);
        const timeRisk = this.calculateTimeRisk(timestamp);
        const velocityRisk = this.calculateVelocityRisk(vendorId, timestamp);
        const deviceRisk = this.calculateDeviceRisk(deviceInfo);
        const behaviorRisk = this.calculateBehaviorRisk(transactionData);
        
        // Weighted risk calculation (simulated ML model)
        const overallRisk = (
            amountRisk * this.riskFactors.unusualAmount +
            locationRisk * this.riskFactors.newLocation +
            timeRisk * this.riskFactors.timeOfDay +
            velocityRisk * this.riskFactors.rapidTransactions +
            deviceRisk * this.riskFactors.deviceFingerprint +
            behaviorRisk * this.riskFactors.behaviorPattern
        );
        
        const riskLevel = this.getRiskLevel(overallRisk);
        const recommendation = this.getRecommendation(riskLevel, overallRisk);
        
        return {
            riskScore: Math.round(overallRisk * 100) / 100,
            riskLevel: riskLevel,
            recommendation: recommendation,
            factors: {
                amount: amountRisk,
                location: locationRisk,
                time: timeRisk,
                velocity: velocityRisk,
                device: deviceRisk,
                behavior: behaviorRisk
            },
            confidence: this.calculateConfidence(overallRisk),
            timestamp: new Date().toISOString()
        };
    }
    
    calculateAmountRisk(amount, vendorId) {
        // Get vendor's typical transaction amounts
        const profile = this.getVendorProfile(vendorId);
        const avgAmount = profile.averageTransaction || 50;
        const stdDev = profile.transactionStdDev || 25;
        
        // Calculate z-score for amount anomaly
        const zScore = Math.abs((amount - avgAmount) / stdDev);
        
        // Convert to risk score (0-1)
        return Math.min(zScore / 3, 1); // Cap at 1.0
    }
    
    calculateLocationRisk(location, vendorId) {
        const profile = this.getVendorProfile(vendorId);
        const knownLocations = profile.commonLocations || ['downtown', 'city center'];
        
        // Simple location risk based on known patterns
        if (knownLocations.includes(location)) {
            return 0.1; // Low risk for known locations
        } else if (location === 'unknown' || !location) {
            return 0.8; // High risk for unknown locations
        } else {
            return 0.4; // Medium risk for new but identifiable locations
        }
    }
    
    calculateTimeRisk(timestamp) {
        const hour = new Date(timestamp).getHours();
        
        // Higher risk for unusual hours (late night/early morning)
        if (hour >= 2 && hour <= 6) {
            return 0.7; // High risk
        } else if (hour >= 22 || hour <= 1) {
            return 0.4; // Medium risk
        } else {
            return 0.1; // Low risk for normal business hours
        }
    }
    
    calculateVelocityRisk(vendorId, timestamp) {
        // Check for rapid successive transactions
        const recentTransactions = this.getRecentTransactions(vendorId, 300000); // 5 minutes
        
        if (recentTransactions.length >= 5) {
            return 0.9; // Very high risk
        } else if (recentTransactions.length >= 3) {
            return 0.6; // High risk
        } else if (recentTransactions.length >= 2) {
            return 0.3; // Medium risk
        } else {
            return 0.1; // Low risk
        }
    }
    
    calculateDeviceRisk(deviceInfo) {
        // Simulate device fingerprinting risk analysis
        if (!deviceInfo || !deviceInfo.userAgent) {
            return 0.6; // Medium-high risk for missing device info
        }
        
        // Check for suspicious device characteristics
        const suspiciousPatterns = [
            'headless', 'phantom', 'selenium', 'bot', 'crawler'
        ];
        
        const deviceString = deviceInfo.userAgent.toLowerCase();
        const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
            deviceString.includes(pattern)
        );
        
        return hasSuspiciousPattern ? 0.8 : 0.1;
    }
    
    calculateBehaviorRisk(transactionData) {
        // Simulate behavioral analysis
        const { paymentMethod, amount } = transactionData;
        
        // Simple behavioral risk factors
        let behaviorRisk = 0.1;
        
        // Higher risk for certain payment methods with high amounts
        if (paymentMethod === 'crypto' && amount > 1000) {
            behaviorRisk += 0.3;
        }
        
        // Add randomness to simulate ML model uncertainty
        behaviorRisk += (Math.random() - 0.5) * 0.2;
        
        return Math.max(0, Math.min(1, behaviorRisk));
    }
    
    getRiskLevel(riskScore) {
        if (riskScore >= this.riskThresholds.high) {
            return 'HIGH';
        } else if (riskScore >= this.riskThresholds.medium) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }
    
    getRecommendation(riskLevel, riskScore) {
        switch (riskLevel) {
            case 'HIGH':
                return {
                    action: 'BLOCK',
                    message: 'Transaction blocked due to high fraud risk',
                    requiresReview: true,
                    additionalAuth: true
                };
            case 'MEDIUM':
                return {
                    action: 'REVIEW',
                    message: 'Additional verification required',
                    requiresReview: true,
                    additionalAuth: true
                };
            case 'LOW':
                return {
                    action: 'APPROVE',
                    message: 'Transaction approved',
                    requiresReview: false,
                    additionalAuth: false
                };
            default:
                return {
                    action: 'REVIEW',
                    message: 'Unable to assess risk',
                    requiresReview: true,
                    additionalAuth: true
                };
        }
    }
    
    calculateConfidence(riskScore) {
        // Simulate ML model confidence based on risk score
        const baseConfidence = 0.85;
        const variability = Math.abs(riskScore - 0.5) * 0.2; // Higher confidence for extreme scores
        return Math.min(0.99, baseConfidence + variability);
    }
    
    getVendorProfile(vendorId) {
        if (!this.vendorProfiles.has(vendorId)) {
            // Create default profile for new vendor
            this.vendorProfiles.set(vendorId, {
                averageTransaction: 45.50,
                transactionStdDev: 28.75,
                commonLocations: ['downtown', 'city center'],
                peakHours: [12, 13, 17, 18],
                riskHistory: []
            });
        }
        return this.vendorProfiles.get(vendorId);
    }
    
    getRecentTransactions(vendorId, timeWindowMs) {
        const now = Date.now();
        return this.transactionHistory.filter(tx => 
            tx.vendorId === vendorId && 
            (now - new Date(tx.timestamp).getTime()) <= timeWindowMs
        );
    }
    
    updateVendorProfile(vendorId, transactionData) {
        const profile = this.getVendorProfile(vendorId);
        
        // Update running averages (simplified)
        const currentAvg = profile.averageTransaction;
        const newAvg = (currentAvg * 0.9) + (transactionData.amount * 0.1);
        profile.averageTransaction = newAvg;
        
        // Add to risk history
        profile.riskHistory.push({
            timestamp: transactionData.timestamp,
            riskScore: transactionData.riskScore || 0.1
        });
        
        // Keep only recent history (last 100 transactions)
        if (profile.riskHistory.length > 100) {
            profile.riskHistory = profile.riskHistory.slice(-100);
        }
    }
    
    generateInsights(vendorId) {
        const profile = this.getVendorProfile(vendorId);
        const recentRisks = profile.riskHistory.slice(-20);
        
        const avgRisk = recentRisks.reduce((sum, r) => sum + r.riskScore, 0) / recentRisks.length;
        const riskTrend = this.calculateRiskTrend(recentRisks);
        
        return {
            averageRiskScore: Math.round(avgRisk * 100) / 100,
            riskTrend: riskTrend,
            recommendations: this.generateSecurityRecommendations(avgRisk, riskTrend),
            modelAccuracy: this.models.riskScoring.accuracy,
            lastUpdated: new Date().toISOString()
        };
    }
    
    calculateRiskTrend(riskHistory) {
        if (riskHistory.length < 2) return 'STABLE';
        
        const recent = riskHistory.slice(-5);
        const older = riskHistory.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, r) => sum + r.riskScore, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.riskScore, 0) / older.length;
        
        const difference = recentAvg - olderAvg;
        
        if (difference > 0.1) return 'INCREASING';
        if (difference < -0.1) return 'DECREASING';
        return 'STABLE';
    }
    
    generateSecurityRecommendations(avgRisk, riskTrend) {
        const recommendations = [];
        
        if (avgRisk > 0.5) {
            recommendations.push('Consider implementing additional authentication steps');
        }
        
        if (riskTrend === 'INCREASING') {
            recommendations.push('Monitor transactions more closely - risk trend is increasing');
        }
        
        if (avgRisk < 0.2) {
            recommendations.push('Your transaction security is excellent');
        }
        
        return recommendations;
    }
}

// Export for global use
window.AIFraudDetection = AIFraudDetection;
