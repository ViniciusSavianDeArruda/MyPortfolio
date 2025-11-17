// Main Portfolio JavaScript
class Portfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupTypingEffect();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupSkillsToggle();
    this.setupFormHandler();
    this.updateCurrentYear();
  }

  // Mobile Menu Toggle
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');

    if (mobileToggle && menu) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        menu.classList.toggle('active');
      });

      // Close menu when clicking on menu items
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          menu.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !menu.contains(e.target)) {
          mobileToggle.classList.remove('active');
          menu.classList.remove('active');
        }
      });
    }
  }

  // Typing Effect for Hero Section
  setupTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
      'Front-end Developer',
      'Web Developer',
      'UI/UX Enthusiast',
      'JavaScript Developer'
    ];

    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function type() {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        speed = pauseTime;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }

      setTimeout(type, speed);
    }

    // Start typing effect after a delay
    setTimeout(type, 1000);
  }

  // Smooth Scrolling for Navigation Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Active Navigation Highlighting
  setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.menu a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    });

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  // Skills Toggle (Show All / Show Less)
  setupSkillsToggle() {
    const toggleButton = document.getElementById('show-all-tech');
    const hiddenTechs = document.querySelectorAll('.hidden-tech');

    if (toggleButton && hiddenTechs.length > 0) {
      let isExpanded = false;

      toggleButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        
        hiddenTechs.forEach((tech, index) => {
          if (isExpanded) {
            setTimeout(() => {
              tech.classList.add('show');
            }, index * 100);
          } else {
            tech.classList.remove('show');
          }
        });

        toggleButton.textContent = isExpanded ? 'Mostrar Menos' : 'Mostrar Todas';
      });
    }
  }

  // Contact Form Handler
  setupFormHandler() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
          this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          this.showNotification('Por favor, insira um email válido.', 'error');
          return;
        }

        // Simulate form submission
        this.simulateFormSubmission(data);
      });
    }
  }

  // Simulate form submission (replace with actual form handling)
  simulateFormSubmission(data) {
    const submitButton = document.querySelector('.send-btn');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Show success message
      this.showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
      
      // Reset form
      document.getElementById('contact-form').reset();
    }, 2000);
  }

  // Notification System
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 350px;
    `;
    
    // Add type-specific styles
    if (type === 'success') {
      notification.style.background = '#10b981';
      notification.style.color = '#ffffff';
    } else if (type === 'error') {
      notification.style.background = '#ef4444';
      notification.style.color = '#ffffff';
    } else {
      notification.style.background = 'var(--bg-card)';
      notification.style.color = 'var(--text-primary)';
      notification.style.border = '1px solid var(--border-color)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Update current year in footer
  updateCurrentYear() {
    const yearElement = document.getElementById('ano-atual');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
}

// Initialize Portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});
