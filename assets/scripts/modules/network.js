// Network Animation - Linhas conectando pontos
class NetworkAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.canvasId = canvasId;
    
    // Configurações baseadas na seção
    this.setConfigForSection(canvasId);
    
    this.animationId = null;
    
    this.init();
    this.bindEvents();
  }
  
  setConfigForSection(canvasId) {
    // Configurações baseadas na seção e responsividade
    const screenWidth = window.innerWidth;
    let baseConfig = {
      maxDistance: 120,
      pointCount: 50,
      speed: 0.5
    };
    
    // Ajustar por seção
    if (canvasId.includes('sobre')) {
      baseConfig = { maxDistance: 100, pointCount: 35, speed: 0.3 };
    } else if (canvasId.includes('skills')) {
      baseConfig = { maxDistance: 140, pointCount: 60, speed: 0.4 };
    } else if (canvasId.includes('projetos')) {
      baseConfig = { maxDistance: 110, pointCount: 40, speed: 0.6 };
    } else if (canvasId.includes('contato')) {
      baseConfig = { maxDistance: 90, pointCount: 30, speed: 0.25 };
    }
    
    // Ajustar para responsividade
    if (screenWidth < 480) {
      // Mobile pequeno
      baseConfig.pointCount = Math.floor(baseConfig.pointCount * 0.4);
      baseConfig.maxDistance = Math.floor(baseConfig.maxDistance * 0.7);
      baseConfig.speed *= 0.8;
    } else if (screenWidth < 768) {
      // Mobile
      baseConfig.pointCount = Math.floor(baseConfig.pointCount * 0.6);
      baseConfig.maxDistance = Math.floor(baseConfig.maxDistance * 0.8);
      baseConfig.speed *= 0.9;
    } else if (screenWidth < 1024) {
      // Tablet
      baseConfig.pointCount = Math.floor(baseConfig.pointCount * 0.8);
      baseConfig.maxDistance = Math.floor(baseConfig.maxDistance * 0.9);
    }
    
    this.maxDistance = baseConfig.maxDistance;
    this.pointCount = baseConfig.pointCount;
    this.speed = baseConfig.speed;
  }
  
  init() {
    this.resizeCanvas();
    this.createPoints();
    this.animate();
  }
  
  bindEvents() {
    // Debounce do resize para melhor performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 100);
    });
    
    // Pausar animação quando não visível
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
    
    // Observar mudanças de tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
          // Tema mudou, forçar re-renderização
          this.ctx.clearRect(0, 0, this.width, this.height);
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    this.themeObserver = observer;
  }
  
  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Garantir dimensões mínimas
    const minWidth = 300;
    const minHeight = 200;
    
    this.width = Math.max(rect.width, minWidth);
    this.height = Math.max(rect.height, minHeight);
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    // Reconfigurar baseado no novo tamanho
    this.setConfigForSection(this.canvasId);
    
    // Recriar pontos com novo tamanho e configurações
    this.createPoints();
  }
  
  createPoints() {
    this.points = [];
    
    // Adicionar margem para evitar pontos muito na borda
    const margin = 20;
    const effectiveWidth = this.width - (margin * 2);
    const effectiveHeight = this.height - (margin * 2);
    
    for (let i = 0; i < this.pointCount; i++) {
      this.points.push({
        x: margin + Math.random() * effectiveWidth,
        y: margin + Math.random() * effectiveHeight,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        size: Math.random() * 1.5 + 0.8
      });
    }
  }
  
  updatePoints() {
    const margin = 10;
    
    this.points.forEach(point => {
      point.x += point.vx;
      point.y += point.vy;
      
      // Bounce off edges com margem para evitar acumulação
      if (point.x <= margin) {
        point.vx = Math.abs(point.vx);
        point.x = margin;
      } else if (point.x >= this.width - margin) {
        point.vx = -Math.abs(point.vx);
        point.x = this.width - margin;
      }
      
      if (point.y <= margin) {
        point.vy = Math.abs(point.vy);
        point.y = margin;
      } else if (point.y >= this.height - margin) {
        point.vy = -Math.abs(point.vy);
        point.y = this.height - margin;
      }
      
      // Adicionar pequena variação para evitar padrões repetitivos
      if (Math.random() < 0.001) {
        point.vx += (Math.random() - 0.5) * 0.1;
        point.vy += (Math.random() - 0.5) * 0.1;
        
        // Limitar velocidade máxima
        const maxSpeed = this.speed * 2;
        point.vx = Math.max(-maxSpeed, Math.min(maxSpeed, point.vx));
        point.vy = Math.max(-maxSpeed, Math.min(maxSpeed, point.vy));
      }
    });
  }
  
  drawConnections() {
    // Detectar tema atual - verificar múltiplas fontes para garantir detecção correta
    const theme = document.documentElement.getAttribute('data-theme') || 
                  document.body.getAttribute('data-theme') ||
                  (document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
    
    // Verificar se CSS tem cores claras ou escuras aplicadas
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const isLightTheme = bodyBg.includes('255') || bodyBg.includes('248') || theme === 'light';
    
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const pointA = this.points[i];
        const pointB = this.points[j];
        
        const distance = Math.sqrt(
          Math.pow(pointA.x - pointB.x, 2) + 
          Math.pow(pointA.y - pointB.y, 2)
        );
        
        if (distance < this.maxDistance) {
          const opacity = 1 - (distance / this.maxDistance);
          const alpha = opacity * 0.4;
          
          this.ctx.beginPath();
          // Cores mais visíveis e consistentes
          this.ctx.strokeStyle = isLightTheme 
            ? `rgba(0, 0, 0, ${alpha})` 
            : `rgba(255, 255, 255, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(pointA.x, pointA.y);
          this.ctx.lineTo(pointB.x, pointB.y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  drawPoints() {
    // Detectar tema atual de forma robusta
    const theme = document.documentElement.getAttribute('data-theme') || 
                  document.body.getAttribute('data-theme') ||
                  (document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
    
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const isLightTheme = bodyBg.includes('255') || bodyBg.includes('248') || theme === 'light';
    
    this.points.forEach(point => {
      this.ctx.beginPath();
      // Pontos mais visíveis
      this.ctx.fillStyle = isLightTheme 
        ? 'rgba(0, 0, 0, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)';
      this.ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Adicionar borda sutil para melhor visibilidade - tema escuro mais intenso
      this.ctx.beginPath();
      this.ctx.strokeStyle = isLightTheme 
        ? 'rgba(0, 0, 0, 0.3)' 
        : 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = isLightTheme ? 0.5 : 0.8;
      this.ctx.arc(point.x, point.y, point.size + 0.5, 0, Math.PI * 2);
      this.ctx.stroke();
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.updatePoints();
    this.drawConnections();
    this.drawPoints();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }
  
  destroy() {
    this.pause();
    window.removeEventListener('resize', this.resizeCanvas);
    
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }
}

// Armazenar instâncias para evitar duplicação
window.networkInstances = window.networkInstances || {};

// Função de inicialização mais robusta
function initNetworkAnimations() {
  const networkCanvases = [
    'network-canvas',
    'network-canvas-sobre', 
    'network-canvas-skills',
    'network-canvas-projetos',
    'network-canvas-contato'
  ];
  
  networkCanvases.forEach(canvasId => {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      // Destruir instância anterior se existir
      if (window.networkInstances[canvasId]) {
        window.networkInstances[canvasId].destroy();
        delete window.networkInstances[canvasId];
      }
      
      // Aguardar um frame para garantir que o canvas está renderizado
      setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          window.networkInstances[canvasId] = new NetworkAnimation(canvasId);
        }
      }, 100);
    }
  });
}

// Reinicializar após mudanças de tema
function reinitializeNetworksOnThemeChange() {
  // Aguardar transição do tema
  setTimeout(() => {
    Object.values(window.networkInstances).forEach(instance => {
      if (instance && instance.ctx) {
        instance.ctx.clearRect(0, 0, instance.width, instance.height);
      }
    });
  }, 300);
}

// Observar mudanças de tema
const themeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      reinitializeNetworksOnThemeChange();
    }
  });
});

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initNetworkAnimations();
  
  // Observar mudanças de tema no documentElement
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});

window.addEventListener('load', initNetworkAnimations);

// Reinicializar ao redimensionar a janela (debounced)
let reinitTimeout;
window.addEventListener('resize', () => {
  clearTimeout(reinitTimeout);
  reinitTimeout = setTimeout(() => {
    initNetworkAnimations();
  }, 500);
});