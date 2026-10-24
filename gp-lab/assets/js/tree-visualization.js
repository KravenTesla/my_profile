/* Visualización de árboles en SVG. buildTree dibuja; TreeView añade selección, visibilidad y valores. */
(function () {
  const GP = (window.GP = window.GP || {});
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
    return e;
  }

  /* Forma por tipo: no depender solo del color. */
  function shape(kind, r) {
    if (kind === 'op') return el('circle', { class: 'shape', r });
    if (kind === 'fn') {
      const a = r * 1.3;
      return el('polygon', { class: 'shape', points: `0,${-a} ${a},0 0,${a} ${-a},0` });
    }
    if (kind === 'var') return el('rect', { class: 'shape', x: -r, y: -r * 0.85, width: r * 2, height: r * 1.7, rx: r * 0.55 });
    const h = r * 0.95; // hexágono para constantes
    const pts = [[-r, 0], [-h * 0.55, -h], [h * 0.55, -h], [r, 0], [h * 0.55, h], [-h * 0.55, h]].map((p) => p.join(',')).join(' ');
    return el('polygon', { class: 'shape', points: pts });
  }

  /* Dibuja el árbol y devuelve { g, recs, bbox }. */
  GP.buildTree = function (root, opts) {
    const o = Object.assign({ r: 20, dx: 60, dy: 74, interactive: false }, opts);
    const recs = GP.layout(root, o);
    const g = el('g', { class: 'tree' });
    const edges = el('g', { class: 'tedges' });
    const nodes = el('g', { class: 'tnodes' });
    g.append(edges, nodes);

    recs.forEach((rec) => {
      if (rec.parent !== null) {
        const p = recs[rec.parent];
        const my = (p.y + rec.y) / 2;
        rec.edgeEl = el('path', { class: 'tedge', d: `M${p.x} ${p.y + o.r} C${p.x} ${my} ${rec.x} ${my} ${rec.x} ${rec.y - o.r}` });
        edges.append(rec.edgeEl);
      }
      const n = el('g', { class: 'tnode kind-' + rec.node.kind, transform: `translate(${rec.x} ${rec.y})`, 'data-id': rec.id });
      const inner = el('g', { class: 'tn-in' });
      const label = el('text', { class: 'tlabel' });
      label.textContent = GP.display(rec.node.label);
      const val = el('text', { class: 'tval', x: o.r + 3, y: -o.r + 4 });
      inner.append(shape(rec.node.kind, o.r), label, val);
      n.append(inner);
      nodes.append(n);
      rec.el = n;
      rec.valEl = val;
    });

    const xs = recs.map((r) => r.x);
    const ys = recs.map((r) => r.y);
    const m = o.r * 1.6;
    const bbox = { x0: Math.min(...xs) - m, y0: Math.min(...ys) - m, x1: Math.max(...xs) + m, y1: Math.max(...ys) + m };
    bbox.w = bbox.x1 - bbox.x0;
    bbox.h = bbox.y1 - bbox.y0;
    return { g, recs, bbox, r: o.r };
  };

  /* Árbol estático y compacto como <svg> independiente. */
  GP.treeSvg = function (root, opts) {
    const built = GP.buildTree(root, opts);
    const b = built.bbox;
    const svg = el('svg', { class: 'mini-tree', viewBox: `${b.x0} ${b.y0} ${b.w} ${b.h}`, role: 'img' });
    svg.append(built.g);
    svg.style.width = Math.round(b.w * ((opts && opts.scale) || 0.6)) + 'px';
    svg.built = built;
    return svg;
  };

  /* Árbol interactivo dentro de un <svg>. */
  GP.TreeView = class TreeView {
    constructor(svg, root, opts) {
      this.svg = svg;
      this.opts = Object.assign({ onSelect: null }, opts);
      this.selected = null;
      this.showValues = false;
      this.locked = false; // true: ignora clics (modo automático)
      this.x = 0;
      svg.addEventListener('click', (e) => this._pick(e.target));
      svg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._pick(e.target); }
      });
      this.setTree(root);
    }

    _pick(target) {
      if (this.locked) return;
      const n = target.closest && target.closest('.tnode');
      if (n && !n.classList.contains('is-hidden')) this.select(Number(n.getAttribute('data-id')));
    }

    idAt(path) { return path.reduce((id, i) => this.recs[id].childIds[i], 0); }

    /* Añade o quita una clase CSS en un conjunto de nodos (ids) y en sus aristas. null limpia. */
    mark(ids, cls) {
      this.recs.forEach((rec) => {
        const on = ids !== null && ids.includes(rec.id);
        rec.el.classList.toggle(cls, on);
        if (rec.edgeEl) rec.edgeEl.classList.toggle(cls, on);
      });
    }

    /* Recuadro punteado alrededor del subárbol de id; devuelve el <rect>. */
    box(id, cls) {
      const ids = GP.subtreeIds(this.recs, id);
      const xs = ids.map((i) => this.recs[i].x);
      const ys = ids.map((i) => this.recs[i].y);
      const m = this.built.r * 1.5;
      const x0 = Math.min(...xs) - m;
      const y0 = Math.min(...ys) - m;
      const rect = el('rect', { class: 'sub-box ' + cls, x: x0, y: y0, width: Math.max(...xs) + m - x0, height: Math.max(...ys) + m - y0, rx: 12 });
      this.overlay.append(rect);
      return rect;
    }

    clearBoxes() { this.overlay.replaceChildren(); }

    setTree(root) {
      this.root = root;
      this.selected = null;
      this.visible = null;
      this.built = GP.buildTree(root, this.opts);
      this.recs = this.built.recs;
      const b = this.built.bbox;
      this.overlay = el('g', { class: 'toverlay' });
      this.svg.replaceChildren(this.built.g, this.overlay);
      this.svg.setAttribute('viewBox', `${b.x0} ${b.y0} ${b.w} ${b.h}`);
      this.svg.style.maxWidth = Math.round(b.w * 1.35) + 'px';
      this.labelNodes();
      this.setValues(this.showValues, this.x);
    }

    labelNodes() {
      this.recs.forEach((rec) => {
        rec.el.setAttribute('tabindex', '0');
        rec.el.setAttribute('role', 'button');
        rec.el.setAttribute('aria-label', GP.t('trees.nodeLabel', {
          kind: GP.t('trees.kind.' + rec.node.kind), label: GP.display(rec.node.label), depth: rec.depth,
        }));
      });
    }

    select(id) {
      this.selected = id;
      const sub = id === null ? [] : GP.subtreeIds(this.recs, id);
      this.recs.forEach((rec) => {
        rec.el.classList.toggle('is-selected', rec.id === id);
        const inSub = sub.includes(rec.id) && rec.id !== id;
        rec.el.classList.toggle('in-subtree', inSub);
        if (rec.edgeEl) rec.edgeEl.classList.toggle('in-subtree', sub.includes(rec.id));
        rec.el.setAttribute('aria-pressed', String(rec.id === id));
      });
      if (this.opts.onSelect) this.opts.onSelect(id === null ? null : this.recs[id]);
    }

    /* ids: Set con los nodos visibles, o null para mostrarlos todos. */
    setVisible(ids) {
      this.visible = ids;
      this.recs.forEach((rec) => {
        const hide = ids !== null && !ids.has(rec.id);
        rec.el.classList.toggle('is-hidden', hide);
        rec.el.setAttribute('tabindex', hide ? '-1' : '0');
        rec.el.setAttribute('aria-hidden', String(hide));
        if (rec.edgeEl) rec.edgeEl.classList.toggle('is-hidden', hide);
      });
    }

    setValues(show, x) {
      this.showValues = show;
      this.x = x;
      this.svg.classList.toggle('show-values', show);
      if (!show) return;
      this.recs.forEach((rec) => { rec.valEl.textContent = GP.fmtNum(GP.evaluate(rec.node, x)); });
    }
  };
})();
