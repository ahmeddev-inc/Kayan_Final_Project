/**
 * Enhanced Tracking System for كيان Website
 */

// Initialize data layer
window.dataLayer = window.dataLayer || [];

// Configuration
const TRACKING_CONFIG = {
  debug: true, // Set to false in production
  measurementId: 'GA_MEASUREMENT_ID', // Replace with actual ID
  trackEvents: true,
  trackForms: true,
  trackClicks: true,
  trackScroll: true
};

// Event Categories
const EVENT_CATEGORIES = {
  CONVERSION: 'conversion',
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  ERROR: 'error'
};

// Track Event Function
function trackEvent(category, action, label, value = null) {
  if (!TRACKING_CONFIG.trackEvents) return;
  
  const eventData = {
    event_category: category,
    event_label: label,
    ...(value !== null && { value: value })
  };
  
  if (window.gtag) {
    gtag('event', action, eventData);
  }
  
  if (TRACKING_CONFIG.debug) {
    console.log('📊 Tracking Event:', { category, action, label, value });
  }
}

// Phone Call Tracking
function trackPhoneCall(number) {
  trackEvent(
    EVENT_CATEGORIES.CONVERSION,
    'phone_call',
    number,
    1
  );
}

// WhatsApp Click Tracking
function trackWhatsAppClick() {
  trackEvent(
    EVENT_CATEGORIES.CONVERSION,
    'whatsapp_click',
    'whatsapp_lead',
    1
  );
}

// Form Submission Tracking
function trackFormSubmission(formId, formName) {
  trackEvent(
    EVENT_CATEGORIES.CONVERSION,
    'form_submit',
    formName || formId,
    1
  );
}

// Service View Tracking
function trackServiceView(serviceName) {
  trackEvent(
    EVENT_CATEGORIES.ENGAGEMENT,
    'service_view',
    serviceName,
    1
  );
}

// Campaign Click Tracking
function trackCampaignClick(campaignText) {
  trackEvent(
    EVENT_CATEGORIES.ENGAGEMENT,
    'campaign_click',
    campaignText,
    1
  );
}

// Error Tracking
function trackError(errorType, errorMessage) {
  trackEvent(
    EVENT_CATEGORIES.ERROR,
    'error',
    errorType,
    0
  );
  
  if (TRACKING_CONFIG.debug) {
    console.error('🔴 Error Tracked:', errorType, errorMessage);
  }
}

// Scroll Depth Tracking
function initScrollTracking() {
  const scrollThresholds = [25, 50, 75, 100];
  let maxScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollThresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && maxScroll < threshold) {
        trackEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          'scroll_depth',
          `${threshold}%`,
          threshold
        );
        maxScroll = threshold;
      }
    });
  });
}

// Time on Page Tracking
function initTimeTracking() {
  let startTime = Date.now();
  let pageActive = true;
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pageActive = false;
    } else {
      pageActive = true;
      startTime = Date.now();
    }
  });
  
  window.addEventListener('beforeunload', () => {
    if (pageActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Only track if spent more than 5 seconds
        trackEvent(
          EVENT_CATEGORIES.ENGAGEMENT,
          'time_on_page',
          'page_exit',
          timeSpent
        );
      }
    }
  });
}

// Initialize All Tracking
function initTracking() {
  console.log('🚀 Initializing Tracking System...');
  
  // Initialize Google Analytics
  if (TRACKING_CONFIG.measurementId && TRACKING_CONFIG.measurementId !== 'GA_MEASUREMENT_ID') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_CONFIG.measurementId}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', TRACKING_CONFIG.measurementId);
    
    console.log('✅ Google Analytics initialized');
  }
  
  // Initialize event listeners
  initEventListeners();
  
  // Initialize scroll tracking
  if (TRACKING_CONFIG.trackScroll) {
    initScrollTracking();
    initTimeTracking();
  }
  
  console.log('✅ Tracking System Ready');
}

// Event Listeners
function initEventListeners() {
  // Phone Links
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const phoneNumber = link.getAttribute('href').replace('tel:', '');
      trackPhoneCall(phoneNumber);
    });
  });
  
  // WhatsApp Links
  document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackWhatsAppClick();
    });
  });
  
  // Forms
  if (TRACKING_CONFIG.trackForms) {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', () => {
        const formId = form.id || 'unknown_form';
        const formName = form.getAttribute('name') || formId;
        trackFormSubmission(formId, formName);
      });
    });
  }
  
  // Service Links
  document.querySelectorAll('a[href*="services"]').forEach(link => {
    link.addEventListener('click', () => {
      const serviceName = link.textContent.trim() || 
                         link.querySelector('h3, span')?.textContent || 
                         'service';
      trackServiceView(serviceName);
    });
  });
  
  // Campaign Items
  document.querySelectorAll('.campaign-item').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.querySelector('.campaign-text')?.textContent || 'campaign';
      trackCampaignClick(text);
    });
  });
  
  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      trackEvent(EVENT_CATEGORIES.ENGAGEMENT, 'back_to_top', 'click', 1);
    });
  }
  
  // Navigation Tracking
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      const pageName = link.textContent.trim();
      trackEvent(EVENT_CATEGORIES.NAVIGATION, 'page_navigation', pageName, 1);
    });
  });
}

// Error Boundary
window.addEventListener('error', (e) => {
  trackError('javascript_error', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  trackError('promise_rejection', e.reason?.message || 'Unknown promise rejection');
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTracking);
} else {
  initTracking();
}

// Export for debugging
if (TRACKING_CONFIG.debug) {
  window.KayanTracking = {
    trackEvent,
    trackPhoneCall,
    trackWhatsAppClick,
    trackFormSubmission,
    config: TRACKING_CONFIG
  };
}
