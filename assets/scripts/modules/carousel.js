// Carousel System
class Carousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = container.querySelectorAll('.projeto-slide');
    this.prevBtn = container.querySelector('.carousel-btn.prev');
    this.nextBtn = container.querySelector('.carousel-btn.next');
    
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    
    this.init();
  }

  init() {
    if (!this.track || this.totalSlides === 0) return;
    
    this.setupCarousel();
    this.bindEvents();
    this.updateCarousel();
  }

  setupCarousel() {
    // Configurar largura do track
    this.track.style.width = `${this.totalSlides * 100}%`;
    
    // Configurar largura dos slides
    this.slides.forEach(slide => {
      slide.style.width = `${100 / this.totalSlides}%`;
    });
  }

  bindEvents() {
    // Botões de navegação
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    this.container.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      isDragging = false;
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -this.currentSlide * (100 / this.totalSlides);
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar estado dos botões
    this.updateButtons();
  }

  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
  }
}

// Função de inicialização do carousel
function initCarousel() {
  const containers = document.querySelectorAll('.carousel-container, .projeto-carousel, .project-carousel');
  containers.forEach(container => {
    if (!container.dataset.carouselInitialized) {
      container.dataset.carouselInitialized = 'true';
      new Carousel(container);
    }
  });
}

// Inicializar carrosseis
document.addEventListener('DOMContentLoaded', initCarousel);
window.addEventListener('load', initCarousel);