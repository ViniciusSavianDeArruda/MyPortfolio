class ThemeToggle {
  constructor() {
    this.button = document.getElementById('theme-toggle');
    this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
    
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add click event listener
    if (this.button) {
      this.button.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  setTheme(theme) {
    // Add transition class to prevent flickering
    document.documentElement.classList.add('theme-transitioning');
    
    // Set the theme
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Update button icon if needed
    this.updateButtonIcon(theme);
    
    // Add pulse effect
    if (this.button) {
      this.button.classList.add('pulse');
      setTimeout(() => {
        this.button.classList.remove('pulse');
      }, 300);
    }
    
    // Remove transition class after a short delay
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 50);
    
    // Store theme preference
    this.setStoredTheme(theme);
    
    // Emit custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme }
    }));
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateButtonIcon(theme) {
    if (!this.button) return;
    
    const icon = this.button.querySelector('.theme-icon svg');
    if (!icon) return;

    // You could update the icon here if needed
    // For now, we'll just add a rotation effect
    if (theme === 'light') {
      icon.style.transform = 'rotate(180deg)';
    } else {
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeToggle();
});