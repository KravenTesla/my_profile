/* Sección «Aplicaciones»: cinco casos con tarjetas expandibles y una visualización propia por caso.
   Las visualizaciones son ilustraciones didácticas originales; los cálculos que muestran son reales. */
(function () {
  const GP = window.GP;
  const NS = 'http://www.w3.org/2000/svg';
  const { esc } = GP;

  function s(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (text !== undefined) n.textContent = text;
    return n;
  }

  const APPS = [
    { n: 1, kind: 'prototype', links: [{ href: 'https://ntrs.nasa.gov/citations/20040152147', label: 'NASA NTRS' }] },
    { n: 2, kind: 'research', links: [{ href: 'https://doi.org/10.1016/S0045-7825(99)00397-7', label: 'DOI' }, { href: 'https://mitpress.mit.edu/9780262527910/genetic-programming/', label: 'Koza (1992)' }] },
    { n: 3, kind: 'research', links: [{ href: 'https://doi.org/10.1126/science.1165893', label: 'DOI' }, { href: 'https://gpbib.cs.ucl.ac.uk/gp-html/Schmidt_2009_rebuttal.html', labelKey: 'app.3.altLink' }] },
    { n: 4, kind: 'research', links: [{ href: 'https://doi.org/10.1016/j.chemolab.2011.01.012', label: 'DOI' }] },
    { n: 5, kind: 'research', links: [{ href: 'https://www.sciencedirect.com/science/article/pii/B9780443152740502432', label: 'ScienceDirect' }, { href: 'https://doi.org/10.1021/acs.iecr.3c04021', label: 'DOI (2024)' }] },
  ];

  /* ===== Caso 1: árbol de construcción → antena (tortuga) ===== */
  const seq = (a, b) => ({ kind: 'op', label: '→', children: [a, b] });
  const brn = (a, b) => ({ kind: 'op', label: 'Y', children: [a, b] });
  const fwd = (len) => ({ kind: 'var', label: 'F' + len, len, cmd: 'F', children: [] });
  const rot = (deg) => ({ kind: 'const', label: 'R' + (deg > 0 ? '+' : '−') + Math.abs(deg), deg, cmd: 'R', children: [] });
  const PROGRAM = seq(fwd(3), seq(rot(40), brn(
    seq(fwd(2), seq(rot(-35), fwd(2))),
    seq(rot(-45), seq(fwd(2), brn(fwd(2), seq(rot(60), fwd(2)))))
  )));

  function demo1(box) {
    const prev = box.querySelector('input') ? Number(box.querySelector('input').value) : null;
    box.innerHTML = `<div class="d1"><div class="tree-stage small"><svg class="tree-svg d1-tree" role="img" aria-label=""></svg></div>
      <div class="tree-stage small d1-wire-wrap"><svg class="d1-wire" role="img" aria-label=""></svg></div></div>
      <div class="values-bar"><label class="field-label" for="d1-step">${esc(GP.t('app.1.step'))}</label><input id="d1-step" type="range" min="0" value="0" step="1"><output class="xval d1-out"></output></div>
      <p class="hint">${esc(GP.t('app.1.legend'))}</p>`;
    const treeSvg = box.querySelector('.d1-tree');
    const wire = box.querySelector('.d1-wire');
    const view = new GP.TreeView(treeSvg, PROGRAM, { r: 19, dx: 50, dy: 62 });
    view.locked = true;
    const idOf = new Map(view.recs.map((r) => [r.node, r.id]));

    // ejecución de la tortuga: cada terminal es un paso; Y bifurca desde el mismo estado
    const steps = [];
    (function exec(node, st) {
      if (node.label === '→') node.children.forEach((c) => exec(c, st));
      else if (node.label === 'Y') node.children.forEach((c) => exec(c, { x: st.x, y: st.y, a: st.a }));
      else if (node.cmd === 'F') {
        const a = (st.a * Math.PI) / 180;
        const nx = st.x + node.len * Math.cos(a);
        const ny = st.y + node.len * Math.sin(a);
        steps.push({ id: idOf.get(node), seg: [st.x, st.y, nx, ny] });
        st.x = nx; st.y = ny;
      } else { st.a += node.deg; steps.push({ id: idOf.get(node) }); }
    })(PROGRAM, { x: 0, y: 0, a: -90 });

    const segs = steps.filter((p) => p.seg).map((p) => p.seg);
    const xs = segs.flatMap((q) => [q[0], q[2]]);
    const ys = segs.flatMap((q) => [q[1], q[3]]);
    const pad = 1;
    wire.setAttribute('viewBox', `${Math.min(...xs) - pad} ${Math.min(...ys) - pad} ${Math.max(...xs) - Math.min(...xs) + 2 * pad} ${Math.max(...ys) - Math.min(...ys) + 2 * pad}`);
    const range = box.querySelector('input');
    range.max = steps.length;
    range.value = prev === null ? steps.length : Math.min(prev, steps.length);
    const out = box.querySelector('.d1-out');
    treeSvg.setAttribute('aria-label', GP.t('app.1.demoTitle'));
    wire.setAttribute('aria-label', GP.t('app.1.demoTitle'));

    function draw() {
      const k = Number(range.value);
      out.textContent = `${k} / ${steps.length}`;
      view.mark(steps.slice(0, k).map((p) => p.id), 'from-a');
      wire.replaceChildren();
      steps.forEach((p, i) => {
        if (!p.seg) return;
        wire.append(s('line', { x1: p.seg[0], y1: p.seg[1], x2: p.seg[2], y2: p.seg[3], class: 'wire' + (i < k ? ' is-on' : '') }));
      });
      wire.append(s('circle', { cx: 0, cy: 0, r: 0.18, class: 'feed' }));
    }
    range.addEventListener('input', draw);
    draw();
  }

  /* ===== Caso 2: red serie/paralelo evaluada por su comportamiento ===== */
  const R0 = 1000;
  const C_VAL = 1 / (2 * Math.PI * 1000 * R0);   // corte en 1 kHz con R0
  const L_VAL = R0 / (2 * Math.PI * 1000);
  const leaf = (t, v, label) => ({ type: t, value: v, label });
  const ser = (a, b) => ({ type: 'S', a, b });
  const par = (a, b) => ({ type: 'P', a, b });
  const NETS = [
    { id: 'c1', net: leaf('C', C_VAL, 'C') },
    { id: 'c2', net: leaf('L', L_VAL, 'L') },
    { id: 'c3', net: par(leaf('R', 1000, 'R'), leaf('C', C_VAL, 'C')) },
    { id: 'c4', net: ser(leaf('R', 1000, 'R'), leaf('C', C_VAL, 'C')) },
  ];
  const cx = (re, im) => ({ re, im });
  const cmul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cadd = (a, b) => cx(a.re + b.re, a.im + b.im);
  const cabs = (a) => Math.hypot(a.re, a.im);
  function impedance(n, w) {
    if (n.type === 'R') return cx(n.value, 0);
    if (n.type === 'L') return cx(0, w * n.value);
    if (n.type === 'C') return cx(0, -1 / (w * n.value));
    const za = impedance(n.a, w), zb = impedance(n.b, w);
    return n.type === 'S' ? cadd(za, zb) : cdiv(cmul(za, zb), cadd(za, zb));
  }
  const gain = (net, f) => { const z = impedance(net, 2 * Math.PI * f); return cabs(cdiv(z, cadd(cx(R0, 0), z))); };
  const FREQS = Array.from({ length: 61 }, (_, i) => Math.pow(10, 1 + (i * 4) / 60)); // 10 Hz a 100 kHz
  const ideal = (f) => (f <= 1000 ? 1 : 0);
  const netRmse = (net) => Math.sqrt(FREQS.reduce((a, f) => a + Math.pow(gain(net, f) - ideal(f), 2), 0) / FREQS.length);

  function width(n) { return n.type === 'S' ? Math.max(width(n.a), width(n.b)) : n.type === 'P' ? width(n.a) + width(n.b) + 30 : 78; }
  function drawNet(g, n, x, y) {
    if (!n.type || n.type.length === 1 && 'RLC'.includes(n.type)) {
      g.append(s('line', { x1: x, y1: y, x2: x, y2: y + 8, class: 'net-w' }));
      g.append(s('rect', { x: x - 30, y: y + 8, width: 60, height: 28, rx: 5, class: 'net-box net-' + n.type }));
      g.append(s('text', { x, y: y + 22, class: 'net-t' }, n.label));
      g.append(s('line', { x1: x, y1: y + 36, x2: x, y2: y + 44, class: 'net-w' }));
      return 44;
    }
    if (n.type === 'S') { const ha = drawNet(g, n.a, x, y); return ha + drawNet(g, n.b, x, y + ha); }
    const wa = width(n.a), wb = width(n.b), W = wa + wb + 30;
    const xa = x - W / 2 + wa / 2, xb = x + W / 2 - wb / 2;
    const ha = drawNet(g, n.a, xa, y + 10), hb = drawNet(g, n.b, xb, y + 10);
    const H = Math.max(ha, hb);
    g.append(s('line', { x1: x, y1: y, x2: x, y2: y + 10, class: 'net-w' }));
    g.append(s('line', { x1: xa, y1: y + 10, x2: xb, y2: y + 10, class: 'net-w' }));
    [[xa, ha], [xb, hb]].forEach(([px, h]) => g.append(s('line', { x1: px, y1: y + 10 + h, x2: px, y2: y + 10 + H, class: 'net-w' })));
    g.append(s('line', { x1: xa, y1: y + 10 + H, x2: xb, y2: y + 10 + H, class: 'net-w' }));
    g.append(s('line', { x1: x, y1: y + 10 + H, x2: x, y2: y + 20 + H, class: 'net-w' }));
    return H + 20;
  }

  function demo2(box) {
    const cur = box.querySelector('[aria-checked="true"]') ? box.querySelector('[aria-checked="true"]').getAttribute('data-v') : 'c1';
    box.innerHTML = `<div class="field"><span class="field-label" id="d2-label">${esc(GP.t('app.2.candidate'))}</span><div class="seg-group" id="d2-seg" role="radiogroup" aria-labelledby="d2-label"></div></div>
      <div class="d2"><div class="tree-stage small"><svg class="d2-net" role="img" aria-label="${esc(GP.t('app.2.schematic'))}"></svg></div>
      <div class="tree-stage small d2-chart"><svg class="chart-svg" id="d2-chart" role="img" aria-label="${esc(GP.t('app.2.response'))}"></svg></div></div>
      <p class="d2-score"><span>${esc(GP.t('app.2.rmse'))}:</span> <b id="d2-rmse"></b></p>
      <p class="hint">${esc(GP.t('app.2.schematic'))}</p>
      <ul class="legend chart-legend"><li><span class="sw real"></span>${esc(GP.t('app.2.target'))}</li><li><span class="sw s-0"></span>${esc(GP.t('app.2.response'))}</li></ul>`;
    const seg = GP.segmented(box.querySelector('#d2-seg'), NETS.map((c) => ({ value: c.id, label: () => GP.t('app.2.' + c.id) })), cur, show);
    function show(id) {
      const net = NETS.find((c) => c.id === id).net;
      const svg = box.querySelector('.d2-net');
      svg.replaceChildren();
      const g = s('g');
      g.append(s('text', { x: -76, y: -22, class: 'net-lab' }, GP.t('app.2.src')));
      g.append(s('circle', { cx: -60, cy: -24, r: 10, class: 'net-src' }));
      g.append(s('line', { x1: -60, y1: -34, x2: -60, y2: -46, class: 'net-w' }));
      g.append(s('line', { x1: -60, y1: -46, x2: 0, y2: -46, class: 'net-w' }));
      g.append(s('rect', { x: -30, y: -60, width: 60, height: 28, rx: 5, class: 'net-box net-R0' }));
      g.append(s('text', { x: 0, y: -46, class: 'net-t' }, 'R₀'));
      g.append(s('line', { x1: 0, y1: -32, x2: 0, y2: 0, class: 'net-w' }));
      const h = drawNet(g, net, 0, 0);
      g.append(s('line', { x1: -16, y1: h, x2: 16, y2: h, class: 'net-w' }));
      g.append(s('line', { x1: -9, y1: h + 5, x2: 9, y2: h + 5, class: 'net-w' }));
      g.append(s('line', { x1: -3, y1: h + 10, x2: 3, y2: h + 10, class: 'net-w' }));
      g.append(s('line', { x1: -60, y1: -14, x2: -60, y2: h, class: 'net-w' }));
      g.append(s('line', { x1: -60, y1: h, x2: 0, y2: h, class: 'net-w' }));
      svg.append(g);
      const w = Math.max(width(net) + 40, 220);
      svg.setAttribute('viewBox', `${-Math.max(w / 2, 90)} -78 ${Math.max(w, 180)} ${h + 100}`);
      const pts = FREQS.map((f) => [Math.log10(f), gain(net, f)]);
      const tgt = FREQS.map((f) => [Math.log10(f), ideal(f)]);
      GP.lineChart(box.querySelector('#d2-chart'), { series: [{ id: 't', main: true, cls: 'real', points: tgt, marks: [] }, { id: 'r', cls: 's-0', points: pts, marks: [] }], xLabel: GP.t('app.2.xlabel'), yLabel: GP.t('app.2.ylabel'), zero: true, yMax: 1 });
      box.querySelector('#d2-rmse').textContent = netRmse(net).toFixed(3);
    }
    show(cur);
    return seg;
  }

  /* ===== Caso 3: evolución real de una ecuación candidata ===== */
  function demo3(box) {
    const sim = new GP.Sim({ seed: 27 });
    sim.runAll();
    const gens = []; let best = Infinity;
    sim.history.forEach((r) => { if (r.best < best - 1e-9) { best = r.best; gens.push(r.gen); } });
    const picks = gens.length > 5 ? [gens[0], gens[1], gens[Math.floor(gens.length / 2)], gens[gens.length - 2], gens[gens.length - 1]] : gens;
    const series = [{ id: 'data', main: true, cls: 'real', points: GP.DATA.map((d) => [d[0], d[1]]) }];
    picks.forEach((g, i) => {
      const tree = GP.parse(sim.history[g].bestExpr);
      const pts = []; for (let x = -2; x <= 2.0001; x += 0.1) pts.push([x, GP.evaluate(tree, x)]);
      series.push({ id: 'g' + g, cls: 's-' + (i % 5), points: pts, marks: [] });
    });
    box.innerHTML = `<div class="d3-flow" role="list">${GP.t('app.3.flow').map((t, i) => `<span role="listitem" class="flow-step"><i>${i + 1}</i>${esc(t)}</span>`).join('')}</div>
      <div class="tree-stage small d3-chart"><svg class="chart-svg" id="d3-chart" role="img" aria-label="${esc(GP.t('app.3.demoTitle'))}"></svg></div>
      <ul class="legend chart-legend"><li><span class="sw real"></span>${esc(GP.t('app.3.data'))}</li>${picks.map((g, i) => `<li><span class="sw s-${i % 5}"></span>${esc(GP.t('app.3.gen', { g }))}: <code>${esc(sim.history[g].bestExpr)}</code></li>`).join('')}</ul>
      <p class="hint"><b>${esc(GP.t('app.3.final', { e: sim.summary().expr }))}</b></p>`;
    GP.lineChart(box.querySelector('#d3-chart'), { series, xLabel: 'x', yLabel: 'y' });
  }

  /* ===== Esquemas de los casos 4 y 5 (cajas con texto que se ajusta al ancho) ===== */
  function wrap(text, max) {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    words.forEach((w) => { if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) lines.push(cur);
    return lines;
  }
  function node(g, x, y, w, h, text, cls, sub) {
    g.append(s('rect', { x, y, width: w, height: h, rx: 8, class: 'dg-box ' + (cls || '') }));
    const lines = wrap(text, Math.floor(w / 7.4));
    const total = lines.length + (sub ? 1 : 0);
    const top = y + h / 2 - ((total - 1) * 15) / 2;
    lines.forEach((l, i) => g.append(s('text', { x: x + w / 2, y: top + i * 15, class: 'dg-t' }, l)));
    if (sub) g.append(s('text', { x: x + w / 2, y: top + lines.length * 15, class: 'dg-s' }, sub));
  }
  const arrow = (g, x1, y1, x2, y2) => g.append(s('path', { d: `M${x1} ${y1} L${x2} ${y2}`, class: 'dg-arrow', 'marker-end': 'url(#dg-head)' }));
  function defs(svg) {
    const d = s('defs'); const m = s('marker', { id: 'dg-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    m.append(s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'dg-head' })); d.append(m); svg.append(d);
  }

  /* Caso 4: modelo de formulación → respuestas de liberación */
  function demo4(box) {
    box.innerHTML = '<svg class="dg" viewBox="0 0 560 320" role="img"></svg>';
    const svg = box.querySelector('svg');
    svg.setAttribute('aria-label', GP.t('app.4.demoTitle'));
    defs(svg);
    const g = s('g'); svg.append(g);
    g.append(s('text', { x: 10, y: 16, class: 'dg-cap dg-l' }, GP.t('app.4.in')));
    g.append(s('text', { x: 548, y: 16, class: 'dg-cap dg-r' }, GP.t('app.4.out')));
    ['PEG 4000', 'PVP K30', 'HPMC K100', 'HPMC E50LV'].forEach((p, i) => { node(g, 10, 30 + i * 52, 130, 40, p, 'in'); arrow(g, 140, 50 + i * 52, 176, 139); });
    node(g, 180, 100, 200, 78, 'f(P₁, P₂, P₃, P₄)', 'model', GP.t('app.4.model'));
    [GP.t('app.4.o1'), GP.t('app.4.o2'), GP.t('app.4.o3')].forEach((o, i) => { arrow(g, 380, 139, 416, 52 + i * 80); node(g, 420, 30 + i * 80, 130, 44, o, 'out'); });
    const tx = 76, ty = 276;
    g.append(s('ellipse', { cx: tx, cy: ty, rx: 46, ry: 17, class: 'tablet' }));
    [[-22, -3], [-6, 4], [10, -5], [24, 3], [-14, 8], [2, -1], [18, 9]].forEach(([dx, dy]) => g.append(s('circle', { cx: tx + dx, cy: ty + dy, r: 2.2, class: 'tablet-dot' })));
    g.append(s('text', { x: tx + 58, y: ty + 2, class: 'dg-s dg-l' }, GP.t('app.4.tablet')));
  }

  /* Caso 5: de la planta al soft sensor (flujo vertical) */
  function demo5(box) {
    box.innerHTML = '<svg class="dg" viewBox="0 0 560 360" role="img"></svg>';
    const svg = box.querySelector('svg');
    svg.setAttribute('aria-label', GP.t('app.5.demoTitle'));
    defs(svg);
    const g = s('g'); svg.append(g);
    g.append(s('rect', { x: 24, y: 70, width: 100, height: 140, rx: 14, class: 'plant' }));
    g.append(s('line', { x1: 74, y1: 56, x2: 74, y2: 170, class: 'plant-line' }));
    g.append(s('line', { x1: 52, y1: 170, x2: 96, y2: 170, class: 'plant-line' }));
    g.append(s('rect', { x: 32, y: 150, width: 84, height: 52, rx: 8, class: 'plant-liquid' }));
    g.append(s('text', { x: 74, y: 232, class: 'dg-s' }, GP.t('app.5.reactor')));
    [[24, 100], [124, 120], [24, 160]].forEach(([x, y], i) => {
      g.append(s('circle', { cx: x, cy: y, r: 9, class: 'sensor' }));
      g.append(s('text', { x, y: y + 1, class: 'sensor-t' }, String(i + 1)));
    });
    g.append(s('text', { x: 74, y: 252, class: 'dg-s' }, GP.t('app.5.sensor') + ' 1–3'));
    const flow = GP.t('app.5.flow').concat(GP.t('app.5.quality'));
    const kinds = ['in', 'model', 'model', 'model', 'out', 'out'];
    const bx = 220, bw = 320, bh = 38, gap = 18, y0 = 12;
    g.append(s('rect', { x: bx - 12, y: y0 + (bh + gap) - 10, width: bw + 24, height: 3 * bh + 2 * gap + 20, rx: 12, class: 'dg-frame' }));
    const fy = y0 + (bh + gap) - 10 + (3 * bh + 2 * gap + 20) / 2;
    g.append(s('text', { x: bx - 24, y: fy, class: 'dg-cap', transform: `rotate(-90 ${bx - 24} ${fy})` }, GP.t('app.5.soft')));
    flow.forEach((t, i) => {
      node(g, bx, y0 + i * (bh + gap), bw, bh, t, kinds[i]);
      if (i) arrow(g, bx + bw / 2, y0 + (i - 1) * (bh + gap) + bh, bx + bw / 2, y0 + i * (bh + gap));
    });
    arrow(g, 134, 120, bx, y0 + bh / 2);
  }

  /* ===== Tarjetas ===== */
  function cardHtml(a) {
    const n = a.n;
    const links = a.links.map((l) => `<a class="text-link" href="${l.href}" target="_blank" rel="noopener"><span ${l.labelKey ? `data-i18n="${l.labelKey}"` : ''}>${l.label || ''}</span> <span aria-hidden="true">↗</span></a>`).join('');
    const sec = (cls, key, textKey) => `<section class="${cls}"><h4 data-i18n="app.l.${key}"></h4><p data-i18n="app.${n}.${textKey}"></p></section>`;
    return `<article class="app-card" id="caso-${n}" aria-labelledby="app-title-${n}">
      <header class="app-head">
        <span class="app-num" aria-hidden="true">${n}</span>
        <div><span class="badge is-${a.kind}" data-i18n="app.kind.${a.kind}"></span>
        <h3 id="app-title-${n}" data-i18n="app.${n}.name"></h3><p class="app-sub" data-i18n="app.${n}.sub"></p></div>
      </header>
      <figure class="app-visual">
        <figcaption class="app-vtitle" data-i18n="app.${n}.demoTitle"></figcaption>
        <div class="demo" data-demo="${n}"></div>
        <p class="hint" ${n === 1 || n === 2 || n === 3 || n === 4 || n === 5 ? `data-i18n="app.${n}.demoNote"` : ''}></p>
      </figure>
      <div class="app-body">
        ${sec('app-sec', 'problem', 'problem')}
        ${sec('app-sec', 'how', 'how')}
        ${sec('app-sec', 'result', 'result')}
        <section class="app-sec app-ref"><h4 data-i18n="app.l.ref"></h4><p data-i18n="app.${n}.ref"></p><div class="app-links">${links}</div></section>
        <button class="text-btn app-toggle" type="button" aria-expanded="false" aria-controls="more-${n}"></button>
        <div id="more-${n}" class="app-more" hidden>
          ${sec('app-sec', 'goal', 'goal')}${sec('app-sec', 'individual', 'individual')}${sec('app-sec', 'eval', 'eval')}${sec('app-sec app-caution', 'caution', 'caution')}
        </div>
      </div>
    </article>`;
  }

  function init() {
    const host = document.getElementById('app-list');
    if (!host) return;
    host.innerHTML = APPS.map(cardHtml).join('');
    const mounts = {};

    function toggleLabel(card) {
      const btn = card.querySelector('.app-toggle');
      btn.textContent = GP.t(btn.getAttribute('aria-expanded') === 'true' ? 'app.collapse' : 'app.expand');
    }
    host.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.app-toggle');
      if (!btn) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
      toggleLabel(btn.closest('.app-card'));
    });

    function mountDemos() {
      host.querySelectorAll('.app-card').forEach((c) => toggleLabel(c));
      demo1(host.querySelector('[data-demo="1"]'));
      mounts[2] = demo2(host.querySelector('[data-demo="2"]'));
      demo3(host.querySelector('[data-demo="3"]'));
      demo4(host.querySelector('[data-demo="4"]'));
      demo5(host.querySelector('[data-demo="5"]'));
    }
    GP.onLang(() => { GP.applyI18n(); mountDemos(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
