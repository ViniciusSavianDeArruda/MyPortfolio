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
    // Configurações padrão
    let config = {
      maxDistance: 120,
      pointCount: 50,
      speed: 0.5
    };
    
    // Ajustar por seção
    if (canvasId.includes('sobre')) {
      config = { maxDistance: 100, pointCount: 35, speed: 0.3 };
    } else if (canvasId.includes('skills')) {
      config = { maxDistance: 140, pointCount: 60, speed: 0.4 };
    } else if (canvasId.includes('projetos')) {
      config = { maxDistance: 110, pointCount: 40, speed: 0.6 };
    } else if (canvasId.includes('contato')) {
      config = { maxDistance: 90, pointCount: 30, speed: 0.25 };
    }
    
    this.maxDistance = config.maxDistance;
    this.pointCount = config.pointCount;
    this.speed = config.speed;
  }
  
  init() {
    this.resizeCanvas();
    this.createPoints();
    this.animate();
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());
    
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
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    this.width = rect.width;
    this.height = rect.height;
    
    // Recriar pontos com novo tamanho
    this.createPoints();
  }
  
  createPoints() {
    this.points = [];
    
    for (let i = 0; i < this.pointCount; i++) {
      this.points.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        size: Math.random() * 2 + 1
      });
    }
  }
  
  updatePoints() {
    this.points.forEach(point => {
      point.x += point.vx;
      point.y += point.vy;
      
      // Bounce off edges
      if (point.x < 0 || point.x > this.width) {
        point.vx *= -1;
        point.x = Math.max(0, Math.min(this.width, point.x));
      }
      
      if (point.y < 0 || point.y > this.height) {
        point.vy *= -1;
        point.y = Math.max(0, Math.min(this.height, point.y));
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

// Função de inicialização
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
    if (canvas && !window.networkInstances[canvasId]) {
      window.networkInstances[canvasId] = new NetworkAnimation(canvasId);
    }
  });
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initNetworkAnimations);
window.addEventListener('load', initNetworkAnimations);