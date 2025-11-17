class Carousel {
  constructor(selector, options = {}) {
    this.carousel = document.querySelector(selector);
    if (!this.carousel) return;

    this.options = {
      autoplay: options.autoplay || false,
      autoplaySpeed: options.autoplaySpeed || 3000,
      dots: options.dots || false,
      arrows: options.arrows || false,
      ...options
    };

    this.currentIndex = 0;
    this.items = [];
    this.autoplayTimer = null;

    this.init();
  }

  init() {
    this.items = Array.from(this.carousel.querySelectorAll('.carousel-item'));
    if (this.items.length === 0) return;

    this.setupCarousel();
    this.bindEvents();

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  setupCarousel() {
    this.carousel.classList.add('carousel-initialized');
    
    // Show first item
    this.showItem(0);

    // Create dots if enabled
    if (this.options.dots) {
      this.createDots();
    }

    // Create arrows if enabled
    if (this.options.arrows) {
      this.createArrows();
    }
  }

  showItem(index) {
    // Hide all items
    this.items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    this.currentIndex = index;

    // Update dots
    const dots = this.carousel.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  nextItem() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.showItem(nextIndex);
  }

  prevItem() {
    const prevIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.showItem(prevIndex);
  }

  goToItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.showItem(index);
    }
  }

  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    this.items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('data-index', index);
      dotsContainer.appendChild(dot);
    });

    this.carousel.appendChild(dotsContainer);
  }

  createArrows() {
    const prevArrow = document.createElement('button');
    prevArrow.className = 'carousel-arrow carousel-arrow--prev';
    prevArrow.innerHTML = '&#8249;';

    const nextArrow = document.createElement('button');
    nextArrow.className = 'carousel-arrow carousel-arrow--next';
    nextArrow.innerHTML = '&#8250;';

    this.carousel.appendChild(prevArrow);
    this.carousel.appendChild(nextArrow);
  }

  bindEvents() {
    // Dot navigation
    this.carousel.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-dot')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToItem(index);
        this.resetAutoplay();
      }

      if (e.target.classList.contains('carousel-arrow--prev')) {
        this.prevItem();
        this.resetAutoplay();
      }

      if (e.target.classList.contains('carousel-arrow--next')) {
        this.nextItem();
        this.resetAutoplay();
      }
    });

    // Pause autoplay on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.pauseAutoplay();
    });

    this.carousel.addEventListener('mouseleave', () => {
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    });
  }

  startAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }

    this.autoplayTimer = setInterval(() => {
      this.nextItem();
    }, this.options.autoplaySpeed);
  }

  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    if (this.options.autoplay) {
      this.pauseAutoplay();
      this.startAutoplay();
    }
  }

  destroy() {
    this.pauseAutoplay();
    // Remove event listeners and clean up
  }
}

// Auto-initialize carousels with default options
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(`#${carousel.id}` || '.carousel');
  });
});