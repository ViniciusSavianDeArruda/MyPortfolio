function SimpleAnime(elements) {
  const nodes = document.querySelectorAll(elements);
  
  if (nodes.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  nodes.forEach((node) => {
    observer.observe(node);
  });
}

// Auto-inicialização para elementos com data-anime
document.addEventListener('DOMContentLoaded', () => {
  SimpleAnime('[data-anime]');
});