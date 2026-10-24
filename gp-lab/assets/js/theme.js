/* Tema claro/oscuro con persistencia. El atributo inicial se fija en un script de <head> para evitar parpadeo. */
(function () {
  const GP = (window.GP = window.GP || {});
  const KEY = 'gp-theme';
  const root = document.documentElement;

  GP.theme = () => root.getAttribute('data-theme') || 'light';

  function sync() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = GP.theme() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', GP.t(dark ? 'theme.toLight' : 'theme.toDark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0e1a2b' : '#f5f7fb');
  }

  function set(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* ignorar */ }
    sync();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => set(GP.theme() === 'dark' ? 'light' : 'dark'));
    GP.onLang(sync);
  });
})();
