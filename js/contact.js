// Contact Section Functionality with Web3Forms
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        this.statusMessage = this.form?.querySelector('.form-status');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
            this.setupFormValidation();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.form.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    setupFormValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            'form-subject': {
                required: true,
                minLength: 5,
                maxLength: 100
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000
            }
        };
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }

        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} characters allowed`;
        }

        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        this.updateFieldState(field, isValid, errorMessage);
        return isValid;
    }

    updateFieldState(field, isValid, errorMessage) {
        const errorElement = field.parentElement.querySelector('.error-message');

        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            if (errorElement) errorElement.classList.remove('show');
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) errorElement.classList.remove('show');
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('.form-control');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            this.showStatus('Please fix the errors above', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            const formData = new FormData(this.form);
            
            // Submit to Web3Forms
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
                this.form.querySelectorAll('.form-control').forEach(field => {
                    this.clearFieldError(field);
                });
            } else {
                throw new Error(result.message || 'Form submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Sorry, there was an error sending your message. Please try again or email me directly.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.innerHTML = 'Sending...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `form-status ${type}`;
        this.statusMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Contact Information Interactions
class ContactInfo {
    constructor() {
        this.init();
    }

    init() {
        this.setupEmailCopy();
        this.setupPhoneClick();
    }

    setupEmailCopy() {
        const emailElement = document.querySelector('.contact-email');
        if (emailElement) {
            emailElement.style.cursor = 'pointer';
            emailElement.title = 'Click to copy email';
            
            emailElement.addEventListener('click', () => {
                const email = emailElement.textContent.trim();
                this.copyToClipboard(email);
                this.showCopyFeedback(emailElement, 'Email copied!');
            });
        }
    }

    setupPhoneClick() {
        const phoneElement = document.querySelector('.contact-phone');
        if (phoneElement) {
            phoneElement.style.cursor = 'pointer';
            phoneElement.title = 'Click to copy phone number';
            
            phoneElement.addEventListener('click', () => {
                const phone = phoneElement.textContent.trim();
                this.copyToClipboard(phone);
                this.showCopyFeedback(phoneElement, 'Phone number copied!');
            });
        }
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    showCopyFeedback(element, message) {
        const originalText = element.textContent;
        const originalColor = element.style.color;
        
        element.textContent = message;
        element.style.color = 'var(--accent-color)';

        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = originalColor;
        }, 2000);
    }
}

// Initialize contact section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    new ContactInfo();
});

// Export for use in main.js
window.ContactForm = ContactForm;
window.ContactInfo = ContactInfo;