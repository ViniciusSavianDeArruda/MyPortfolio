// Go to Top Button
class GoToTop {
  constructor() {
    this.button = document.querySelector('.gotop');
    this.init();
  }

  init() {
    if (!this.button) return;
    
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Click do botão
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const threshold = 300;
    
    if (scrollY > threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Estilos do botão
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .gotop {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--accent-primary, #00ad6f);
      color: white;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .gotop.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .gotop:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
    }
    
    .gotop img {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
    }
    
    @media (max-width: 768px) {
      .gotop {
        width: 45px;
        height: 45px;
        bottom: 20px;
        right: 20px;
      }
      
      .gotop img {
        width: 20px;
        height: 20px;
      }
    }
  `;
  document.head.appendChild(style);
});

// Função de inicialização
function initMostrarGotop() {
  if (!window.goToTopInstance) {
    window.goToTopInstance = new GoToTop();
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', initMostrarGotop);