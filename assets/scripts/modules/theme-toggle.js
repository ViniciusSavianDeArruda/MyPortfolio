// Theme Toggle System
class ThemeToggle {
  constructor() {
    this.button = document.querySelector('.theme-toggle');
    this.currentTheme = 'dark';
    this.init();
  }

  init() {
    // Carregar tema salvo ou usar padrão
    this.loadSavedTheme();
    
    // Criar botão se não existir
    if (!this.button) {
      this.createToggleButton();
    }
    
    this.bindEvents();
    this.updateIcon();
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.innerHTML = `
      <span class="theme-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
    `;
    
    document.body.appendChild(button);
    this.button = button;
  }

  bindEvents() {
    this.button.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Animação do botão
    this.button.classList.add('pulse');
    setTimeout(() => {
      this.button.classList.remove('pulse');
    }, 300);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    
    // Aplicar classe de transição
    document.documentElement.classList.add('theme-transitioning');
    
    // Definir atributo do tema
    document.documentElement.setAttribute('data-theme', theme);
    
    // Salvar preferência
    localStorage.setItem('theme', theme);
    
    // Atualizar ícone
    this.updateIcon();
    
    // Remover classe de transição
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  }

  updateIcon() {
    const icon = this.button.querySelector('.theme-icon svg');
    
    if (this.currentTheme === 'light') {
      // Ícone de lua para tema claro
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none"/>
      `;
    } else {
      // Ícone de sol para tema escuro
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      `;
    }
  }
}

// Função de inicialização
function initThemeToggle() {
  if (!window.themeToggleInstance) {
    window.themeToggleInstance = new ThemeToggle();
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', initThemeToggle);