class NetworkAnimation {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    
    // Configurações padrão
    this.config = {
      particleCount: options.particleCount || 100,
      maxDistance: options.maxDistance || 120,
      particleSpeed: options.particleSpeed || 0.5,
      particleSize: options.particleSize || 2,
      connectionOpacity: options.connectionOpacity || 0.3,
      particleOpacity: options.particleOpacity || 0.7,
      ...options
    };

    this.mouse = { x: null, y: null };
    this.animationId = null;
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.animate();
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 1
      });
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }

  drawParticles() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const particleColor = theme === 'light' ? '50, 50, 50' : '255, 255, 255';
    
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${particleColor}, ${this.config.particleOpacity})`;
      this.ctx.fill();
    });
  }

  drawConnections() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const lineColor = theme === 'light' ? '100, 100, 100' : '255, 255, 255';
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.maxDistance) {
          const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;
          
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  drawMouseConnections() {
    if (this.mouse.x === null || this.mouse.y === null) return;
    
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const accentColor = theme === 'light' ? '0, 173, 111' : '0, 173, 111';
    
    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.maxDistance * 1.5) {
        const opacity = (1 - distance / (this.config.maxDistance * 1.5)) * 0.6;
        
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    this.drawMouseConnections();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  setupEventListeners() {
    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Resize observer
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    // Theme change observer
    const observer = new MutationObserver(() => {
      // Redraw on theme change
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize network animations for all canvases
document.addEventListener('DOMContentLoaded', () => {
  // Main section
  if (document.getElementById('network-canvas')) {
    new NetworkAnimation('network-canvas', {
      particleCount: 120,
      maxDistance: 150,
      particleSpeed: 0.3,
      connectionOpacity: 0.4
    });
  }

  // About section
  if (document.getElementById('network-canvas-sobre')) {
    new NetworkAnimation('network-canvas-sobre', {
      particleCount: 80,
      maxDistance: 120,
      particleSpeed: 0.2,
      connectionOpacity: 0.3
    });
  }

  // Skills section
  if (document.getElementById('network-canvas-skills')) {
    new NetworkAnimation('network-canvas-skills', {
      particleCount: 90,
      maxDistance: 130,
      particleSpeed: 0.25,
      connectionOpacity: 0.35
    });
  }

  // Projects section
  if (document.getElementById('network-canvas-projetos')) {
    new NetworkAnimation('network-canvas-projetos', {
      particleCount: 100,
      maxDistance: 140,
      particleSpeed: 0.3,
      connectionOpacity: 0.4
    });
  }

  // Contact section
  if (document.getElementById('network-canvas-contato')) {
    new NetworkAnimation('network-canvas-contato', {
      particleCount: 70,
      maxDistance: 110,
      particleSpeed: 0.2,
      connectionOpacity: 0.3
    });
  }
});