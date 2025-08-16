// Blockchain Payment System

class BlockchainPayments {
    constructor() {
        this.supportedCurrencies = {
            BTC: { name: 'Bitcoin', symbol: '₿', decimals: 8, rate: 45000 },
            ETH: { name: 'Ethereum', symbol: 'Ξ', decimals: 18, rate: 2800 },
            USDC: { name: 'USD Coin', symbol: 'USDC', decimals: 6, rate: 1 },
            MATIC: { name: 'Polygon', symbol: 'MATIC', decimals: 18, rate: 0.85 }
        };
        
        this.networkFees = {
            BTC: { slow: 0.0001, standard: 0.0003, fast: 0.0008 },
            ETH: { slow: 0.002, standard: 0.005, fast: 0.012 },
            USDC: { slow: 0.5, standard: 1.2, fast: 3.0 },
            MATIC: { slow: 0.001, standard: 0.003, fast: 0.008 }
        };
        
        this.wallets = new Map();
        this.transactions = [];
        this.smartContracts = new Map();
        
        this.init();
    }
    
    init() {
        // Initialize blockchain connection simulation
        this.initializeBlockchain();
        
        // Setup smart contracts
        this.deploySmartContracts();
        
        // Load existing wallets
        this.loadWallets();
    }
    
    initializeBlockchain() {
        // Simulate blockchain network connection
        this.network = {
            connected: true,
            blockHeight: 2847392,
            networkHash: '0x' + this.generateHash(32),
            gasPrice: 20, // Gwei
            lastBlock: new Date().toISOString()
        };
        
        console.log('🔗 Blockchain network connected:', this.network);
    }
    
    deploySmartContracts() {
        // Escrow contract for secure payments
        const escrowContract = {
            address: '0x' + this.generateHash(20),
            abi: this.getEscrowABI(),
            deployed: true,
            version: '1.2.0'
        };
        
        // Payment processor contract
        const paymentContract = {
            address: '0x' + this.generateHash(20),
            abi: this.getPaymentABI(),
            deployed: true,
            version: '1.1.0'
        };
        
        this.smartContracts.set('escrow', escrowContract);
        this.smartContracts.set('payment', paymentContract);
        
        console.log('📜 Smart contracts deployed:', {
            escrow: escrowContract.address,
            payment: paymentContract.address
        });
    }
    
    generateVendorWallet(vendorId) {
        // Generate crypto wallet for vendor
        const wallet = {
            vendorId: vendorId,
            addresses: {},
            privateKeys: {}, // In real app, these would be encrypted
            balances: {},
            created: new Date().toISOString()
        };
        
        // Generate addresses for each supported currency
        Object.keys(this.supportedCurrencies).forEach(currency => {
            wallet.addresses[currency] = this.generateAddress(currency);
            wallet.privateKeys[currency] = this.generatePrivateKey();
            wallet.balances[currency] = 0;
        });
        
        this.wallets.set(vendorId, wallet);
        
        return wallet;
    }
    
    generateAddress(currency) {
        // Simulate address generation for different currencies
        const prefixes = {
            BTC: ['1', '3', 'bc1'],
            ETH: ['0x'],
            USDC: ['0x'],
            MATIC: ['0x']
        };
        
        const prefix = prefixes[currency][0];
        const addressLength = currency === 'BTC' ? 34 : 42;
        
        if (currency === 'BTC') {
            return prefix + this.generateHash(addressLength - prefix.length);
        } else {
            return prefix + this.generateHash(40);
        }
    }
    
    generatePrivateKey() {
        return '0x' + this.generateHash(64);
    }
    
    generateHash(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    async processPayment(paymentData) {
        const {
            vendorId,
            amount,
            currency,
            customerAddress,
            speed = 'standard'
        } = paymentData;
        
        // Get vendor wallet
        const vendorWallet = this.wallets.get(vendorId);
        if (!vendorWallet) {
            throw new Error('Vendor wallet not found');
        }
        
        // Calculate network fee
        const networkFee = this.calculateNetworkFee(currency, speed, amount);
        
        // Create transaction
        const transaction = {
            id: 'tx_' + this.generateHash(16),
            vendorId: vendorId,
            fromAddress: customerAddress,
            toAddress: vendorWallet.addresses[currency],
            amount: amount,
            currency: currency,
            networkFee: networkFee,
            speed: speed,
            status: 'pending',
            confirmations: 0,
            requiredConfirmations: this.getRequiredConfirmations(currency),
            blockHash: null,
            transactionHash: '0x' + this.generateHash(64),
            timestamp: new Date().toISOString(),
            estimatedConfirmation: this.getEstimatedConfirmationTime(currency, speed)
        };
        
        // Add to transactions
        this.transactions.push(transaction);
        
        // Simulate blockchain processing
        await this.simulateBlockchainProcessing(transaction);
        
        return transaction;
    }
    
    async createEscrowPayment(paymentData) {
        const {
            vendorId,
            customerId,
            amount,
            currency,
            deliveryConditions
        } = paymentData;
        
        const escrowContract = this.smartContracts.get('escrow');
        
        // Create escrow transaction
        const escrowTx = {
            id: 'escrow_' + this.generateHash(16),
            contractAddress: escrowContract.address,
            vendorId: vendorId,
            customerId: customerId,
            amount: amount,
            currency: currency,
            status: 'escrowed',
            conditions: deliveryConditions,
            releaseConditions: {
                deliveryConfirmed: false,
                timeoutHours: 24,
                disputeResolution: false
            },
            created: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Simulate smart contract interaction
        await this.interactWithSmartContract('escrow', 'createEscrow', escrowTx);
        
        return escrowTx;
    }
    
    async releaseEscrowPayment(escrowId, releaseReason = 'delivery_confirmed') {
        const escrowTx = this.transactions.find(tx => tx.id === escrowId);
        
        if (!escrowTx || escrowTx.status !== 'escrowed') {
            throw new Error('Escrow transaction not found or already released');
        }
        
        // Update escrow status
        escrowTx.status = 'released';
        escrowTx.releaseReason = releaseReason;
        escrowTx.releasedAt = new Date().toISOString();
        
        // Update vendor balance
        const vendorWallet = this.wallets.get(escrowTx.vendorId);
        if (vendorWallet) {
            vendorWallet.balances[escrowTx.currency] += escrowTx.amount;
        }
        
        // Simulate smart contract interaction
        await this.interactWithSmartContract('escrow', 'releasePayment', {
            escrowId: escrowId,
            reason: releaseReason
        });
        
        return escrowTx;
    }
    
    calculateNetworkFee(currency, speed, amount) {
        const baseFee = this.networkFees[currency][speed];
        
        // For percentage-based fees (like some tokens)
        if (currency === 'USDC') {
            return baseFee; // Fixed fee for stablecoins
        }
        
        // For crypto with dynamic fees
        const dynamicMultiplier = 1 + (Math.random() * 0.5); // Simulate network congestion
        return baseFee * dynamicMultiplier;
    }
    
    getRequiredConfirmations(currency) {
        const confirmations = {
            BTC: 6,
            ETH: 12,
            USDC: 12,
            MATIC: 20
        };
        return confirmations[currency] || 6;
    }
    
    getEstimatedConfirmationTime(currency, speed) {
        const baseTimes = {
            BTC: { slow: 60, standard: 30, fast: 10 },
            ETH: { slow: 5, standard: 2, fast: 1 },
            USDC: { slow: 5, standard: 2, fast: 1 },
            MATIC: { slow: 3, standard: 1, fast: 0.5 }
        };
        
        const baseTime = baseTimes[currency][speed];
        return new Date(Date.now() + baseTime * 60 * 1000).toISOString();
    }
    
    async simulateBlockchainProcessing(transaction) {
        // Simulate network delay
        const delay = transaction.speed === 'fast' ? 1000 : 
                     transaction.speed === 'standard' ? 3000 : 5000;
        
        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.confirmations = 1;
            transaction.blockHash = '0x' + this.generateHash(64);
            
            // Continue confirmation simulation
            this.simulateConfirmations(transaction);
        }, delay);
    }
    
    simulateConfirmations(transaction) {
        const confirmationInterval = setInterval(() => {
            if (transaction.confirmations < transaction.requiredConfirmations) {
                transaction.confirmations++;
                
                // Emit confirmation event
                this.emitTransactionUpdate(transaction);
            } else {
                transaction.status = 'completed';
                clearInterval(confirmationInterval);
                
                // Update vendor balance
                this.updateVendorBalance(transaction);
                
                // Final update
                this.emitTransactionUpdate(transaction);
            }
        }, 2000); // New confirmation every 2 seconds for demo
    }
    
    updateVendorBalance(transaction) {
        const vendorWallet = this.wallets.get(transaction.vendorId);
        if (vendorWallet) {
            const netAmount = transaction.amount - transaction.networkFee;
            vendorWallet.balances[transaction.currency] += netAmount;
        }
    }
    
    emitTransactionUpdate(transaction) {
        // Emit custom event for UI updates
        const event = new CustomEvent('blockchainTransactionUpdate', {
            detail: transaction
        });
        window.dispatchEvent(event);
    }
    
    async interactWithSmartContract(contractName, method, params) {
        const contract = this.smartContracts.get(contractName);
        
        if (!contract) {
            throw new Error(`Smart contract ${contractName} not found`);
        }
        
        // Simulate smart contract interaction
        const gasUsed = Math.floor(Math.random() * 100000) + 21000;
        const gasPrice = this.network.gasPrice;
        
        const contractInteraction = {
            contractAddress: contract.address,
            method: method,
            params: params,
            gasUsed: gasUsed,
            gasPrice: gasPrice,
            transactionHash: '0x' + this.generateHash(64),
            blockNumber: this.network.blockHeight + 1,
            timestamp: new Date().toISOString()
        };
        
        console.log('📜 Smart contract interaction:', contractInteraction);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return contractInteraction;
    }
    
    getVendorWallet(vendorId) {
        return this.wallets.get(vendorId);
    }
    
    getTransactionHistory(vendorId) {
        return this.transactions.filter(tx => tx.vendorId === vendorId);
    }
    
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        
        const fromRate = this.supportedCurrencies[fromCurrency]?.rate || 1;
        const toRate = this.supportedCurrencies[toCurrency]?.rate || 1;
        
        // Convert to USD first, then to target currency
        const usdAmount = amount / fromRate;
        return usdAmount * toRate;
    }
    
    loadWallets() {
        // Load wallets from storage
        const storedWallets = CashlessVendor.Storage.get('blockchainWallets');
        if (storedWallets) {
            Object.entries(storedWallets).forEach(([vendorId, wallet]) => {
                this.wallets.set(vendorId, wallet);
            });
        }
    }
    
    saveWallets() {
        // Save wallets to storage
        const walletsObj = {};
        this.wallets.forEach((wallet, vendorId) => {
            walletsObj[vendorId] = wallet;
        });
        CashlessVendor.Storage.set('blockchainWallets', walletsObj);
    }
    
    getEscrowABI() {
        // Simplified ABI for escrow contract
        return [
            {
                "name": "createEscrow",
                "type": "function",
                "inputs": [
                    {"name": "vendor", "type": "address"},
                    {"name": "amount", "type": "uint256"}
                ]
            },
            {
                "name": "releasePayment",
                "type": "function",
                "inputs": [
                    {"name": "escrowId", "type": "bytes32"}
                ]
            }
        ];
    }
    
    getPaymentABI() {
        // Simplified ABI for payment contract
        return [
            {
                "name": "processPayment",
                "type": "function",
                "inputs": [
                    {"name": "vendor", "type": "address"},
                    {"name": "amount", "type": "uint256"},
                    {"name": "currency", "type": "string"}
                ]
            }
        ];
    }
}

// Export for global use
window.BlockchainPayments = BlockchainPayments;
