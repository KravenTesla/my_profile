/* Motor de Tree-based GP para f(x) = x² + 2x + 1. Lógica pura: sin DOM, reproducible con semilla.
   Estrategia: reemplazo generacional, selección por torneo, crossover o mutación de subárbol (excluyentes,
   Pc + Pm = 1), elitismo configurable y límites de profundidad y tamaño. */
(function () {
  const GP = (window.GP = window.GP || {});

  GP.target = (x) => x * x + 2 * x + 1;
  /* Puntos que el algoritmo nunca ve: sirven para comprobar si el mejor programa generaliza. */
  GP.UNSEEN = [-3, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3].map((x) => [x, GP.target(x)]);

  const EXACT = 1e-9;
  const BIG = 1e300;

  GP.DEFAULTS = { popSize: 100, initDepth: 4, maxDepth: 8, maxSize: 60, pc: 0.9, generations: 50, k: 3, elite: 1, seed: 1 };

  /* Valida y acota los parámetros; devuelve { p, warnings }. Nunca produce valores que rompan el motor. */
  GP.simParams = function (raw) {
    const w = [];
    const num = (v, d) => (Number.isFinite(Number(v)) && v !== '' ? Number(v) : d);
    const int = (v, d, lo, hi, name) => {
      const n = Math.round(num(v, d));
      const c = Math.min(hi, Math.max(lo, n));
      if (c !== n) w.push({ key: 'sim.w.range', name, lo, hi });
      return c;
    };
    const p = {};
    p.popSize = int(raw.popSize, GP.DEFAULTS.popSize, 10, 500, 'popSize');
    p.initDepth = int(raw.initDepth, GP.DEFAULTS.initDepth, 1, 6, 'initDepth');
    p.maxDepth = int(raw.maxDepth, GP.DEFAULTS.maxDepth, 2, 12, 'maxDepth');
    if (p.maxDepth < p.initDepth) { p.maxDepth = p.initDepth; w.push({ key: 'sim.w.depth' }); }
    p.maxSize = int(raw.maxSize, GP.DEFAULTS.maxSize, 7, 255, 'maxSize');
    const fullSize = Math.pow(2, p.initDepth + 1) - 1;
    if (p.maxSize < fullSize) { w.push({ key: 'sim.w.size', size: fullSize }); }
    p.generations = int(raw.generations, GP.DEFAULTS.generations, 1, 200, 'generations');
    p.k = int(raw.k, GP.DEFAULTS.k, 1, Math.min(10, p.popSize), 'k');
    p.elite = int(raw.elite, GP.DEFAULTS.elite, 0, Math.min(20, p.popSize - 1), 'elite');
    p.pc = Math.min(1, Math.max(0, num(raw.pc, GP.DEFAULTS.pc)));
    p.pm = Math.round((1 - p.pc) * 1e6) / 1e6; // Pc + Pm = 1
    p.seed = Math.max(1, Math.floor(num(raw.seed, 1)));
    return { p, warnings: w };
  };

  const safeFit = (tree) => { const f = GP.rmse(tree); return Number.isFinite(f) ? f : BIG; };

  /* Forma canónica (prefijo) para contar individuos distintos sin ambigüedad. */
  function canon(n) { return n.children.length ? `(${n.label} ${n.children.map(canon).join(' ')})` : n.label; }

  function nodePaths(tree) {
    const out = [];
    (function walk(n, path) { out.push(path); n.children.forEach((c, i) => walk(c, path.concat(i))); })(tree, []);
    return out;
  }

  GP.Sim = class Sim {
    constructor(raw) {
      const { p, warnings } = GP.simParams(raw);
      this.p = p;
      this.warnings = warnings;
      this.rng = GP.rng(p.seed);
      this.gen = 0;
      this.history = [];
      this.done = false;
      this.reason = null; // 'exact' | 'generations'
      this.best = null;   // mejor individuo de toda la ejecución
      this.pop = this._init();
      this._record({ cx: 0, mut: 0, rej: 0 });
    }

    /* Ramped half-and-half: profundidades 2…initDepth, alternando Full y Grow. */
    _init() {
      const { popSize, initDepth } = this.p;
      const lo = Math.min(2, initDepth);
      const span = initDepth - lo + 1;
      return Array.from({ length: popSize }, (_, i) => {
        const tree = GP.randomTree(this.rng, { maxDepth: lo + (i % span), method: i % 2 ? 'grow' : 'full' });
        return this._ind(tree);
      });
    }

    _ind(tree) { return { tree, fit: safeFit(tree), size: GP.size(tree), depth: GP.depth(tree) }; }
    _valid(tree) { return GP.depth(tree) <= this.p.maxDepth && GP.size(tree) <= this.p.maxSize; }

    _record(ops) {
      const pop = this.pop;
      const bestInd = pop.reduce((b, i) => (i.fit < b.fit ? i : b), pop[0]);
      const mean = pop.reduce((a, i) => a + i.fit, 0) / pop.length;
      const rec = {
        gen: this.gen,
        best: bestInd.fit,
        mean,
        size: pop.reduce((a, i) => a + i.size, 0) / pop.length,
        diversity: new Set(pop.map((i) => canon(i.tree))).size / pop.length,
        bestExpr: GP.toExpr(bestInd.tree),
        ops,
      };
      this.history.push(rec);
      if (!this.best || bestInd.fit < this.best.ind.fit) this.best = { ind: bestInd, gen: this.gen };
      if (bestInd.fit < EXACT) { this.done = true; this.reason = 'exact'; }
      else if (this.gen >= this.p.generations) { this.done = true; this.reason = 'generations'; }
      return rec;
    }

    /* Una generación completa. Devuelve el registro de la nueva generación. */
    step() {
      if (this.done) return null;
      const { popSize, elite, pc, k } = this.p;
      const old = this.pop;
      const fits = old.map((i) => i.fit);
      const order = old.map((_, i) => i).sort((a, b) => fits[a] - fits[b] || a - b);
      const next = order.slice(0, elite).map((i) => old[i]); // elitismo: copia exacta
      const ops = { cx: 0, mut: 0, rej: 0 };
      const pick = () => old[GP.tournament(this.rng, fits, k).winner];
      const accept = (child, parent) => {
        if (this._valid(child)) return this._ind(child);
        ops.rej += 1;
        return parent; // descendiente fuera de límites: se conserva el progenitor
      };

      while (next.length < popSize) {
        if (this.rng() < pc) {
          const a = pick();
          const b = pick();
          const pa = this.rng.pick(nodePaths(a.tree));
          const pb = this.rng.pick(nodePaths(b.tree));
          const [c1, c2] = GP.crossover(a.tree, pa, b.tree, pb);
          ops.cx += 1;
          next.push(accept(c1, a));
          if (next.length < popSize) next.push(accept(c2, b));
        } else {
          const a = pick();
          const pa = this.rng.pick(nodePaths(a.tree));
          const sub = GP.randomTree(this.rng, { maxDepth: 2, method: 'grow' });
          ops.mut += 1;
          next.push(accept(GP.setAt(a.tree, pa, sub), a));
        }
      }
      this.pop = next;
      this.gen += 1;
      return this._record(ops);
    }

    runAll() { while (!this.done) this.step(); return this.history; }

    /* Resumen del mejor individuo de la ejecución. */
    summary() {
      const b = this.best.ind;
      return {
        tree: b.tree, expr: GP.toExpr(b.tree), fit: b.fit, gen: this.best.gen, size: b.size, depth: b.depth,
        unseen: GP.rmse(b.tree, GP.UNSEEN), exact: b.fit < EXACT,
        recovers: b.fit < EXACT && GP.rmse(b.tree, GP.UNSEEN) < 1e-6,
      };
    }
  };
})();
