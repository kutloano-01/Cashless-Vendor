// Form validation utilities and rules

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.rules = {};
        this.errors = {};
        this.touched = {};
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Add event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.touched[input.name] = true;
                this.validateField(input.name);
            });
            
            input.addEventListener('input', CashlessVendor.debounce(() => {
                if (this.touched[input.name]) {
                    this.validateField(input.name);
                }
            }, 300));
        });
    }
    
    addRule(fieldName, validator, message) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({ validator, message });
    }
    
    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return true;
        
        const value = field.value;
        const rules = this.rules[fieldName] || [];
        
        // Clear previous errors
        delete this.errors[fieldName];
        
        // Run validation rules
        for (const rule of rules) {
            if (!rule.validator(value, field)) {
                this.errors[fieldName] = rule.message;
                break;
            }
        }
        
        // Update UI
        this.updateFieldUI(fieldName);
        
        return !this.errors[fieldName];
    }
    
    validateAll() {
        const fields = Object.keys(this.rules);
        let isValid = true;
        
        fields.forEach(fieldName => {
            this.touched[fieldName] = true;
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateFieldUI(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()}-error`);
        
        if (!field) return;
        
        if (this.errors[fieldName]) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = this.errors[fieldName];
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }
    
    getValues() {
        const formData = new FormData(this.form);
        const values = {};
        
        for (const [key, value] of formData.entries()) {
            values[key] = value;
        }
        
        return values;
    }
    
    setValues(values) {
        Object.keys(values).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = values[key];
            }
        });
    }
    
    reset() {
        this.form.reset();
        this.errors = {};
        this.touched = {};
        
        // Clear all error UI
        Object.keys(this.rules).forEach(fieldName => {
            this.updateFieldUI(fieldName);
        });
    }
    
    isValid() {
        return Object.keys(this.errors).length === 0;
    }
    
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
    
    getErrors() {
        return { ...this.errors };
    }
}

// Common validation rules
const ValidationRules = {
    required: (value) => {
        return value && value.toString().trim().length > 0;
    },
    
    minLength: (min) => (value) => {
        return !value || value.length >= min;
    },
    
    maxLength: (max) => (value) => {
        return !value || value.length <= max;
    },
    
    email: (value) => {
        if (!value) return true;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    },
    
    phone: (value) => {
        if (!value) return true;
        const re = /^\+?[\d\s\-\(\)]+$/;
        return re.test(value) && value.replace(/\D/g, '').length >= 10;
    },
    
    businessName: (value) => {
        if (!value) return true;
        const re = /^[a-zA-Z0-9\s&'-]+$/;
        return re.test(value);
    },
    
    ownerName: (value) => {
        if (!value) return true;
        const re = /^[a-zA-Z\s'-]+$/;
        return re.test(value);
    },
    
    number: (value) => {
        if (!value) return true;
        return !isNaN(value) && isFinite(value);
    },
    
    positiveNumber: (value) => {
        if (!value) return true;
        return !isNaN(value) && isFinite(value) && parseFloat(value) > 0;
    },
    
    currency: (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0.01 && num <= 10000;
    }
};

// Validation messages
const ValidationMessages = {
    required: 'This field is required',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must be less than ${max} characters`,
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    businessName: 'Business name contains invalid characters',
    ownerName: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    number: 'Please enter a valid number',
    positiveNumber: 'Please enter a positive number',
    currency: 'Amount must be between R0.01 and R10,000'
};

// Setup validation for vendor registration form
function setupRegistrationValidation() {
    const validator = new FormValidator('registration-form');
    
    // Business name validation
    validator.addRule('businessName', ValidationRules.required, ValidationMessages.required);
    validator.addRule('businessName', ValidationRules.minLength(2), ValidationMessages.minLength(2));
    validator.addRule('businessName', ValidationRules.maxLength(100), ValidationMessages.maxLength(100));
    validator.addRule('businessName', ValidationRules.businessName, ValidationMessages.businessName);
    
    // Owner name validation
    validator.addRule('ownerName', ValidationRules.required, ValidationMessages.required);
    validator.addRule('ownerName', ValidationRules.minLength(2), ValidationMessages.minLength(2));
    validator.addRule('ownerName', ValidationRules.maxLength(50), ValidationMessages.maxLength(50));
    validator.addRule('ownerName', ValidationRules.ownerName, ValidationMessages.ownerName);
    
    // Business type validation
    validator.addRule('businessType', ValidationRules.required, ValidationMessages.required);
    
    // Phone validation
    validator.addRule('phone', ValidationRules.required, ValidationMessages.required);
    validator.addRule('phone', ValidationRules.phone, ValidationMessages.phone);
    
    // Location validation
    validator.addRule('location', ValidationRules.required, ValidationMessages.required);
    validator.addRule('location', ValidationRules.minLength(5), ValidationMessages.minLength(5));
    
    // Terms validation
    validator.addRule('terms', (value) => value === 'on', 'You must agree to the terms and conditions');
    
    return validator;
}

// Setup validation for payment form
function setupPaymentValidation() {
    const validator = new FormValidator('payment-form');
    
    // Amount validation
    validator.addRule('amount', ValidationRules.required, ValidationMessages.required);
    validator.addRule('amount', ValidationRules.currency, ValidationMessages.currency);
    
    // Payment method validation
    validator.addRule('paymentMethod', ValidationRules.required, 'Please select a payment method');
    
    return validator;
}

// Setup validation for withdrawal form
function setupWithdrawalValidation() {
    const validator = new FormValidator('withdrawal-form');
    
    // Amount validation
    validator.addRule('amount', ValidationRules.required, ValidationMessages.required);
    validator.addRule('amount', ValidationRules.positiveNumber, ValidationMessages.positiveNumber);
    validator.addRule('amount', (value) => {
        const num = parseFloat(value);
        return num >= 1 && num <= 50000;
    }, 'Withdrawal amount must be between R1 and R50,000');
    
    return validator;
}

// Setup validation for bank account form
function setupBankAccountValidation() {
    const validator = new FormValidator('bank-account-form');
    
    // Account number validation
    validator.addRule('accountNumber', ValidationRules.required, ValidationMessages.required);
    validator.addRule('accountNumber', (value) => {
        return /^\d{8,17}$/.test(value);
    }, 'Account number must be 8-17 digits');
    
    // Routing number validation
    validator.addRule('routingNumber', ValidationRules.required, ValidationMessages.required);
    validator.addRule('routingNumber', (value) => {
        return /^\d{9}$/.test(value);
    }, 'Routing number must be 9 digits');
    
    // Account holder name validation
    validator.addRule('accountHolderName', ValidationRules.required, ValidationMessages.required);
    validator.addRule('accountHolderName', ValidationRules.minLength(2), ValidationMessages.minLength(2));
    validator.addRule('accountHolderName', ValidationRules.ownerName, ValidationMessages.ownerName);
    
    // Bank name validation
    validator.addRule('bankName', ValidationRules.required, ValidationMessages.required);
    validator.addRule('bankName', ValidationRules.minLength(2), ValidationMessages.minLength(2));
    
    return validator;
}

// Export for global use
window.FormValidator = FormValidator;
window.ValidationRules = ValidationRules;
window.ValidationMessages = ValidationMessages;
window.setupRegistrationValidation = setupRegistrationValidation;
window.setupPaymentValidation = setupPaymentValidation;
window.setupWithdrawalValidation = setupWithdrawalValidation;
window.setupBankAccountValidation = setupBankAccountValidation;
