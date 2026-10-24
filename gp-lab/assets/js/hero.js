/* Animación conceptual del hero: población → evaluación → selección → cruce → descendientes → solución.
   Los errores son RMSE reales y el cruce intercambia subárboles reales; no es una ejecución completa de GP. */
(function () {
  const GP = (window.GP = window.GP || {});
  const NS = 'http://www.w3.org/2000/svg';
  const W = 600;
  const STAGES = 6;
  const INTERVAL = 4200;

  const x = () => GP.v('x');
  const sq = () => GP.op('*', x(), x());
  const population = [
    GP.op('*', GP.op('+', x(), GP.c(1)), x()),               // (x + 1) × x
    GP.op('+', sq(), GP.c(2)),                               // x × x + 2
    GP.op('+', sq(), GP.op('*', GP.c(2), x())),              // x × x + 2 × x
    GP.op('-', sq(), x()),                                   // x × x − x
  ];
  const target = GP.op('+', GP.op('+', sq(), GP.op('*', GP.c(2), x())), GP.c(1)); // x² + 2x + 1

  const scores = population.map((t) => GP.rmse(t));
  const order = scores.map((s, i) => i).sort((a, b) => scores[a] - scores[b]);
  const parentA = population[order[0]];
  const parentB = population[order[1]];
  const idxA = 1; // hijo derecho de A
  const idxB = 0; // hijo izquierdo de B
  const childOne = GP.clone(parentA); childOne.children[idxA] = GP.clone(parentB.children[idxB]);
  const childTwo = GP.clone(parentB); childTwo.children[idxB] = GP.clone(parentA.children[idxA]);

  function e(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function place(layer, root, cx, cy, w, h, cls) {
    const built = GP.buildTree(root, { r: 15, dx: 44, dy: 52 });
    const bb = built.bbox;
    const s = Math.min(w / bb.w, h / bb.h, 1.15);
    const tx = cx - s * (bb.x0 + bb.w / 2);
    const ty = cy - s * (bb.y0 + bb.h / 2);
    const wrap = e('g', { class: 'sc-tree ' + (cls || ''), transform: `translate(${tx} ${ty}) scale(${s})` });
    wrap.append(built.g);
    layer.append(wrap);
    built.map = (px, py) => [tx + s * px, ty + s * py];
    return built;
  }

  function subtreeBox(layer, built, id, cls) {
    const ids = GP.subtreeIds(built.recs, id);
    const xs = ids.map((i) => built.recs[i].x);
    const ys = ids.map((i) => built.recs[i].y);
    const m = built.r * 1.45;
    const [x0, y0] = built.map(Math.min(...xs) - m, Math.min(...ys) - m);
    const [x1, y1] = built.map(Math.max(...xs) + m, Math.max(...ys) + m);
    layer.append(e('rect', { class: 'sc-box ' + cls, x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 10 }));
    return { x0, y0, x1, y1 };
  }

  const text = (layer, str, px, py, cls) => layer.append(e('text', { class: cls, x: px, y: py }, str));

  function scene(layer, stage) {
    const cell = W / 4;
    if (stage <= 2) {
      const maxErr = Math.max(...scores);
      population.forEach((tree, i) => {
        const cx = cell * i + cell / 2;
        const isParent = stage === 2 && order.indexOf(i) < 2;
        const cls = stage === 2 ? (isParent ? 'is-parent' : 'is-dim') : '';
        place(layer, tree, cx, 105, cell - 18, 150, cls);
        text(layer, 'P' + (i + 1), cx, 214, 'sc-name');
        text(layer, GP.toExpr(tree), cx, 234, 'sc-mono');
        if (stage >= 1) {
          const bw = cell - 50;
          layer.append(e('rect', { class: 'sc-track' + (stage === 2 && !isParent ? ' is-dim' : ''), x: cx - bw / 2, y: 268, width: bw, height: 8, rx: 4 }));
          layer.append(e('rect', { class: 'sc-bar' + (isParent ? ' is-parent' : '') + (stage === 2 && !isParent ? ' is-dim' : ''), x: cx - bw / 2, y: 268, width: Math.max(6, bw * scores[i] / maxErr), height: 8, rx: 4 }));
          text(layer, GP.t('hero.err') + ' ' + GP.fmtNum(scores[i]), cx, 296, 'sc-small' + (stage === 2 && !isParent ? ' is-dim' : ''));
        }
        if (isParent) text(layer, GP.t('hero.parent'), cx, 322, 'sc-tag');
      });
    } else if (stage === 3) {
      const a = place(layer, parentA, 150, 135, 250, 190);
      const b = place(layer, parentB, 450, 135, 250, 190);
      subtreeBox(layer, a, a.recs[0].childIds[idxA], 'is-a');
      subtreeBox(layer, b, b.recs[0].childIds[idxB], 'is-b');
      text(layer, '⇄', 300, 148, 'sc-swap');
      text(layer, GP.t('hero.parentA'), 150, 262, 'sc-name');
      text(layer, GP.toExpr(parentA), 150, 284, 'sc-mono');
      text(layer, GP.t('hero.parentB'), 450, 262, 'sc-name');
      text(layer, GP.toExpr(parentB), 450, 284, 'sc-mono');
      text(layer, GP.t('hero.subA'), 150, 316, 'sc-tag is-a');
      text(layer, GP.t('hero.subB'), 450, 316, 'sc-tag is-b');
    } else if (stage === 4) {
      place(layer, childOne, 150, 135, 250, 190, 'is-child');
      place(layer, childTwo, 450, 135, 250, 190, 'is-child');
      text(layer, GP.t('hero.child', { n: 1 }), 150, 262, 'sc-name');
      text(layer, GP.toExpr(childOne), 150, 284, 'sc-mono');
      text(layer, GP.t('hero.child', { n: 2 }), 450, 262, 'sc-name');
      text(layer, GP.toExpr(childTwo), 450, 284, 'sc-mono');
      text(layer, '⇄', 300, 148, 'sc-swap');
    } else {
      place(layer, target, 300, 125, 420, 210, 'is-solution');
      text(layer, GP.toExpr(target), 300, 262, 'sc-mono sc-big');
      text(layer, 'f(x) = x² + 2x + 1', 300, 296, 'sc-name');
    }
  }

  function init() {
    const svg = document.getElementById('hero-scene');
    if (!svg) return;
    const layer = e('g', { class: 'sc-layer' });
    svg.append(layer);
    const play = document.getElementById('hero-play');
    const prev = document.getElementById('hero-prev');
    const next = document.getElementById('hero-next');
    const dots = document.getElementById('hero-dots');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stage = 0;
    let timer = null;
    let inView = true;

    for (let i = 0; i < STAGES; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'hero-dot';
      d.addEventListener('click', () => { go(i); });
      dots.append(d);
    }

    function render() {
      layer.replaceChildren();
      layer.classList.remove('stage-in');
      void layer.getBoundingClientRect(); // reinicia la animación de entrada
      layer.classList.add('stage-in');
      scene(layer, stage);
      layer.setAttribute('transform', stage === 0 ? 'translate(0 34)' : ''); // centra la población inicial, que no tiene barras
      const info = GP.t('hero.stages')[stage];
      document.getElementById('hero-stage-title').textContent = info.t;
      document.getElementById('hero-stage-text').textContent = info.d;
      document.getElementById('hero-step').textContent = GP.t('hero.step', { n: stage + 1, total: STAGES });
      [...dots.children].forEach((d, i) => {
        d.classList.toggle('is-active', i === stage);
        d.setAttribute('aria-label', GP.t('hero.goStage', { n: i + 1 }));
        d.setAttribute('aria-current', i === stage ? 'step' : 'false');
      });
    }

    function go(n) { stage = (n + STAGES) % STAGES; render(); }
    function playing() { return timer !== null; }
    function setPlaying(on) {
      clearInterval(timer);
      timer = on ? setInterval(() => { if (inView && !document.hidden) go(stage + 1); }, INTERVAL) : null;
      play.setAttribute('aria-pressed', String(on));
      play.querySelector('.ctl-icon').textContent = on ? '❚❚' : '▶';
      play.setAttribute('aria-label', GP.t(on ? 'hero.pause' : 'hero.play'));
    }

    play.addEventListener('click', () => setPlaying(!playing()));
    prev.addEventListener('click', () => { go(stage - 1); });
    next.addEventListener('click', () => { go(stage + 1); });
    svg.setAttribute('role', 'img');

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { inView = en[0].isIntersecting; }).observe(svg);
    }

    GP.onLang(() => {
      svg.setAttribute('aria-label', GP.t('hero.sceneLabel'));
      prev.setAttribute('aria-label', GP.t('hero.prev'));
      next.setAttribute('aria-label', GP.t('hero.next'));
      play.setAttribute('aria-label', GP.t(playing() ? 'hero.pause' : 'hero.play'));
      render();
    });
    setPlaying(!reduced);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
