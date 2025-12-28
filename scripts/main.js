/**
 * Main JavaScript File - كيان للهندسة والتكييف
 */

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mainNav?.classList.contains('active') && 
      !e.target.closest('.main-nav') && 
      !e.target.closest('.mobile-menu-btn')) {
    mainNav.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  }
});

// Animate stats counter
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    const duration = 2000;
    const startTime = Date.now();
    
    function updateNumber() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(easeOutQuart * target);
      
      stat.textContent = currentNumber.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateNumber();
          observer.unobserve(stat);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
  });
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => observer.observe(el));
}

// Form validation and submission
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Simple validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
      }
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
      submitBtn.disabled = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
        form.reset();
      } catch (error) {
        alert('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 موقع كيان للهندسة والتكييف - جاهز للعمل');
  
  // Initialize components
  animateStats();
  initScrollAnimations();
  initForms();
  initSmoothScroll();
  
  // Add page load animation
  document.body.classList.add('page-loaded');
  
  // Update copyright year
  const yearSpan = document.querySelector('#current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reinitialize anything that depends on window size
  }, 250);
});
