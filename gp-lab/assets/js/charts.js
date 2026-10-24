/* Gráficas SVG ligeras (sin dependencias). */
(function () {
  const GP = (window.GP = window.GP || {});
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach((k) => n.setAttribute(k, attrs[k]));
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function niceTicks(min, max, count) {
    if (min === max) { min -= 1; max += 1; }
    const raw = (max - min) / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    const out = [];
    for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(Math.round(v / step) * step);
    return out;
  }

  /* cfg: { series: [{ id, points: [[x, y]], cls, main }], selected, xLabel, yLabel }
     Las series con cls s-0…s-5 usan los colores de la paleta; main dibuja la serie de referencia. */
  GP.lineChart = function (svg, cfg) {
    const W = 560, H = 320, L = 52, R = 16, T = 16, B = 46;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.replaceChildren();
    const all = cfg.series.flatMap((s) => s.points);
    const xs = all.map((p) => p[0]);
    // cfg.log: eje vertical en escala log10(1 + v), útil cuando hay valores muy dispares
    const tf = cfg.log ? (v) => Math.log10(1 + Math.max(0, v)) : (v) => v;
    const ys = all.map((p) => tf(p[1]));
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    if (cfg.zero && y0 > tf(0)) y0 = tf(0);
    if (cfg.yMax !== undefined) y1 = Math.max(y1, cfg.yMax);
    const pad = (y1 - y0) * 0.08 || 1;
    y0 -= cfg.zero ? 0 : pad; y1 += pad;
    const sx = (v) => L + ((v - x0) / (x1 - x0 || 1)) * (W - L - R);
    const sy = (v) => H - B - ((tf(v) - y0) / (y1 - y0 || 1)) * (H - T - B);
    const fmtTick = (v) => (Math.abs(v) >= 1e4 ? v.toExponential(0).replace('e+', 'e') : GP.fmtNum(v));
    const LOGT = [0, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12];
    let yTicks = cfg.log ? LOGT.filter((v) => tf(v) >= y0 && tf(v) <= y1) : niceTicks(y0, y1, 8);
    if (yTicks.length > 7) yTicks = yTicks.filter((v) => v === 0 || Math.log10(v) % 1 === 0); // solo potencias de 10

    const grid = el('g', { class: 'ch-grid' });
    yTicks.forEach((v) => {
      grid.append(el('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), class: v === 0 ? 'ch-zero' : '' }));
      grid.append(el('text', { x: L - 8, y: sy(v), class: 'ch-tick ch-ytick' }, fmtTick(v)));
    });
    niceTicks(x0, x1, 8).forEach((v) => {
      grid.append(el('text', { x: sx(v), y: H - B + 18, class: 'ch-tick' }, GP.fmtNum(v)));
    });
    svg.append(grid);
    if (cfg.xLabel) svg.append(el('text', { x: (L + W - R) / 2, y: H - 6, class: 'ch-label' }, cfg.xLabel));
    if (cfg.yLabel) svg.append(el('text', { x: 14, y: (T + H - B) / 2, class: 'ch-label', transform: `rotate(-90 14 ${(T + H - B) / 2})` }, cfg.yLabel));

    // La serie seleccionada se dibuja al final para quedar encima.
    const order = cfg.series.slice().sort((a, b) => (a.id === cfg.selected) - (b.id === cfg.selected));
    order.forEach((s) => {
      const dim = cfg.selected && s.id !== cfg.selected && !s.main;
      const g = el('g', { class: `ch-series ${s.cls}${s.main ? ' is-main' : ''}${dim ? ' is-dim' : ''}${s.id === cfg.selected ? ' is-selected' : ''}` });
      g.append(el('polyline', { points: s.points.map((p) => `${sx(p[0])},${sy(p[1])}`).join(' ') }));
      (s.marks || s.points).forEach((p) => g.append(el('circle', { cx: sx(p[0]), cy: sy(p[1]), r: s.main ? 5 : 3.5 })));
      svg.append(g);
    });
  };
})();
