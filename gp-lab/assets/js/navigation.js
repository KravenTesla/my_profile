/* Navegación horizontal: menú móvil, enlace activo según la sección visible y cambio de idioma. */
(function () {
  const GP = (window.GP = window.GP || {});

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('primary-nav');
    const links = [...nav.querySelectorAll('a[href^="#"]')];

    function setMenu(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', GP.t(open ? 'nav.menuClose' : 'nav.menuOpen'));
    }
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.addEventListener('click', (ev) => { if (ev.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });

    const btn = document.getElementById('language-toggle');
    btn.addEventListener('click', () => GP.setLang(GP.lang() === 'es' ? 'en' : 'es'));
    GP.onLang(() => {
      btn.textContent = GP.t('lang.label');
      btn.setAttribute('aria-label', GP.t('lang.aria'));
      nav.setAttribute('aria-label', GP.t('nav.aria'));
      setMenu(nav.classList.contains('open'));
    });

    if ('IntersectionObserver' in window) {
      const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
          const a = map.get(en.target.id);
          if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
    }

    document.getElementById('current-year').textContent = new Date().getFullYear();
  });
})();
