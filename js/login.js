// Login functionality

class VendorLogin {
    constructor() {
        this.loginForm = null;
        this.validator = null;
        
        this.init();
    }
    
    init() {
        // Setup auth toggle functionality
        this.setupAuthToggle();
        
        // Setup login form
        this.setupLoginForm();
        
        // Check if user is already logged in
        this.checkExistingSession();
    }
    
    setupAuthToggle() {
        const registerToggle = document.getElementById('register-toggle');
        const loginToggle = document.getElementById('login-toggle');
        const registrationContainer = document.getElementById('registration-container');
        const loginContainer = document.getElementById('login-container');
        
        if (registerToggle && loginToggle) {
            registerToggle.addEventListener('click', () => {
                this.showRegistration();
            });
            
            loginToggle.addEventListener('click', () => {
                this.showLogin();
            });
        }
    }
    
    showRegistration() {
        const registerToggle = document.getElementById('register-toggle');
        const loginToggle = document.getElementById('login-toggle');
        const registrationContainer = document.getElementById('registration-container');
        const loginContainer = document.getElementById('login-container');
        
        // Update toggle buttons
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
        
        // Show/hide containers
        registrationContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    }
    
    showLogin() {
        const registerToggle = document.getElementById('register-toggle');
        const loginToggle = document.getElementById('login-toggle');
        const registrationContainer = document.getElementById('registration-container');
        const loginContainer = document.getElementById('login-container');
        
        // Update toggle buttons
        registerToggle.classList.remove('active');
        loginToggle.classList.add('active');
        
        // Show/hide containers
        registrationContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
    
    setupLoginForm() {
        this.loginForm = document.getElementById('login-form');
        
        if (this.loginForm) {
            // Setup form validation
            this.validator = this.setupLoginValidation();
            
            // Handle form submission
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Handle forgot password
        const forgotPasswordLink = document.getElementById('forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }
    
    setupLoginValidation() {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        const validator = {
            validateEmail: () => {
                const email = emailInput.value.trim();
                const emailError = document.getElementById('login-email-error');
                
                if (!email) {
                    emailError.textContent = 'Email is required';
                    return false;
                }
                
                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailError.textContent = 'Please enter a valid email address';
                    return false;
                }
                
                emailError.textContent = '';
                return true;
            },
            
            validatePassword: () => {
                const password = passwordInput.value;
                const passwordError = document.getElementById('login-password-error');
                
                if (!password) {
                    passwordError.textContent = 'Password is required';
                    return false;
                }
                
                if (password.length < 6) {
                    passwordError.textContent = 'Password must be at least 6 characters';
                    return false;
                }
                
                passwordError.textContent = '';
                return true;
            },
            
            validateAll: () => {
                const emailValid = validator.validateEmail();
                const passwordValid = validator.validatePassword();
                
                return emailValid && passwordValid;
            }
        };
        
        // Add real-time validation
        if (emailInput) {
            emailInput.addEventListener('blur', validator.validateEmail);
            emailInput.addEventListener('input', () => {
                if (emailInput.value.trim()) {
                    validator.validateEmail();
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', validator.validatePassword);
            passwordInput.addEventListener('input', () => {
                if (passwordInput.value) {
                    validator.validatePassword();
                }
            });
        }
        
        return validator;
    }
    
    async handleLogin() {
        if (!this.validator.validateAll()) {
            CashlessVendor.showToast('Please fix the errors in the form', 'error');
            return;
        }
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Show loading state
        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';
        
        try {
            // Simulate login process
            const loginResult = await this.authenticateVendor(email, password);
            
            if (loginResult.success) {
                // Store session
                this.storeSession(loginResult.vendor, rememberMe);
                
                // Show success message
                CashlessVendor.showToast('Welcome back!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    CashlessVendor.navigateTo('dashboard.html');
                }, 1000);
                
            } else {
                CashlessVendor.showToast(loginResult.error || 'Invalid email or password', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            CashlessVendor.showToast('Login failed. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    async authenticateVendor(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if vendor exists in storage
        const registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];
        const vendor = registeredVendors.find(v => v.email === email);
        
        if (!vendor) {
            return {
                success: false,
                error: 'No account found with this email address'
            };
        }
        
        // In a real app, you'd hash and compare passwords
        // For demo purposes, we'll use a simple check
        const storedPassword = vendor.password || 'password123';
        
        if (password !== storedPassword) {
            return {
                success: false,
                error: 'Invalid password'
            };
        }
        
        return {
            success: true,
            vendor: vendor
        };
    }
    
    storeSession(vendor, rememberMe) {
        // Store current vendor
        CashlessVendor.Storage.set('currentVendor', vendor);
        CashlessVendor.Storage.set('vendorRegistered', true);
        
        // Store login session
        const sessionData = {
            vendorId: vendor.vendorId,
            email: vendor.email,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        if (rememberMe) {
            // Store in localStorage for persistent session
            localStorage.setItem('vendorSession', JSON.stringify(sessionData));
        } else {
            // Store in sessionStorage for session-only
            sessionStorage.setItem('vendorSession', JSON.stringify(sessionData));
        }
    }
    
    checkExistingSession() {
        // Check for existing session
        let sessionData = localStorage.getItem('vendorSession');
        if (!sessionData) {
            sessionData = sessionStorage.getItem('vendorSession');
        }
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];
                const vendor = registeredVendors.find(v => v.vendorId === session.vendorId);
                
                if (vendor) {
                    // Auto-login
                    CashlessVendor.Storage.set('currentVendor', vendor);
                    CashlessVendor.Storage.set('vendorRegistered', true);
                    
                    // Redirect to dashboard
                    CashlessVendor.navigateTo('dashboard.html');
                    return;
                }
            } catch (error) {
                console.error('Session check error:', error);
                // Clear invalid session
                localStorage.removeItem('vendorSession');
                sessionStorage.removeItem('vendorSession');
            }
        }
    }
    
    handleForgotPassword() {
        const email = document.getElementById('login-email').value.trim();
        
        if (!email) {
            CashlessVendor.showToast('Please enter your email address first', 'warning');
            document.getElementById('login-email').focus();
            return;
        }
        
        if (!CashlessVendor.isValidEmail(email)) {
            CashlessVendor.showToast('Please enter a valid email address', 'error');
            document.getElementById('login-email').focus();
            return;
        }
        
        // Simulate password reset
        CashlessVendor.showToast('Password reset instructions sent to your email!', 'success');
    }
}

// Update registration to store vendor for login
function updateRegistrationStorage() {
    // Override the existing registration completion
    const originalGoToDashboard = window.goToDashboard;
    
    window.goToDashboard = function() {
        const currentVendor = CashlessVendor.Storage.get('currentVendor');
        
        if (currentVendor) {
            // Store vendor in registered vendors list
            let registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];
            
            // Add password for demo (in real app, this would be hashed)
            currentVendor.password = 'password123';
            
            // Check if vendor already exists
            const existingIndex = registeredVendors.findIndex(v => v.email === currentVendor.email);
            
            if (existingIndex >= 0) {
                // Update existing vendor
                registeredVendors[existingIndex] = currentVendor;
            } else {
                // Add new vendor
                registeredVendors.push(currentVendor);
            }
            
            CashlessVendor.Storage.set('registeredVendors', registeredVendors);
        }
        
        // Call original function
        if (originalGoToDashboard) {
            originalGoToDashboard();
        } else {
            CashlessVendor.navigateTo('dashboard.html');
        }
    };
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session storage
        localStorage.removeItem('vendorSession');
        sessionStorage.removeItem('vendorSession');
        
        // Clear current vendor data
        CashlessVendor.Storage.remove('currentVendor');
        CashlessVendor.Storage.remove('vendorRegistered');
        
        // Show success message
        CashlessVendor.showToast('You have been logged out successfully', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            CashlessVendor.navigateTo('index.html');
        }, 1000);
    }
}

// Initialize login functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('login-form')) {
        new VendorLogin();
        updateRegistrationStorage();
    }
});

// Demo login function
function loginDemo(type) {
    const demoAccounts = {
        maria: {
            id: 'CV-MARIA123',
            vendorId: 'CV-MARIA123',
            phone: '+27 12 345 6789',
            ownerName: 'Maria Santos',
            businessName: 'Maria\'s Fresh Fruits',
            location: 'Corner of Main St & 5th Ave',
            email: 'maria@freshfruits.co.za',
            businessType: 'food',
            description: 'Fresh fruits and vegetables from local farms'
        },
        john: {
            id: 'CV-JOHN456',
            vendorId: 'CV-JOHN456',
            phone: '+27 11 987 6543',
            ownerName: 'John Mthembu',
            businessName: 'John\'s Street Food',
            location: 'Taxi Rank, Johannesburg',
            email: 'john@streetfood.co.za',
            businessType: 'food',
            description: 'Authentic South African street food'
        },
        sarah: {
            id: 'CV-SARAH789',
            vendorId: 'CV-SARAH789',
            phone: '+27 21 555 0123',
            ownerName: 'Sarah Ndlovu',
            businessName: 'Sarah\'s Crafts',
            location: 'V&A Waterfront, Cape Town',
            email: 'sarah@crafts.co.za',
            businessType: 'crafts',
            description: 'Handmade crafts and traditional art'
        }
    };

    const vendor = demoAccounts[type];
    if (vendor) {
        vendor.loginTime = new Date().toISOString();
        vendor.password = 'password123';

        // Store vendor data
        CashlessVendor.Storage.set('currentVendor', vendor);
        CashlessVendor.Storage.set('vendorRegistered', true);

        // Store in registered vendors list
        let registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];
        const existingIndex = registeredVendors.findIndex(v => v.vendorId === vendor.vendorId);

        if (existingIndex >= 0) {
            registeredVendors[existingIndex] = vendor;
        } else {
            registeredVendors.push(vendor);
        }

        CashlessVendor.Storage.set('registeredVendors', registeredVendors);

        // Store session
        const sessionData = {
            vendorId: vendor.vendorId,
            email: vendor.email,
            loginTime: new Date().toISOString(),
            rememberMe: true
        };
        localStorage.setItem('vendorSession', JSON.stringify(sessionData));

        CashlessVendor.showToast(`Welcome back, ${vendor.ownerName}!`, 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
}

// Logout function
function logout() {
    const currentVendor = CashlessVendor.Storage.get('currentVendor');

    if (currentVendor) {
        // Update last logout time
        currentVendor.lastLogoutTime = new Date().toISOString();

        // Update the vendor in registered vendors list
        let registeredVendors = CashlessVendor.Storage.get('registeredVendors') || [];
        const vendorIndex = registeredVendors.findIndex(v => v.vendorId === currentVendor.vendorId);

        if (vendorIndex >= 0) {
            registeredVendors[vendorIndex] = currentVendor;
            CashlessVendor.Storage.set('registeredVendors', registeredVendors);
        }
    }

    // Clear current session
    CashlessVendor.Storage.remove('currentVendor');
    CashlessVendor.Storage.remove('vendorRegistered');
    localStorage.removeItem('vendorSession');
    sessionStorage.removeItem('vendorSession');

    // Show logout message
    CashlessVendor.showToast('You have been logged out. Your account data is saved for next time!', 'success');

    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Export for global use
window.VendorLogin = VendorLogin;
window.logout = logout;
window.loginDemo = loginDemo;
