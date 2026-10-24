/* Sección «Simulador»: parámetros, ejecución generación a generación, estadísticas, gráficas e historial. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);
  const { esc } = GP;
  const STEP_MS = 140;
  const FIELDS = { popSize: 'sp-pop', initDepth: 'sp-init', maxDepth: 'sp-max', maxSize: 'sp-size', generations: 'sp-gens', k: 'sp-k', elite: 'sp-elite', seed: 'sp-seed' };
  const LABELS = { popSize: 'sim.p.pop', initDepth: 'sim.p.initDepth', maxDepth: 'sim.p.maxDepth', maxSize: 'sim.p.maxSize', generations: 'sim.p.gens', k: 'sim.p.k', elite: 'sim.p.elite' };
  const fmt = (v) => (v >= 1e6 ? v.toExponential(2).replace('e+', 'e') : GP.fmtNum(v));
  const fmt3 = (v) => (v >= 1e6 ? v.toExponential(2).replace('e+', 'e') : String(Math.round(v * 1000) / 1000));

  function init() {
    if (!$('sp-pop')) return;
    let sim = null;
    let timer = null;
    let shownBest = null;
    let batchToken = 0;

    function readParams() {
      const raw = { pc: $('sp-pc').value };
      Object.keys(FIELDS).forEach((k) => { raw[k] = $(FIELDS[k]).value; });
      return raw;
    }

    function writeParams(p) {
      Object.keys(FIELDS).forEach((k) => { $(FIELDS[k]).value = p[k]; });
      $('sp-pc').value = p.pc;
      $('sp-pc-out').textContent = p.pc.toFixed(2);
      $('sp-pm-out').textContent = p.pm.toFixed(2);
    }

    let fast = 0; // token de la ejecución rápida por tramos (0 = inactiva)
    function stop() { clearInterval(timer); timer = null; fast = 0; }

    function setStatus(key, vars) { $('sim-status').textContent = key ? GP.t(key, vars) : ''; }

    function reset(newSeedValue) {
      stop();
      batchToken++;
      const raw = readParams();
      if (newSeedValue) raw.seed = newSeedValue;
      sim = new GP.Sim(raw);
      writeParams(sim.p);
      $('sim-warn-list').innerHTML = sim.warnings.map((w) => {
        const vars = w.key === 'sim.w.range' ? { name: GP.t(LABELS[w.name] || 'sim.p.seed'), lo: w.lo, hi: w.hi } : { size: w.size };
        return `<li>${esc(GP.t(w.key, vars))}</li>`;
      }).join('');
      shownBest = null;
      $('batch-out').innerHTML = '';
      render();
    }

    /* ---- gráficas ---- */
    function chart(id, key, pick, opts) {
      const pts = sim.history.map((r) => [r.gen, pick(r)]);
      GP.lineChart($(id), Object.assign({
        series: [{ id: key, cls: 's-0', points: pts, marks: pts.length > 30 ? [] : undefined }],
        xLabel: GP.t('sim.c.gen'),
      }, opts));
      $(id + '-last').textContent = GP.t('sim.c.last', { v: fmt3(pick(sim.history[sim.history.length - 1])) });
    }

    function renderCharts() {
      const log = $('sim-log').checked;
      chart('ch-best', 'best', (r) => r.best, { log, zero: true });
      chart('ch-mean', 'mean', (r) => r.mean, { log, zero: true });
      chart('ch-size', 'size', (r) => r.size, { zero: true });
      chart('ch-div', 'div', (r) => r.diversity, { zero: true, yMax: 1 });
    }

    function renderBest() {
      const s = sim.summary();
      if (shownBest !== sim.best.ind) {
        shownBest = sim.best.ind;
        $('sim-tree').replaceChildren(GP.treeSvg(s.tree, { r: 20, dx: 54, dy: 64, scale: 0.55 }));
      }
      $('sim-best-expr').textContent = s.expr;
      $('sim-best-gen').textContent = GP.t('sim.best.gen', { g: s.gen });
      $('sim-best-rmse').textContent = fmt3(s.fit);
      $('sim-best-unseen').textContent = fmt3(s.unseen);
      $('sim-best-shape').textContent = GP.t('sim.best.shapeText', { n: s.size, d: s.depth });
      const verdict = s.recovers ? 'ok' : s.exact ? 'fit' : 'no';
      const v = $('sim-verdict');
      v.textContent = GP.t('sim.best.' + verdict);
      v.className = 'verdict is-' + verdict;
    }

    function renderHistory() {
      const rows = sim.history.map((r) => `<tr><td>${r.gen}</td><td>${fmt3(r.best)}</td><td>${fmt3(r.mean)}</td><td>${r.size.toFixed(1)}</td><td>${r.diversity.toFixed(2)}</td><td class="hx"><code>${esc(r.bestExpr)}</code></td></tr>`).join('');
      $('sim-history').innerHTML = `<thead><tr><th scope="col">${esc(GP.t('sim.h.gen'))}</th><th scope="col">${esc(GP.t('sim.h.best'))}</th><th scope="col">${esc(GP.t('sim.h.mean'))}</th><th scope="col">${esc(GP.t('sim.h.size'))}</th><th scope="col">${esc(GP.t('sim.h.div'))}</th><th scope="col">${esc(GP.t('sim.h.expr'))}</th></tr></thead><tbody>${rows}</tbody>`;
      const box = $('sim-history').parentElement;
      box.scrollTop = box.scrollHeight;
    }

    function render() {
      const last = sim.history[sim.history.length - 1];
      $('st-gen').textContent = `${last.gen} / ${sim.p.generations}`;
      $('st-best').textContent = fmt3(last.best);
      $('st-mean').textContent = fmt3(last.mean);
      $('st-size').textContent = last.size.toFixed(1);
      $('st-div').textContent = last.diversity.toFixed(2);
      $('st-ops').textContent = last.gen === 0 ? '—' : GP.t('sim.stat.opsText', last.ops);
      renderBest();
      renderCharts();
      renderHistory();
      if (sim.done) {
        stopUi();
        setStatus(sim.reason === 'exact' ? 'sim.state.exact' : 'sim.state.gens', { g: sim.reason === 'exact' ? sim.gen : sim.p.generations });
      } else if (timer || fast) setStatus('sim.state.running');
      else setStatus(sim.gen === 0 ? 'sim.state.ready' : 'sim.state.paused');
      syncButtons();
    }

    function syncButtons() {
      const playing = timer !== null || fast !== 0;
      $('sim-run').textContent = GP.t(playing ? 'sim.pause' : 'sim.run');
      $('sim-run').setAttribute('aria-pressed', String(playing));
      $('sim-run').disabled = sim.done;
      $('sim-step').disabled = sim.done || playing;
      $('sim-all').disabled = sim.done;
    }
    function stopUi() { stop(); }

    function tick() { sim.step(); render(); }

    /* Ejecuta en tramos de ~30 ms para no congelar la página con parámetros muy grandes; se puede pausar. */
    function runFast() {
      const my = (fast = Date.now());
      const slice = () => {
        if (fast !== my) return;
        const t0 = performance.now();
        while (!sim.done && performance.now() - t0 < 30) sim.step();
        render();
        if (!sim.done) requestAnimationFrame(slice);
      };
      render();
      requestAnimationFrame(slice);
    }

    $('sim-run').addEventListener('click', () => {
      if (timer || fast) { stop(); render(); return; }
      if (GP.reducedMotion()) { runFast(); return; }
      timer = setInterval(tick, STEP_MS);
      render();
    });
    $('sim-step').addEventListener('click', tick);
    $('sim-all').addEventListener('click', () => { stop(); runFast(); });
    $('sim-reset').addEventListener('click', () => reset());
    $('sim-newseed').addEventListener('click', () => reset(1 + Math.floor(Math.random() * 99999)));
    $('sim-log').addEventListener('change', renderCharts);
    $('sp-pc').addEventListener('input', () => {
      const pc = Number($('sp-pc').value);
      $('sp-pc-out').textContent = pc.toFixed(2);
      $('sp-pm-out').textContent = (1 - pc).toFixed(2);
    });
    ['sp-pc', ...Object.values(FIELDS)].forEach((id) => $(id).addEventListener('change', () => reset()));

    /* ---- prueba con 10 semillas (síncrona por semilla, cediendo el hilo entre ejecuciones) ---- */
    $('sim-batch').addEventListener('click', async () => {
      stop();
      const my = ++batchToken;
      const base = readParams();
      const first = GP.simParams(base).p.seed;
      const out = $('batch-out');
      out.innerHTML = `<p class="hint">${esc(GP.t('sim.b.intro', { a: first, b: first + 9 }))}</p><div class="table-wrap"><table class="eval-table compact"><thead><tr><th scope="col">${esc(GP.t('sim.b.seed'))}</th><th scope="col">${esc(GP.t('sim.b.gen'))}</th><th scope="col">${esc(GP.t('sim.b.rmse'))}</th><th scope="col">${esc(GP.t('sim.b.ok'))}</th><th scope="col">${esc(GP.t('sim.b.expr'))}</th></tr></thead><tbody></tbody></table></div><p class="batch-sum" aria-live="polite"></p>`;
      const body = out.querySelector('tbody');
      let hits = 0;
      $('sim-batch').disabled = true;
      for (let i = 0; i < 10; i++) {
        out.querySelector('.batch-sum').textContent = GP.t('sim.b.running', { s: first + i });
        await new Promise((r) => setTimeout(r, 0));
        if (my !== batchToken) { $('sim-batch').disabled = false; return; }
        const s = new GP.Sim(Object.assign({}, base, { seed: first + i }));
        s.runAll();
        const m = s.summary();
        if (m.recovers) hits++;
        body.insertAdjacentHTML('beforeend', `<tr class="${m.recovers ? 'is-ok' : ''}"><td>${first + i}</td><td>${s.gen}</td><td>${fmt3(m.fit)}</td><td>${esc(GP.t(m.recovers ? 'sim.b.yes' : 'sim.b.no'))}</td><td class="hx"><code>${esc(m.expr)}</code></td></tr>`);
      }
      out.querySelector('.batch-sum').textContent = GP.t('sim.b.summary', { n: hits });
      $('sim-batch').disabled = false;
    });

    GP.onLang(() => {
      $('sim-how').innerHTML = GP.t('sim.how').map((t) => `<li>${esc(t)}</li>`).join('');
      if (!sim) { writeParams(GP.simParams(GP.DEFAULTS).p); reset(); } else render();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
