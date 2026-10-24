/* Núcleo de GP: construcción, evaluación y utilidades sobre árboles de expresión. */
(function () {
  const GP = (window.GP = window.GP || {});

  /* Problema conductor: f(x) = x² + 2x + 1 */
  GP.DATA = [[-2, 1], [-1, 0], [0, 1], [1, 4], [2, 9]];

  const OPS = {
    '+': { prec: 1, f: (a, b) => a + b },
    '-': { prec: 1, f: (a, b) => a - b },
    '*': { prec: 2, f: (a, b) => a * b },
    '/': { prec: 2, f: (a, b) => (Math.abs(b) < 1e-9 ? 1 : a / b) }, // división protegida
  };
  const FNS = { sin: Math.sin };
  const DISPLAY = { '*': '×', '/': '÷', '-': '−' };
  const disp = (label) => DISPLAY[label] || label.replace(/^-(?=\d)/, '−');

  /* Constructores de nodos */
  GP.op = (label, l, r) => ({ kind: 'op', label, children: [l, r] });
  GP.fn = (label, c) => ({ kind: 'fn', label, children: [c] });
  GP.v = (label) => ({ kind: 'var', label: label || 'x', children: [] });
  GP.c = (value) => ({ kind: 'const', label: String(value), value, children: [] });
  GP.display = disp;

  GP.clone = function clone(n) {
    const copy = Object.assign({}, n);
    copy.children = n.children.map(clone);
    return copy;
  };

  GP.evaluate = function evaluate(n, x) {
    let r;
    if (n.kind === 'var') r = x;
    else if (n.kind === 'const') r = n.value;
    else if (n.kind === 'fn') r = FNS[n.label](evaluate(n.children[0], x));
    else r = OPS[n.label].f(evaluate(n.children[0], x), evaluate(n.children[1], x));
    return Number.isFinite(r) ? r : 0;
  };

  /* Expresión infija con los paréntesis mínimos necesarios. */
  GP.toExpr = function (root) {
    function fmt(n, parentPrec, isRight, parentLabel) {
      if (n.kind === 'var') return n.label;
      if (n.kind === 'const') return n.value < 0 && parentPrec > 0 ? '(' + disp(n.label) + ')' : disp(n.label);
      if (n.kind === 'fn') return n.label + '(' + fmt(n.children[0], 0, false, '') + ')';
      const p = OPS[n.label].prec;
      const s = fmt(n.children[0], p, false, n.label) + ' ' + disp(n.label) + ' ' + fmt(n.children[1], p, true, n.label);
      const need = p < parentPrec || (p === parentPrec && isRight && (parentLabel === '-' || parentLabel === '/'));
      return need ? '(' + s + ')' : s;
    }
    return fmt(root, 0, false, '');
  };

  GP.size = function size(n) { return 1 + n.children.reduce((a, c) => a + size(c), 0); };
  GP.depth = function depth(n) { return n.children.length ? 1 + Math.max(...n.children.map(depth)) : 0; };
  GP.leaves = function leaves(n) { return n.children.length ? n.children.reduce((a, c) => a + leaves(c), 0) : 1; };

  GP.rmse = function (root, data) {
    const d = data || GP.DATA;
    let sum = 0;
    d.forEach(([x, y]) => { const e = y - GP.evaluate(root, x); sum += e * e; });
    return Math.sqrt(sum / d.length);
  };

  /* Disposición: hojas equiespaciadas; cada padre centrado sobre sus hijos.
     Devuelve registros en preorden; el índice de cada registro es su id. */
  GP.layout = function (root, o) {
    const dx = (o && o.dx) || 60;
    const dy = (o && o.dy) || 74;
    const recs = [];
    let leaf = 0;
    (function walk(n, d, parent) {
      const rec = { id: recs.length, node: n, depth: d, parent, x: 0, y: d * dy, childIds: [] };
      recs.push(rec);
      if (!n.children.length) {
        rec.x = leaf++ * dx;
      } else {
        n.children.forEach((c) => { rec.childIds.push(walk(c, d + 1, rec.id).id); });
        rec.x = (recs[rec.childIds[0]].x + recs[rec.childIds[rec.childIds.length - 1]].x) / 2;
      }
      return rec;
    })(root, 0, null);
    return recs;
  };

  GP.subtreeIds = function (recs, id) {
    const out = [id];
    recs[id].childIds.forEach((c) => out.push(...GP.subtreeIds(recs, c)));
    return out;
  };

  /* ---------- Aleatoriedad reproducible ---------- */
  GP.rng = function (seed) {
    let a = (Number(seed) >>> 0) || 1; // mulberry32
    const next = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    next.int = (n) => Math.floor(next() * n);
    next.pick = (arr) => arr[next.int(arr.length)];
    return next;
  };

  /* ---------- Conjuntos del problema: F = {+, −, ×, ÷ protegida}, T = {x, −2, −1, 0, 1, 2} ---------- */
  GP.FUNCS = ['+', '-', '*', '/'];
  GP.CONSTS = [-2, -1, 0, 1, 2];
  GP.randomTerminal = (rng) => {
    const i = rng.int(GP.CONSTS.length + 1);
    return i === 0 ? GP.v('x') : GP.c(GP.CONSTS[i - 1]);
  };

  /* Full: funciones hasta la profundidad objetivo. Grow: puede terminar antes. La raíz siempre es función. */
  GP.randomTree = function (rng, o) {
    const maxDepth = o.maxDepth;
    const pFunc = GP.FUNCS.length / (GP.FUNCS.length + GP.CONSTS.length + 1);
    function make(d) {
      const useFunc = d < maxDepth && (d === 0 || o.method === 'full' || rng() < pFunc);
      if (!useFunc) return GP.randomTerminal(rng);
      return GP.op(rng.pick(GP.FUNCS), make(d + 1), make(d + 1));
    }
    return make(0);
  };

  GP.initPopulation = (rng, size, maxDepth, method) =>
    Array.from({ length: size }, () => GP.randomTree(rng, { maxDepth, method }));

  /* ---------- Rutas, subárboles y operadores ---------- */
  GP.pathTo = function (recs, id) {
    const p = [];
    let r = recs[id];
    while (r.parent !== null) {
      const par = recs[r.parent];
      p.unshift(par.childIds.indexOf(r.id));
      r = par;
    }
    return p;
  };
  GP.getAt = (root, path) => path.reduce((n, i) => n.children[i], root);
  GP.setAt = function (root, path, sub) {
    if (!path.length) return GP.clone(sub);
    const copy = GP.clone(root);
    const parent = GP.getAt(copy, path.slice(0, -1));
    parent.children[path[path.length - 1]] = GP.clone(sub);
    return copy;
  };

  /* Intercambia los subárboles en pa (de a) y pb (de b); devuelve los dos descendientes. */
  GP.crossover = (a, pa, b, pb) => [GP.setAt(a, pa, GP.getAt(b, pb)), GP.setAt(b, pb, GP.getAt(a, pa))];

  /* Torneo de tamaño k: k índices distintos al azar; gana el menor fitness (se minimiza el error). */
  GP.tournament = function (rng, fits, k) {
    const idx = fits.map((_, i) => i);
    for (let i = 0; i < k; i++) { // Fisher–Yates parcial
      const j = i + rng.int(idx.length - i);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const picked = idx.slice(0, k);
    const winner = picked.reduce((best, i) => (fits[i] < fits[best] ? i : best), picked[0]);
    return { picked, winner };
  };

  /* ---------- Analizador de expresiones infijas ---------- */
  GP.parse = function (src) {
    const s = src.replace(/×|·/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
    if (!s) throw new Error('empty');
    let i = 0;
    const peek = () => s[i];
    function expr() {
      let n = term();
      while (peek() === '+' || peek() === '-') { const o = s[i++]; n = GP.op(o, n, term()); }
      return n;
    }
    function term() {
      let n = unary();
      while (peek() === '*' || peek() === '/') { const o = s[i++]; n = GP.op(o, n, unary()); }
      return n;
    }
    function unary() {
      if (peek() === '-') { i++; return GP.op('-', GP.c(0), unary()); }
      return power();
    }
    function power() {
      const base = atom();
      if (peek() !== '^') return base;
      i++;
      const m = /^\d+/.exec(s.slice(i));
      if (!m) throw new Error('exponent');
      i += m[0].length;
      const e = Number(m[0]);
      if (e < 1 || e > 6) throw new Error('exponent');
      let n = GP.clone(base);
      for (let k = 1; k < e; k++) n = GP.op('*', n, GP.clone(base));
      return n;
    }
    function atom() {
      const c = peek();
      if (c === '(') { i++; const n = expr(); if (peek() !== ')') throw new Error('paren'); i++; return n; }
      if (c === 'x' || c === 'X') { i++; return GP.v('x'); }
      const m = /^\d+(\.\d+)?/.exec(s.slice(i));
      if (!m) throw new Error('token');
      i += m[0].length;
      return GP.c(Number(m[0]));
    }
    const tree = expr();
    if (i !== s.length) throw new Error('trailing');
    return tree;
  };

  GP.fmtNum = function (v) {
    const r = Math.round(v * 100) / 100;
    return String(Object.is(r, -0) ? 0 : r).replace('-', '−');
  };
})();
