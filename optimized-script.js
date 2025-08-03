// Optimized JavaScript for Umbrella Insurance Landing Page
// Enhanced with parallax effects and performance optimizations

// Performance optimizations
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Intersection Observer for scroll animations with performance optimization
const observerOptions = {
  threshold: [0.1, 0.3, 0.5],
  rootMargin: '0px 0px -50px 0px'
};

// Create intersection observer with performance optimizations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        entry.target.classList.add('animate-in');
        
        // Special handling for How It Works section
        if (entry.target.classList.contains('how-it-works')) {
          animateProcessTimeline();
        }
        
        // Special handling for summary card
        if (entry.target.classList.contains('summary-card')) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, 800);
        }
      });
      
      // Unobserve after animation to improve performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Enhanced parallax controller
class ParallaxController {
  constructor() {
    this.elements = [];
    this.isScrolling = false;
    this.scrollTop = 0;
    this.windowHeight = window.innerHeight;
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.addParallaxElements();
  }
  
  bindEvents() {
    window.addEventListener('scroll', throttle(() => {
      this.scrollTop = window.pageYOffset;
      this.updateParallax();
    }, 16)); // ~60fps
    
    window.addEventListener('resize', debounce(() => {
      this.windowHeight = window.innerHeight;
      this.updateParallax();
    }, 250));
  }
  
  addParallaxElements() {
    // Hero section parallax
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
      this.elements.push({
        element: heroImage,
        speed: 0.3,
        type: 'translateY'
      });
    }
    
    // Mission section background parallax
    const missionBg = document.querySelector('.mission::before');
    const mission = document.querySelector('.mission');
    if (mission) {
      this.elements.push({
        element: mission,
        speed: 0.1,
        type: 'backgroundY',
        selector: '::before'
      });
    }
    
    // How it works background elements
    const howItWorks = document.querySelector('.how-it-works');
    if (howItWorks) {
      this.elements.push({
        element: howItWorks,
        speed: 0.05,
        type: 'backgroundY',
        selector: '::before'
      });
    }
    
    // Why choose section parallax
    const whyImage = document.querySelector('.why-image img');
    if (whyImage) {
      this.elements.push({
        element: whyImage,
        speed: -0.2,
        type: 'translateY'
      });
    }
    
    // Contact section background
    const contactWrapper = document.querySelector('.contact-wrapper');
    if (contactWrapper) {
      this.elements.push({
        element: contactWrapper,
        speed: 0.08,
        type: 'backgroundY',
        selector: '::before'
      });
    }
  }
  
  updateParallax() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      requestAnimationFrame(() => {
        this.elements.forEach(item => {
          const { element, speed, type } = item;
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + this.scrollTop;
          const elementHeight = rect.height;
          
          // Only animate elements in viewport
          if (rect.bottom >= 0 && rect.top <= this.windowHeight) {
            const yPos = -(this.scrollTop - elementTop) * speed;
            
            switch (type) {
              case 'translateY':
                element.style.transform = `translateY(${yPos}px)`;
                break;
              case 'backgroundY':
                element.style.backgroundPosition = `center ${yPos}px`;
                break;
            }
          }
        });
        this.isScrolling = false;
      });
    }
  }
}

// Animate the process timeline with enhanced effects
function animateProcessTimeline() {
  const progressBar = document.querySelector('.progress-bar');
  const steps = document.querySelectorAll('.step');
  const summaryCard = document.querySelector('.summary-card');
  
  // Animate progress bar with easing
  setTimeout(() => {
    if (progressBar) {
      progressBar.style.width = '100%';
    }
  }, 500);
  
  // Animate steps with stagger and enhanced effects
  steps.forEach((step, index) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        step.classList.add('animate-in');
        
        // Add individual step animations
        const circle = step.querySelector('.circle');
        const stepAnimation = step.querySelector('.step-animation');
        
        if (circle) {
          setTimeout(() => {
            circle.style.transform = 'scale(1.1)';
            setTimeout(() => {
              circle.style.transform = 'scale(1)';
            }, 200);
          }, 300);
        }
      });
    }, 300 + (index * 200));
  });
  
  // Animate summary card last
  setTimeout(() => {
    if (summaryCard) {
      requestAnimationFrame(() => {
        summaryCard.classList.add('animate-in');
      });
    }
  }, 300 + (steps.length * 200) + 500);
}

// Enhanced scroll-based animations
class ScrollAnimationController {
  constructor() {
    this.animations = new Map();
    this.init();
  }
  
  init() {
    this.setupAnimations();
    this.bindScrollEvents();
  }
  
  setupAnimations() {
    // Hero section typing effect
    const heroTitle = document.querySelector('.hero-text-block h1');
    if (heroTitle) {
      this.animations.set('heroTitle', {
        element: heroTitle,
        type: 'typing',
        text: heroTitle.textContent,
        speed: 100,
        delay: 1000
      });
    }
    
    // Mission title underline
    const missionTitle = document.getElementById("mission-title");
    if (missionTitle) {
      this.animations.set('missionTitle', {
        element: missionTitle,
        type: 'underline',
        delay: 500
      });
    }
  }
  
  bindScrollEvents() {
    const handleScroll = throttle(() => {
      this.checkVisibleAnimations();
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
  }
  
  checkVisibleAnimations() {
    this.animations.forEach((animation, key) => {
      if (!animation.triggered && this.isElementVisible(animation.element)) {
        this.triggerAnimation(key, animation);
        animation.triggered = true;
      }
    });
  }
  
  isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
  }
  
  triggerAnimation(key, animation) {
    const { element, type, delay = 0 } = animation;
    
    setTimeout(() => {
      switch (type) {
        case 'typing':
          this.animateTyping(animation);
          break;
        case 'underline':
          element.classList.add('underline-show');
          break;
      }
    }, delay);
  }
  
  animateTyping({ element, text, speed = 100 }) {
    element.textContent = '';
    element.style.borderRight = '2px solid #0071ce';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    typeWriter();
  }
}

// Enhanced form controller
class FormController {
  constructor() {
    this.form = document.querySelector('.contact-form');
    this.inputs = [];
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.inputs = Array.from(this.form.querySelectorAll('input, textarea'));
    this.setupFloatingLabels();
    this.setupValidation();
    this.setupSubmission();
  }
  
  setupFloatingLabels() {
    this.inputs.forEach(input => {
      const formGroup = input.closest('.form-group');
      const label = formGroup ? formGroup.querySelector('label') : input.previousElementSibling;
      
      if (!label) return;
      
      // Enhanced focus/blur handling
      input.addEventListener('focus', () => {
        requestAnimationFrame(() => {
          label.classList.add('floating');
          formGroup.classList.add('focused');
        });
      });
      
      input.addEventListener('blur', () => {
        requestAnimationFrame(() => {
          if (!input.value.trim()) {
            label.classList.remove('floating');
          }
          formGroup.classList.remove('focused');
        });
      });
      
      // Real-time validation
      input.addEventListener('input', debounce(() => {
        this.validateField(input);
      }, 300));
      
      // Check initial state
      if (input.value.trim()) {
        label.classList.add('floating');
      }
    });
  }
  
  setupValidation() {
    this.validationRules = {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      required: {
        test: (value) => value.trim().length > 0,
        message: 'This field is required'
      }
    };
  }
  
  validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    this.clearError(input);
    
    // Required validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = this.validationRules.required.message;
    }
    
    // Email validation
    if (input.type === 'email' && value && !this.validationRules.email.pattern.test(value)) {
      isValid = false;
      errorMessage = this.validationRules.email.message;
    }
    
    if (!isValid) {
      this.showError(input, errorMessage);
    }
    
    return isValid;
  }
  
  setupSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmission();
    });
  }
  
  handleSubmission() {
    let isFormValid = true;
    
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Validate all fields
    this.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (isFormValid) {
      this.submitForm();
    } else {
      // Focus first invalid field
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
    }
  }
  
  submitForm() {
  const submitButton = this.form.querySelector('button[type="submit"]');
  this.addLoadingState(submitButton);

  emailjs.sendForm('service_x13wvkh', 'template_8i0iwb2', this.form)
    .then(() => {
      this.removeLoadingState(submitButton);
      this.showSuccessMessage();
      this.resetForm();
    })
    .catch((error) => {
      this.removeLoadingState(submitButton);
      alert('Failed to send message. Please try again.');
      console.error('EmailJS error:', error);
    });
}

  resetForm() {
    this.form.reset();
    this.inputs.forEach(input => {
      const formGroup = input.closest('.form-group');
      const label = formGroup ? formGroup.querySelector('label') : input.previousElementSibling;
      if (label) {
        label.classList.remove('floating');
      }
      this.clearError(input);
    });
  }
  
  showError(input, message) {
    input.classList.add('error');
    const formGroup = input.closest('.form-group') || input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Animate error message
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translateY(-10px)';
    formGroup.appendChild(errorDiv);
    
    requestAnimationFrame(() => {
      errorDiv.style.transition = 'all 0.3s ease';
      errorDiv.style.opacity = '1';
      errorDiv.style.transform = 'translateY(0)';
    });
  }
  
  clearError(input) {
    input.classList.remove('error');
    const formGroup = input.closest('.form-group') || input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.style.opacity = '0';
      setTimeout(() => errorMessage.remove(), 300);
    }
  }
  
  showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Thank you! Your message has been sent successfully.';
    successDiv.style.opacity = '0';
    successDiv.style.transform = 'translateY(20px)';
    
    this.form.appendChild(successDiv);
    
    requestAnimationFrame(() => {
      successDiv.style.transition = 'all 0.5s ease';
      successDiv.style.opacity = '1';
      successDiv.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }, 5000);
  }
  
  addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
    element.textContent = 'Sending...';
  }
  
  removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
    element.textContent = 'Submit';
  }
}

// Enhanced button interactions
class ButtonController {
  constructor() {
    this.buttons = document.querySelectorAll('button, .contact-form button');
    this.init();
  }
  
  init() {
    this.setupHoverEffects();
    this.setupRippleEffects();
  }
  
  setupHoverEffects() {
    this.buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
          requestAnimationFrame(() => {
            button.style.transform = 'translateY(-2px)';
          });
        }
      });
      
      button.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          button.style.transform = 'translateY(0)';
        });
      });
    });
  }
  
  setupRippleEffects() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.disabled) return;
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}

// Enhanced navigation controller
class NavigationController {
  constructor() {
    this.navLinks = document.querySelectorAll('nav a[href^="#"]');
    this.header = document.querySelector('header');
    this.init();
  }
  
  init() {
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupHeaderScroll();
  }
  
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = this.header.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          this.smoothScrollTo(targetPosition, 800);
        }
      });
    });
  }
  
  smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    
    requestAnimationFrame(animation);
  }
  
  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = throttle(() => {
      const scrollPosition = window.pageYOffset + this.header.offsetHeight + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          this.updateActiveNavLink(sectionId);
        }
      });
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
  }
  
  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }
  
  setupHeaderScroll() {
    let lastScrollTop = 0;
    
    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        this.header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        this.header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
  }
}

// Enhanced step interactions
class StepController {
  constructor() {
    this.steps = document.querySelectorAll('.step');
    this.init();
  }
  
  init() {
    this.setupInteractions();
  }
  
  setupInteractions() {
    this.steps.forEach((step, index) => {
      step.addEventListener('mouseenter', () => {
        requestAnimationFrame(() => {
          // Dim other steps
          this.steps.forEach(otherStep => {
            if (otherStep !== step) {
              otherStep.style.opacity = '0.7';
              otherStep.style.transform = 'scale(0.95)';
            }
          });
          
          // Highlight current step
          step.style.transform = 'translateY(-10px) scale(1.05)';
        });
      });
      
      step.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          // Restore all steps
          this.steps.forEach(otherStep => {
            otherStep.style.opacity = '1';
            otherStep.style.transform = 'scale(1)';
          });
          
          step.style.transform = 'translateY(0) scale(1)';
        });
      });
    });
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.measurePageLoad();
    this.measureScrollPerformance();
  }
  
  measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoad = navigation.loadEventEnd - navigation.loadEventStart;
      console.log(`Page load time: ${this.metrics.pageLoad}ms`);
    });
  }
  
  measureScrollPerformance() {
    let scrollCount = 0;
    let totalScrollTime = 0;
    
    const measureScroll = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const end = performance.now();
        totalScrollTime += (end - start);
        scrollCount++;
        
        if (scrollCount % 100 === 0) {
          const avgScrollTime = totalScrollTime / scrollCount;
          console.log(`Average scroll frame time: ${avgScrollTime.toFixed(2)}ms`);
        }
      });
    };
    
    window.addEventListener('scroll', throttle(measureScroll, 16));
  }
}

// Initialize all controllers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize performance monitoring
  const performanceMonitor = new PerformanceMonitor();
  
  // Initialize parallax controller
  const parallaxController = new ParallaxController();
  
  // Initialize scroll animation controller
  const scrollAnimationController = new ScrollAnimationController();
  
  // Initialize form controller
  const formController = new FormController();
  
  // Initialize button controller
  const buttonController = new ButtonController();
  
  // Initialize navigation controller
  const navigationController = new NavigationController();
  
  // Initialize step controller
  const stepController = new StepController();
  
  // Observe all sections for scroll animations
  const sections = document.querySelectorAll('.section-title, .hero-text-block, .mission blockquote, .why-text, .why-image, .how-it-works, .summary-card, .form-box');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Special handling for mission title underline
  const missionTitle = document.getElementById("mission-title");
  if (missionTitle) {
    observer.observe(missionTitle);
  }

  // Add loading animation to hero section
  const heroElements = document.querySelectorAll('.hero-text-block, .hero-image');
  heroElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.3}s`;
    element.classList.add('hero-animate');
  });
  
  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      document.head.appendChild(link);
    });
  };
  
  preloadCriticalResources();
  
  // Service Worker registration for caching
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  }
});

// Expose controllers for debugging
window.UmbrellaApp = {
  ParallaxController,
  ScrollAnimationController,
  FormController,
  ButtonController,
  NavigationController,
  StepController,
  PerformanceMonitor
};

