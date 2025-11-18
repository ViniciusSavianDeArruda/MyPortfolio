// Tooltip System
class TooltipManager {
  constructor() {
    this.isTooltipActive = false;
    this.currentElement = null;
    this.init();
  }

  init() {
    this.createTooltipContainer();
    this.bindEvents();
  }

  createTooltipContainer() {
    if (!document.getElementById('tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.id = 'tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        white-space: nowrap;
      `;
      document.body.appendChild(tooltip);
    }
  }

  bindEvents() {
    document.addEventListener('mouseover', (e) => {
      const element = e.target.closest('[title], [data-tooltip]');
      if (element && element !== this.currentElement) {
        this.showTooltip(e, element);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const element = e.target.closest('[title], [data-tooltip]');
      if (element && element === this.currentElement) {
        this.hideTooltip();
      }
    });

    document.addEventListener('mousemove', (e) => {
      // Só atualizar posição se tooltip estiver ativo
      if (this.isTooltipActive) {
        this.updateTooltipPosition(e);
      }
    });
  }

  showTooltip(event, element) {
    const tooltip = document.getElementById('tooltip');
    const text = element.getAttribute('data-tooltip') || element.getAttribute('title');
    
    if (text) {
      // Remover title para evitar tooltip nativo
      if (element.getAttribute('title')) {
        element.setAttribute('data-original-title', element.getAttribute('title'));
        element.removeAttribute('title');
      }
      
      this.currentElement = element;
      this.isTooltipActive = true;
      tooltip.textContent = text;
      tooltip.style.opacity = '1';
      this.updateTooltipPosition(event);
    }
  }

  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    this.isTooltipActive = false;
    this.currentElement = null;
    tooltip.style.opacity = '0';
    
    // Restaurar title original
    document.querySelectorAll('[data-original-title]').forEach(el => {
      el.setAttribute('title', el.getAttribute('data-original-title'));
      el.removeAttribute('data-original-title');
    });
  }

  updateTooltipPosition(event) {
    const tooltip = document.getElementById('tooltip');
    if (this.isTooltipActive && tooltip.style.opacity === '1') {
      const x = event.pageX + 10;
      const y = event.pageY - 35;
      
      // Garantir que o tooltip não saia da tela
      const tooltipRect = tooltip.getBoundingClientRect();
      const maxX = window.innerWidth - tooltipRect.width - 10;
      const maxY = window.innerHeight - tooltipRect.height - 10;
      
      tooltip.style.left = Math.min(x, maxX) + 'px';
      tooltip.style.top = Math.max(y, 10) + 'px';
    }
  }
}

// Função de inicialização - DESABILITADA TEMPORARIAMENTE
function initTooltip() {
  // Remove qualquer tooltip existente que possa estar causando problemas
  const existingTooltip = document.getElementById('tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  console.log('Tooltip system disabled - existing tooltips removed');
  return;
  
  if (!window.tooltipManager) {
    window.tooltipManager = new TooltipManager();
  }
}

// Executar limpeza na inicialização
document.addEventListener('DOMContentLoaded', initTooltip);
window.addEventListener('load', initTooltip);