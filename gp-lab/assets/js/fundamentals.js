/* Fundamentos: vocabulario (pestañas), comparación GA/GP y diagrama del ciclo evolutivo. */
(function () {
  const GP = (window.GP = window.GP || {});
  const NS = 'http://www.w3.org/2000/svg';
  const TERMS = ['pop', 'ind', 'rep', 'fit', 'gen', 'sel', 'rpr', 'mut', 'cro'];

  function e(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* ---------- Vocabulario ---------- */
  function initTerms() {
    const tabs = document.getElementById('term-tabs');
    const panel = document.getElementById('term-panel');
    if (!tabs) return;
    let current = 0;

    function render() {
      tabs.innerHTML = TERMS.map((id, i) => `<button type="button" role="tab" class="term-tab${i === current ? ' is-active' : ''}" id="term-tab-${id}" aria-selected="${i === current}" aria-controls="term-panel" tabindex="${i === current ? 0 : -1}" data-i="${i}">${GP.t(`term.${id}.t`)}</button>`).join('');
      const id = TERMS[current];
      panel.setAttribute('aria-labelledby', 'term-tab-' + id);
      panel.innerHTML = `<h4>${GP.t(`term.${id}.t`)}</h4><p>${GP.t(`term.${id}.d`)}</p>
        <p class="term-example"><span class="term-example-label">${GP.t('basics.example')}</span> ${GP.t(`term.${id}.e`)}</p>`;
    }

    function select(i, focus) {
      current = (i + TERMS.length) % TERMS.length;
      render();
      if (focus) document.getElementById('term-tab-' + TERMS[current]).focus();
    }

    tabs.addEventListener('click', (ev) => {
      const b = ev.target.closest('.term-tab');
      if (b) select(Number(b.getAttribute('data-i')), false);
    });
    tabs.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); select(current + 1, true); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); select(current - 1, true); }
      else if (ev.key === 'Home') { ev.preventDefault(); select(0, true); }
      else if (ev.key === 'End') { ev.preventDefault(); select(TERMS.length - 1, true); }
    });
    GP.onLang(render);
  }

  /* ---------- GA frente a GP ---------- */
  function initCompare() {
    const vec = document.getElementById('ga-vector');
    const svg = document.getElementById('gp-tree');
    if (!vec) return;
    vec.innerHTML = ['a', 'b', 'c'].map((n, i) => `<span class="gene"><small>${n}</small><b>${[1, 2, 1][i]}</b></span>`).join('');
    const sq = () => GP.op('*', GP.v('x'), GP.v('x'));
    const tree = GP.op('+', GP.op('+', sq(), GP.op('*', GP.c(2), GP.v('x'))), GP.c(1));
    const built = GP.buildTree(tree, { r: 17, dx: 48, dy: 58 });
    const b = built.bbox;
    svg.replaceChildren(built.g);
    svg.setAttribute('viewBox', `${b.x0} ${b.y0} ${b.w} ${b.h}`);
  }

  /* ---------- Ciclo evolutivo ---------- */
  function initCycle() {
    const svg = document.getElementById('cycle-svg');
    const info = document.getElementById('cycle-info');
    if (!svg) return;
    const cx = 280;
    const cy = 178;
    const R = 115;
    const rr = 27;
    const ringCount = 5;
    let current = 0;
    const rad = (d) => (d * Math.PI) / 180;
    const pos = (i) => {
      if (i === 0) return [cx, cy];
      const a = rad(-90 + (i - 1) * 72);
      return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    };

    function build() {
      svg.replaceChildren();
      const defs = e('defs');
      const marker = e('marker', { id: 'cy-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
      marker.append(e('path', { d: 'M0 0 L10 5 L0 10 z', class: 'cy-arrowhead' }));
      defs.append(marker);
      svg.append(defs);

      // flechas del anillo (sentido horario) y entrada desde el centro
      for (let i = 0; i < ringCount; i++) {
        const a0 = -90 + i * 72 + 17;
        const a1 = -90 + (i + 1) * 72 - 17;
        const p0 = [cx + R * Math.cos(rad(a0)), cy + R * Math.sin(rad(a0))];
        const p1 = [cx + R * Math.cos(rad(a1)), cy + R * Math.sin(rad(a1))];
        svg.append(e('path', { class: 'cy-arrow', d: `M${p0[0]} ${p0[1]} A${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`, 'marker-end': 'url(#cy-arrow)' }));
      }
      svg.append(e('path', { class: 'cy-arrow', d: `M${cx} ${cy - 40} L${cx} ${cy - R + rr + 6}`, 'marker-end': 'url(#cy-arrow)' }));

      const steps = GP.t('cycle.steps');
      steps.forEach((s, idx) => {
        // índice 0 del arreglo = Inicializar (centro); 1..5 = anillo
        const [px, py] = pos(idx);
        const center = idx === 0;
        const g = e('g', { class: 'cy-node' + (idx === current ? ' is-active' : ''), tabindex: 0, role: 'button', 'aria-pressed': String(idx === current), 'aria-label': `${idx}. ${s.t}`, 'data-i': idx });
        g.append(e('circle', { class: 'cy-circle', cx: px, cy: py, r: center ? 38 : rr }));
        g.append(e('text', { class: 'cy-num', x: px, y: py }, String(idx)));
        let lx = px;
        let ly;
        let anchor = 'middle';
        if (center) { ly = py + 60; } else {
          const a = rad(-90 + (idx - 1) * 72);
          lx = cx + (R + 44) * Math.cos(a);
          ly = cy + (R + 44) * Math.sin(a);
          if (Math.cos(a) > 0.3) anchor = 'start'; else if (Math.cos(a) < -0.3) anchor = 'end';
          if (anchor !== 'middle') lx = px + (anchor === 'start' ? rr + 10 : -rr - 10);
          if (anchor !== 'middle') ly = py;
        }
        g.append(e('text', { class: 'cy-label', x: lx, y: ly, 'text-anchor': anchor }, s.t));
        svg.append(g);
      });
    }

    function show() {
      const s = GP.t('cycle.steps')[current];
      info.innerHTML = `<h4><span class="cy-badge">${current}</span>${s.t}</h4><p>${s.d}</p>`;
      svg.querySelectorAll('.cy-node').forEach((n) => {
        const on = Number(n.getAttribute('data-i')) === current;
        n.classList.toggle('is-active', on);
        n.setAttribute('aria-pressed', String(on));
      });
    }

    function pick(t) {
      const n = t.closest && t.closest('.cy-node');
      if (n) { current = Number(n.getAttribute('data-i')); show(); }
    }
    svg.addEventListener('click', (ev) => pick(ev.target));
    svg.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(ev.target); }
    });
    GP.onLang(() => { build(); show(); });
  }

  document.addEventListener('DOMContentLoaded', () => { initTerms(); initCompare(); initCycle(); });
})();
