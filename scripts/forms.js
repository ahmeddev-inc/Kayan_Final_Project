/**
 * Forms Handling - Kayan HVAC Website
 * Handles form validation, submission, and user interactions
 */

class KayanForms {
    constructor() {
        this.forms = [];
        this.init();
    }
    
    init() {
        console.log('📝 Kayan Forms initialized');
        
        this.setupFormListeners();
        this.setupPhoneFormatting();
        this.setupServiceSelection();
        this.setupQuoteCalculator();
        this.setupFormAnalytics();
    }
    
    setupFormListeners() {
        // Get all forms with data-validate attribute
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            this.forms.push(form);
            
            // Add submit event listener
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                } else {
                    this.handleFormSubmission(form);
                }
            });
            
            // Add real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }
    
    setupPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            // Format on input
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                // Keep only numbers
                e.target.value = this.formatPhoneNumber(value);
            });
            
            // Validate on blur
            input.addEventListener('blur', () => {
                const value = input.value.replace(/\D/g, '');
                
                // Check if it's a valid Egyptian mobile number
                if (value && !this.isValidEgyptianPhone(value)) {
                    this.showFieldError(input, 'رقم هاتف غير صحيح. يجب أن يبدأ بـ 01');
                }
            });
        });
    }
    
    formatPhoneNumber(phone) {
        if (!phone) return '';
        
        // Remove leading 0 if present
        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        
        // Format based on length
        if (phone.length <= 2) {
            return phone;
        } else if (phone.length <= 5) {
            return phone.substring(0, 2) + ' ' + phone.substring(2);
        } else if (phone.length <= 9) {
            return phone.substring(0, 2) + ' ' + phone.substring(2, 5) + ' ' + phone.substring(5);
        } else {
            return phone.substring(0, 2) + ' ' + phone.substring(2, 6) + ' ' + phone.substring(6, 10);
        }
    }
    
    isValidEgyptianPhone(phone) {
        // Check if it's a valid Egyptian mobile number (01[0,1,2,5]XXXXXXXX)
        const regex = /^01[0125][0-9]{8}$/;
        return regex.test(phone);
    }
    
    setupServiceSelection() {
        const serviceSelects = document.querySelectorAll('select[name="service"]');
        
        serviceSelects.forEach(select => {
            // Pre-select based on page or URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const serviceParam = urlParams.get('service');
            
            if (serviceParam) {
                const option = Array.from(select.options).find(opt => 
                    opt.value === serviceParam || 
                    opt.text.includes(serviceParam)
                );
                
                if (option) {
                    option.selected = true;
                    
                    // Trigger change event
                    select.dispatchEvent(new Event('change'));
                }
            }
            
            // Show/hide fields based on service selection
            select.addEventListener('change', (e) => {
                this.handleServiceChange(e.target.value);
            });
        });
    }
    
    handleServiceChange(service) {
        // Show/hide additional fields based on service
        const areaField = document.getElementById('area');
        const sizeField = document.getElementById('property_size');
        const budgetField = document.getElementById('budget');
        
        if (service === 'central-ac') {
            if (areaField) areaField.required = true;
            if (sizeField) sizeField.style.display = 'block';
        } else if (service === 'industrial') {
            if (budgetField) budgetField.style.display = 'block';
        }
    }
    
    setupQuoteCalculator() {
        const calculator = document.getElementById('quoteCalculator');
        if (!calculator) return;
        
        const areaInput = calculator.querySelector('input[name="area"]');
        const serviceSelect = calculator.querySelector('select[name="service"]');
        const resultDiv = calculator.querySelector('.quote-result');
        
        const calculateQuote = () => {
            const area = parseFloat(areaInput.value) || 0;
            const service = serviceSelect.value;
            
            if (!area || !service) {
                resultDiv.style.display = 'none';
                return;
            }
            
            let pricePerMeter = 0;
            
            switch(service) {
                case 'central-ac':
                    pricePerMeter = 500; // جنيه للمتر
                    break;
                case 'vrf':
                    pricePerMeter = 700;
                    break;
                case 'industrial':
                    pricePerMeter = 300;
                    break;
                default:
                    pricePerMeter = 0;
            }
            
            const total = area * pricePerMeter;
            
            if (total > 0) {
                resultDiv.innerHTML = `
                    <h4>التقدير الأولي:</h4>
                    <p>المساحة: ${area} م²</p>
                    <p>الخدمة: ${serviceSelect.options[serviceSelect.selectedIndex].text}</p>
                    <p class="total">التكلفة التقريبية: ${total.toLocaleString()} جنيه</p>
                    <small>*هذا تقدير أولي، السعر النهائي يعتمد على المعاينة الفعلية</small>
                `;
                resultDiv.style.display = 'block';
            }
        };
        
        areaInput.addEventListener('input', calculateQuote);
        serviceSelect.addEventListener('change', calculateQuote);
    }
    
    setupFormAnalytics() {
        // Track form interactions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            if (form.tagName === 'FORM') {
                // Track form submission in Google Analytics
                if (typeof gtag !== 'undefined') {
                    const formName = form.id || form.name || 'unknown_form';
                    gtag('event', 'form_submit', {
                        'event_category': 'forms',
                        'event_label': formName,
                        'value': 1
                    });
                }
                
                // Track in Facebook Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                }
            }
        });
        
        // Track form starts
        document.addEventListener('focus', (e) => {
            if (e.target.matches('form input, form textarea, form select')) {
                const form = e.target.closest('form');
                if (form) {
                    // Track form start
                    if (!form.dataset.started) {
                        form.dataset.started = 'true';
                        
                        if (typeof gtag !== 'undefined') {
                            const formName = form.id || form.name || 'unknown_form';
                            gtag('event', 'form_start', {
                                'event_category': 'forms',
                                'event_label': formName
                            });
                        }
                    }
                }
            }
        }, true);
    }
    
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            this.showFieldError(field, 'هذا الحقل مطلوب');
        }
        
        // Validate email
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                this.showFieldError(field, 'البريد الإلكتروني غير صحيح');
            }
        }
        
        // Validate phone
        else if (field.type === 'tel' && value) {
            const phoneDigits = value.replace(/\D/g, '');
            if (!this.isValidEgyptianPhone(phoneDigits)) {
                isValid = false;
                this.showFieldError(field, 'رقم الهاتف غير صحيح');
            }
        }
        
        // Validate numbers
        else if (field.type === 'number' && value) {
            const numValue = parseFloat(value);
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            
            if (min && numValue < parseFloat(min)) {
                isValid = false;
                this.showFieldError(field, `القيمة يجب أن تكون ${min} على الأقل`);
            }
            
            if (max && numValue > parseFloat(max)) {
                isValid = false;
                this.showFieldError(field, `القيمة يجب أن تكون ${max} على الأكثر`);
            }
        }
        
        if (isValid) {
            field.classList.add('valid');
        } else {
            field.classList.add('error');
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.classList.remove('error');
    }
    
    showFormErrors(form) {
        // Find first error field and scroll to it
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstError.focus();
        }
    }
    
    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        try {
            // In production, this would be a real API call
            // For now, simulate API call
            await this.simulateApiCall(formData);
            
            // Show success message
            this.showSuccessMessage(form, 'شكراً لك! تم استلام رسالتك وسنتواصل معك قريباً.');
            
            // Reset form
            form.reset();
            
            // Track successful submission
            this.trackFormSuccess(form);
            
        } catch (error) {
            // Show error message
            this.showErrorMessage(form, 'حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.');
            
            // Track form error
            this.trackFormError(form, error);
            
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // 90% success rate for simulation
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'تم الإرسال بنجاح' });
                } else {
                    reject(new Error('فشل في الإرسال'));
                }
            }, 1500);
        });
    }
    
    showSuccessMessage(form, message) {
        // Remove any existing messages
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message success';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        messageDiv.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            border: 1px solid #c3e6cb;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    showErrorMessage(form, message) {
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message error';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        messageDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        // Scroll to error
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    trackFormSuccess(form) {
        const formName = form.id || form.name || 'unknown_form';
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_success', {
                'event_category': 'forms',
                'event_label': formName,
                'value': 1
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'CompleteRegistration');
        }
        
        // Log to console for debugging
        console.log(`✅ Form submitted successfully: ${formName}`);
    }
    
    trackFormError(form, error) {
        const formName = form.id || form.name || 'unknown_form';
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                'event_category': 'forms',
                'event_label': formName,
                'value': 0
            });
        }
        
        // Log error
        console.error(`❌ Form submission error (${formName}):`, error);
    }
    
    // Utility method to get form data as object
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    // Public API method to validate specific form
    validateFormById(formId) {
        const form = document.getElementById(formId);
        if (form) {
            return this.validateForm(form);
        }
        return false;
    }
    
    // Public API method to reset form
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            
            // Clear all errors
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            
            // Clear validation classes
            const fields = form.querySelectorAll('.valid, .error');
            fields.forEach(field => {
                field.classList.remove('valid', 'error');
            });
        }
    }
}

// Initialize forms handler
document.addEventListener('DOMContentLoaded', function() {
    window.kayanForms = new KayanForms();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KayanForms;
}
