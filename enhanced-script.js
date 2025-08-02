// Enhanced JavaScript for Umbrella Insurance Landing Page

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Create intersection observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
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
    }
  });
}, observerOptions);

// Animate the process timeline
function animateProcessTimeline() {
  const progressBar = document.querySelector('.progress-bar');
  const steps = document.querySelectorAll('.step');
  const summaryCard = document.querySelector('.summary-card');
  
  // Animate progress bar
  setTimeout(() => {
    if (progressBar) {
      progressBar.style.width = '100%';
    }
  }, 500);
  
  // Animate steps with stagger
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('animate-in');
    }, 300 + (index * 200));
  });
  
  // Animate summary card last
  setTimeout(() => {
    if (summaryCard) {
      summaryCard.classList.add('animate-in');
    }
  }, 300 + (steps.length * 200) + 500);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Observe all sections for scroll animations
  const sections = document.querySelectorAll('.section-title, .hero-text-block, .mission blockquote, .why-text, .why-image, .how-it-works, .summary-card');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Special handling for mission title underline
  const missionTitle = document.getElementById("mission-title");
  if (missionTitle) {
    observer.observe(missionTitle);
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animation to hero section
  const heroElements = document.querySelectorAll('.hero-text-block, .hero-image');
  heroElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.3}s`;
    element.classList.add('hero-animate');
  });

  // Enhanced button hover effects
  const buttons = document.querySelectorAll('button, .contact-form button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add ripple effect to buttons
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Add typing effect to hero title
  const heroTitle = document.querySelector('.hero-text-block h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #0071ce';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 1000);
  }

  // Enhanced step interactions
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    step.addEventListener('mouseenter', function() {
      // Pause other animations temporarily
      steps.forEach(otherStep => {
        if (otherStep !== step) {
          otherStep.style.opacity = '0.7';
        }
      });
    });
    
    step.addEventListener('mouseleave', function() {
      // Restore other steps
      steps.forEach(otherStep => {
        otherStep.style.opacity = '1';
      });
    });
  });
});

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea');
  
  // Add floating label effect
  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    const label = formGroup ? formGroup.querySelector('label') : input.previousElementSibling;
    
    if (!label) return;
    
    input.addEventListener('focus', function() {
      label.classList.add('floating');
      formGroup.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        label.classList.remove('floating');
      }
      formGroup.classList.remove('focused');
    });
    
    // Check if input has value on load
    if (input.value) {
      label.classList.add('floating');
    }
  });
  
  // Form submission with validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const formData = new FormData(this);
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Validate each field
    inputs.forEach(input => {
      const value = input.value.trim();
      let errorMessage = '';
      
      if (!value) {
        errorMessage = 'This field is required';
        isValid = false;
      } else if (input.type === 'email' && !isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
      }
      
      if (errorMessage) {
        showError(input, errorMessage);
      } else {
        clearError(input);
      }
    });
    
    if (isValid) {
      // Show success message
      showSuccessMessage();
      this.reset();
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const label = formGroup ? formGroup.querySelector('label') : input.previousElementSibling;
        if (label) {
          label.classList.remove('floating');
        }
      });
    }
  });
});

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(input, message) {
  input.classList.add('error');
  const formGroup = input.closest('.form-group') || input.parentElement;
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  formGroup.appendChild(errorDiv);
}

function clearError(input) {
  input.classList.remove('error');
  const formGroup = input.closest('.form-group') || input.parentElement;
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

function showSuccessMessage() {
  const form = document.querySelector('.contact-form');
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = 'Thank you! Your message has been sent successfully.';
  form.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Add loading states for better UX
function addLoadingState(element) {
  element.classList.add('loading');
  element.disabled = true;
}

function removeLoadingState(element) {
  element.classList.remove('loading');
  element.disabled = false;
}

