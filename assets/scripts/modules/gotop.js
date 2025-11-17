class GoToTop {
  constructor() {
    this.button = document.querySelector('.gotop');
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      this.toggleButton();
    });

    // Smooth scroll to top when clicked
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    // Initial check
    this.toggleButton();
  }

  toggleButton() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = 300; // Show button after 300px scroll

    if (scrollTop > threshold) {
      this.button.classList.add('active');
    } else {
      this.button.classList.remove('active');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Initialize go to top functionality
document.addEventListener('DOMContentLoaded', () => {
  new GoToTop();
});