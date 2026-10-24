/* Utilidades compartidas por los laboratorios interactivos. */
(function () {
  const GP = (window.GP = window.GP || {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  GP.esc = esc;

  GP.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Espera ms milisegundos (0 si el usuario pidió menos movimiento). */
  GP.wait = (ms) => new Promise((r) => setTimeout(r, GP.reducedMotion() ? 0 : ms));

  /* Grupo segmentado accesible (radiogroup). items: [{ value, label: () => texto }] */
  GP.segmented = function (group, items, initial, onChange) {
    let value = initial;
    function render() {
      group.innerHTML = items.map((it) =>
        `<button type="button" class="seg${it.value === value ? ' is-active' : ''}" role="radio" aria-checked="${it.value === value}" tabindex="${it.value === value ? 0 : -1}" data-v="${esc(it.value)}">${esc(it.label())}</button>`).join('');
    }
    function set(v, focus, silent) {
      value = v;
      render();
      if (focus) group.querySelector('.is-active').focus();
      if (!silent && onChange) onChange(v);
    }
    group.addEventListener('click', (ev) => {
      const b = ev.target.closest('.seg');
      if (b) set(b.getAttribute('data-v'), false);
    });
    group.addEventListener('keydown', (ev) => {
      const d = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      ev.preventDefault();
      const i = items.findIndex((it) => it.value === value);
      set(items[(i + d + items.length) % items.length].value, true);
    });
    render();
    return { get: () => value, set: (v) => set(v, false, true), refresh: render };
  };

  /* Lista numerada de pasos. labels(): array de textos. Devuelve { set(n) }: n = paso actual (1…), 0 = ninguno. */
  GP.stepList = function (ol, labels) {
    let current = 0;
    function render() {
      ol.innerHTML = labels().map((t, i) =>
        `<li class="${i + 1 < current ? 'is-past' : i + 1 === current ? 'is-current' : ''}"${i + 1 === current ? ' aria-current="step"' : ''}><span class="step-n" aria-hidden="true">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    }
    render();
    return { set(n) { current = n; render(); }, refresh: render };
  };

  /* Describe un nodo para el estudiante: «× (profundidad 1)». */
  GP.nodeText = (rec) => `${GP.display(rec.node.label)} (${GP.t('lab.depth')} ${rec.depth})`;

  /* Rellena un <figure> con un árbol compacto y su expresión. */
  GP.treeCard = function (root, extra) {
    const fig = document.createElement('figure');
    fig.className = 'tcard';
    const holder = document.createElement('div');
    holder.className = 'tcard-tree';
    holder.append(GP.treeSvg(root, { r: 20, dx: 56, dy: 66, scale: 0.55 }));
    const cap = document.createElement('figcaption');
    cap.innerHTML = `<code>${esc(GP.toExpr(root))}</code><small>${esc(extra || GP.t('lab.stats', { n: GP.size(root), d: GP.depth(root) }))}</small>`;
    fig.append(holder, cap);
    return fig;
  };
})();
