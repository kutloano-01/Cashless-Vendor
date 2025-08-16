// Vendor registration functionality

class VendorRegistration {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.validator = null;
        this.formData = {};
        
        this.init();
    }
    
    init() {
        // Setup form validation
        this.validator = setupRegistrationValidation();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.updateStepUI();
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitRegistration();
            });
        }
        
        // Form field changes to update button states
        const form = document.getElementById('registration-form');
        if (form) {
            form.addEventListener('input', () => {
                this.updateNavigationButtons();
            });
            
            form.addEventListener('change', () => {
                this.updateNavigationButtons();
            });
        }
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepUI();
                this.updateNavigationButtons();
                this.updateStepIndicator();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepUI();
            this.updateNavigationButtons();
            this.updateStepIndicator();
        }
    }
    
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;
        
        const fields = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            this.validator.touched[field.name] = true;
            if (!this.validator.validateField(field.name)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return;
        
        const fields = currentStepElement.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                this.formData[field.name] = field.checked;
            } else {
                this.formData[field.name] = field.value;
            }
        });
    }
    
    updateStepUI() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // Previous button
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
            nextBtn.disabled = !this.isCurrentStepValid();
        }
        
        // Submit button
        if (submitBtn) {
            submitBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
            submitBtn.disabled = !this.isCurrentStepValid();
        }
    }
    
    updateStepIndicator() {
        // Update step indicator text
        const stepIndicator = document.getElementById('current-step');
        if (stepIndicator) {
            stepIndicator.textContent = this.currentStep;
        }
        
        // Update step circles
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }
    
    isCurrentStepValid() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        
        for (const field of requiredFields) {
            if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                return false;
            }
            
            // Check for validation errors
            if (this.validator.errors[field.name]) {
                return false;
            }
        }
        
        return true;
    }
    
    async submitRegistration() {
        // Save final step data
        this.saveCurrentStepData();
        
        // Validate all steps
        if (!this.validator.validateAll()) {
            CashlessVendor.showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Registering...';
        
        try {
            // Simulate API call
            await this.processRegistration();
            
            // Generate vendor ID
            const vendorId = CashlessVendor.generateVendorId();
            
            // Save vendor data
            const vendorData = {
                ...this.formData,
                vendorId: vendorId,
                registrationDate: new Date().toISOString(),
                status: 'pending_verification',
                ussdCode: CashlessVendor.generateUSSDCode(vendorId)
            };
            
            CashlessVendor.Storage.set('currentVendor', vendorData);
            CashlessVendor.Storage.set('vendorRegistered', true);

            // Store vendor in registered vendors list for future logins
            let registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];

            // Add authentication details for demo (in real app, password would be hashed)
            vendorData.password = 'password123';
            vendorData.email = `${vendorData.ownerName.toLowerCase().replace(/\s+/g, '.')}@${vendorData.businessName.toLowerCase().replace(/\s+/g, '')}.co.za`;

            // Check if vendor already exists
            const existingIndex = registeredVendors.findIndex(v => v.vendorId === vendorData.vendorId);

            if (existingIndex >= 0) {
                // Update existing vendor
                registeredVendors[existingIndex] = vendorData;
            } else {
                // Add new vendor
                registeredVendors.push(vendorData);
            }

            CashlessVendor.Storage.set('registeredVendors', registeredVendors);

            // Create persistent session
            const sessionData = {
                vendorId: vendorData.vendorId,
                email: vendorData.email,
                loginTime: new Date().toISOString(),
                rememberMe: true
            };
            localStorage.setItem('vendorSession', JSON.stringify(sessionData));

            // Show success modal
            this.showSuccessModal(vendorData);
            
        } catch (error) {
            console.error('Registration error:', error);
            CashlessVendor.showToast('Registration failed. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    async processRegistration() {
        // Simulate API processing time
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }
    
    showSuccessModal(vendorData) {
        const modal = document.getElementById('success-modal');
        const nameElement = document.getElementById('success-name');
        const vendorIdElement = document.getElementById('vendor-id');
        
        if (nameElement) {
            nameElement.textContent = vendorData.ownerName;
        }
        
        if (vendorIdElement) {
            vendorIdElement.textContent = vendorData.vendorId;
        }
        
        CashlessVendor.showModal('success-modal');
        
        // Auto-redirect after 10 seconds
        setTimeout(() => {
            CashlessVendor.goToDashboard();
        }, 10000);
    }
}

// Initialize registration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the registration page
    if (document.getElementById('registration-form')) {
        new VendorRegistration();
    }
    
    // Add some demo data for testing (remove in production)
    if (window.location.search.includes('demo=true')) {
        setTimeout(() => {
            const form = document.getElementById('registration-form');
            if (form) {
                form.querySelector('[name="businessName"]').value = "Maria's Fresh Fruits";
                form.querySelector('[name="ownerName"]').value = "Maria Santos";
                form.querySelector('[name="businessType"]').value = "food";
                form.querySelector('[name="description"]').value = "Fresh fruits and vegetables from local farms";
                form.querySelector('[name="phone"]').value = "+27 12 345 6789";
                form.querySelector('[name="location"]').value = "Corner of Main St & 5th Ave";
                form.querySelector('[name="operatingHours"]').value = "Mon-Fri 8AM-6PM";
            }
        }, 500);
    }
});

// Export for global use
window.VendorRegistration = VendorRegistration;
