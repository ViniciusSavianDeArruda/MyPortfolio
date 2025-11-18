// Simple Animation Library - Versão minimalista para animações de entrada

class SimpleAnime {
  constructor() {
    this.elements = [];
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    // Configurar estilos primeiro
    this.setupInitialStyles();
    
    // Configurar observer para elementos com data-anime
    this.setupIntersectionObserver();
    
    // Processar elementos já visíveis após um pequeno delay
    setTimeout(() => this.processInitialElements(), 100);
  }

  setupInitialStyles() {
    const style = document.createElement('style');
    style.id = 'simple-anime-styles';
    style.textContent = `
      [data-anime] {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                   transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      [data-anime].animated {
        opacity: 1;
        transform: translateY(0);
      }
      
      [data-anime="0"] {
        transition-delay: 0ms;
      }
    `;
    
    if (!document.getElementById('simple-anime-styles')) {
      document.head.appendChild(style);
    }
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observar todos os elementos com data-anime
    document.querySelectorAll('[data-anime]').forEach(el => {
      this.observer.observe(el);
    });
  }

  processInitialElements() {
    // Animar elementos já visíveis na tela
    document.querySelectorAll('[data-anime]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < (window.innerHeight - 100) && rect.bottom > 0;
      
      if (isVisible) {
        const delay = parseInt(el.dataset.anime) || 0;
        setTimeout(() => this.animateElement(el), delay);
      }
    });
  }

  animateElement(element) {
    const delay = parseInt(element.dataset.anime) || 0;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      element.classList.add('animated');
    }, delay);
  }
}

// Variável global para evitar múltiplas inicializações
window.simpleAnimeInstance = null;

// Função de inicialização
function initSimpleAnime() {
  if (!window.simpleAnimeInstance) {
    window.simpleAnimeInstance = new SimpleAnime();
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSimpleAnime);
} else {
  initSimpleAnime();
}