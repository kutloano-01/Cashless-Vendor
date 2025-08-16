// System Monitoring Integration for CashlessVendor

class SystemMonitoring {
    constructor() {
        this.metrics = {
            payments: { count: 0, totalAmount: 0, errors: 0 },
            creditScoring: { assessments: 0, approvals: 0, accuracy: 0.89 },
            fraudDetection: { analyzed: 0, blocked: 0, accuracy: 0.94 },
            voiceCommands: { executed: 0, recognized: 0, accuracy: 0.92 },
            blockchain: { transactions: 0, confirmations: 0, avgTime: 0 },
            system: { uptime: Date.now(), errors: [], alerts: [] }
        };
        
        this.performanceData = {
            responseTime: [],
            throughput: [],
            errorRate: [],
            cpuUsage: [],
            memoryUsage: []
        };
        
        this.init();
    }
    
    init() {
        // Start monitoring
        this.startMetricsCollection();
        
        // Setup performance tracking
        this.setupPerformanceTracking();
        
        // Initialize health checks
        this.startHealthChecks();
        
        console.log('📊 System monitoring initialized');
    }
    
    startMetricsCollection() {
        // Collect metrics every 30 seconds
        setInterval(() => {
            this.collectSystemMetrics();
            this.updatePerformanceData();
            this.checkSystemHealth();
        }, 30000);
        
        // Real-time updates every 5 seconds
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 5000);
    }
    
    setupPerformanceTracking() {
        // Track page load times
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.recordMetric('pageLoad', loadTime);
        });
        
        // Track API response times
        this.interceptFetch();
        
        // Track user interactions
        this.trackUserInteractions();
    }
    
    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const responseTime = endTime - startTime;
                
                this.recordMetric('apiResponse', responseTime);
                this.metrics.system.errors = this.metrics.system.errors.filter(e => 
                    Date.now() - e.timestamp < 300000 // Keep errors for 5 minutes
                );
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                this.recordError('API Error', error.message, args[0]);
                throw error;
            }
        };
    }
    
    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, .btn, .action-card')) {
                this.recordMetric('userInteraction', 1);
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            this.recordMetric('formSubmission', 1);
        });
        
        // Track voice command usage
        window.addEventListener('voiceCommandExecuted', (event) => {
            this.metrics.voiceCommands.executed++;
            this.metrics.voiceCommands.recognized++;
        });
    }
    
    recordPayment(amount, method, success = true) {
        this.metrics.payments.count++;
        this.metrics.payments.totalAmount += amount;
        
        if (!success) {
            this.metrics.payments.errors++;
            this.recordError('Payment Failed', `Payment of R${amount} failed`, method);
        }
        
        this.recordMetric('payment', { amount, method, success });
    }
    
    recordCreditAssessment(vendorId, score, approved) {
        this.metrics.creditScoring.assessments++;
        if (approved) {
            this.metrics.creditScoring.approvals++;
        }
        
        this.recordMetric('creditAssessment', { vendorId, score, approved });
    }
    
    recordFraudAnalysis(riskScore, blocked) {
        this.metrics.fraudDetection.analyzed++;
        if (blocked) {
            this.metrics.fraudDetection.blocked++;
        }
        
        this.recordMetric('fraudAnalysis', { riskScore, blocked });
    }
    
    recordBlockchainTransaction(currency, amount, confirmationTime) {
        this.metrics.blockchain.transactions++;
        this.metrics.blockchain.confirmations++;
        
        // Update average confirmation time
        const currentAvg = this.metrics.blockchain.avgTime;
        const count = this.metrics.blockchain.confirmations;
        this.metrics.blockchain.avgTime = ((currentAvg * (count - 1)) + confirmationTime) / count;
        
        this.recordMetric('blockchainTransaction', { currency, amount, confirmationTime });
    }
    
    recordError(type, message, context = null) {
        const error = {
            type,
            message,
            context,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.metrics.system.errors.push(error);
        
        // Log to console for debugging
        console.error(`🚨 ${type}:`, message, context);
        
        // Check if this triggers an alert
        this.checkErrorThresholds();
    }
    
    recordMetric(type, value) {
        const metric = {
            type,
            value,
            timestamp: Date.now()
        };
        
        // Store in performance data
        if (!this.performanceData[type]) {
            this.performanceData[type] = [];
        }
        
        this.performanceData[type].push(metric);
        
        // Keep only last 1000 metrics per type
        if (this.performanceData[type].length > 1000) {
            this.performanceData[type] = this.performanceData[type].slice(-1000);
        }
    }
    
    collectSystemMetrics() {
        // Simulate system resource usage
        const cpuUsage = 20 + Math.random() * 30; // 20-50% CPU
        const memoryUsage = 40 + Math.random() * 20; // 40-60% Memory
        
        this.recordMetric('cpuUsage', cpuUsage);
        this.recordMetric('memoryUsage', memoryUsage);
        
        // Calculate throughput
        const recentPayments = this.getRecentMetrics('payment', 60000); // Last minute
        const throughput = recentPayments.length;
        this.recordMetric('throughput', throughput);
        
        // Calculate error rate
        const recentErrors = this.metrics.system.errors.filter(e => 
            Date.now() - e.timestamp < 60000
        );
        const errorRate = (recentErrors.length / Math.max(1, throughput)) * 100;
        this.recordMetric('errorRate', errorRate);
    }
    
    updatePerformanceData() {
        // Update response time averages
        const recentResponses = this.getRecentMetrics('apiResponse', 300000); // Last 5 minutes
        if (recentResponses.length > 0) {
            const avgResponseTime = recentResponses.reduce((sum, r) => sum + r.value, 0) / recentResponses.length;
            this.recordMetric('avgResponseTime', avgResponseTime);
        }
    }
    
    updateRealTimeMetrics() {
        // Simulate real-time metric updates for demo
        const now = Date.now();
        
        // Add some realistic variance to metrics
        this.recordMetric('realTimePayments', 45 + Math.floor(Math.random() * 20));
        this.recordMetric('realTimeCreditScoring', 25 + Math.floor(Math.random() * 15));
        this.recordMetric('realTimeFraudDetection', 100 + Math.floor(Math.random() * 50));
    }
    
    checkSystemHealth() {
        const health = {
            overall: 'healthy',
            services: {
                payments: this.checkServiceHealth('payments'),
                creditScoring: this.checkServiceHealth('creditScoring'),
                fraudDetection: this.checkServiceHealth('fraudDetection'),
                blockchain: this.checkServiceHealth('blockchain'),
                voiceCommands: this.checkServiceHealth('voiceCommands')
            },
            alerts: []
        };
        
        // Check for system-wide issues
        const errorRate = this.getRecentMetrics('errorRate', 300000);
        const avgErrorRate = errorRate.length > 0 ? 
            errorRate.reduce((sum, r) => sum + r.value, 0) / errorRate.length : 0;
        
        if (avgErrorRate > 5) {
            health.overall = 'warning';
            health.alerts.push({
                type: 'warning',
                message: `High error rate: ${avgErrorRate.toFixed(1)}%`,
                timestamp: Date.now()
            });
        }
        
        // Update system health
        this.systemHealth = health;
        
        // Emit health update event
        window.dispatchEvent(new CustomEvent('systemHealthUpdate', { detail: health }));
    }
    
    checkServiceHealth(service) {
        const recentErrors = this.metrics.system.errors.filter(e => 
            e.type.toLowerCase().includes(service.toLowerCase()) &&
            Date.now() - e.timestamp < 300000 // Last 5 minutes
        );
        
        if (recentErrors.length > 5) return 'critical';
        if (recentErrors.length > 2) return 'warning';
        return 'healthy';
    }
    
    checkErrorThresholds() {
        const recentErrors = this.metrics.system.errors.filter(e => 
            Date.now() - e.timestamp < 300000 // Last 5 minutes
        );
        
        if (recentErrors.length > 10) {
            this.createAlert('critical', 'High error rate detected', 'system');
        } else if (recentErrors.length > 5) {
            this.createAlert('warning', 'Elevated error rate', 'system');
        }
    }
    
    createAlert(level, message, service) {
        const alert = {
            id: 'alert_' + Date.now(),
            level,
            message,
            service,
            timestamp: Date.now(),
            acknowledged: false
        };
        
        this.metrics.system.alerts.push(alert);
        
        // Show user notification for critical alerts
        if (level === 'critical' && typeof CashlessVendor !== 'undefined') {
            CashlessVendor.showToast(`🚨 ${message}`, 'error');
        }
        
        console.warn(`🚨 Alert [${level.toUpperCase()}]: ${message}`);
    }
    
    getRecentMetrics(type, timeWindow) {
        if (!this.performanceData[type]) return [];
        
        const cutoff = Date.now() - timeWindow;
        return this.performanceData[type].filter(m => m.timestamp > cutoff);
    }
    
    getSystemStats() {
        const uptime = Date.now() - this.metrics.system.uptime;
        const uptimeHours = uptime / (1000 * 60 * 60);
        
        return {
            uptime: uptimeHours,
            totalPayments: this.metrics.payments.count,
            totalAmount: this.metrics.payments.totalAmount,
            creditAssessments: this.metrics.creditScoring.assessments,
            fraudAnalyses: this.metrics.fraudDetection.analyzed,
            voiceCommands: this.metrics.voiceCommands.executed,
            blockchainTxns: this.metrics.blockchain.transactions,
            errorCount: this.metrics.system.errors.length,
            alertCount: this.metrics.system.alerts.filter(a => !a.acknowledged).length
        };
    }
    
    getPerformanceMetrics() {
        const recentResponses = this.getRecentMetrics('apiResponse', 300000);
        const recentThroughput = this.getRecentMetrics('throughput', 300000);
        const recentErrors = this.getRecentMetrics('errorRate', 300000);
        
        return {
            avgResponseTime: recentResponses.length > 0 ? 
                recentResponses.reduce((sum, r) => sum + r.value, 0) / recentResponses.length : 0,
            currentThroughput: recentThroughput.length > 0 ? 
                recentThroughput[recentThroughput.length - 1].value : 0,
            errorRate: recentErrors.length > 0 ? 
                recentErrors[recentErrors.length - 1].value : 0,
            p95ResponseTime: this.calculatePercentile(recentResponses.map(r => r.value), 95),
            p99ResponseTime: this.calculatePercentile(recentResponses.map(r => r.value), 99)
        };
    }
    
    calculatePercentile(values, percentile) {
        if (values.length === 0) return 0;
        
        const sorted = values.sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }
    
    startHealthChecks() {
        // Perform health checks every minute
        setInterval(() => {
            this.performHealthCheck();
        }, 60000);
    }
    
    performHealthCheck() {
        // Check if core services are responding
        const services = ['payments', 'creditScoring', 'fraudDetection', 'blockchain'];
        
        services.forEach(service => {
            // Simulate service health check
            const isHealthy = Math.random() > 0.05; // 95% uptime simulation
            
            if (!isHealthy) {
                this.recordError('Service Health Check', `${service} service not responding`, service);
            }
        });
    }
    
    exportMetrics() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            performance: this.getPerformanceMetrics(),
            systemStats: this.getSystemStats(),
            health: this.systemHealth
        };
    }
}

// Initialize monitoring when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window !== 'undefined') {
        window.systemMonitoring = new SystemMonitoring();
        
        // Integrate with existing systems
        if (typeof CashlessVendor !== 'undefined') {
            // Hook into payment processing
            const originalShowToast = CashlessVendor.showToast;
            CashlessVendor.showToast = function(message, type) {
                window.systemMonitoring.recordMetric('notification', { message, type });
                return originalShowToast.call(this, message, type);
            };
        }
    }
});

// Export for global use
window.SystemMonitoring = SystemMonitoring;
