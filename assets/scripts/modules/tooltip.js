class Tooltip {
  constructor() {
    this.elements = document.querySelectorAll('[title]');
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      this.setupTooltip(element);
    });
  }

  setupTooltip(element) {
    const originalTitle = element.getAttribute('title');
    
    // Remove default tooltip
    element.removeAttribute('title');
    
    // Store original title
    element.setAttribute('data-tooltip', originalTitle);

    element.addEventListener('mouseenter', (e) => {
      this.showTooltip(e.target);
    });

    element.addEventListener('mouseleave', (e) => {
      this.hideTooltip(e.target);
    });
  }

  showTooltip(element) {
    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 10 + 'px';

    // Add to element for cleanup
    element._tooltip = tooltip;

    // Animate in
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
  }

  hideTooltip(element) {
    const tooltip = element._tooltip;
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(5px)';
      
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        element._tooltip = null;
      }, 200);
    }
  }
}

// Add CSS for custom tooltips
const tooltipStyles = `
  .custom-tooltip {
    position: fixed;
    z-index: 10000;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    opacity: 0;
    transform: translateY(5px);
    transition: all 0.2s ease;
    pointer-events: none;
    white-space: nowrap;
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

// Initialize tooltips
document.addEventListener('DOMContentLoaded', () => {
  new Tooltip();
});