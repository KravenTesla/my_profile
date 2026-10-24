/* Sección «Selección»: torneo animado y reproducible con semilla, más simulación de presión selectiva. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);
  const { esc } = GP;
  const POP_SEED = 930; // población fija de 10 individuos con fitness todos distintos
  const POP_SIZE = 10;
  const SIM_RUNS = 1000;

  function init() {
    if (!$('sel-list')) return;
    const pop = GP.initPopulation(GP.rng(POP_SEED), POP_SIZE, 3, 'grow');
    const fits = pop.map((t) => GP.rmse(t));
    const order = fits.map((_, i) => i).sort((a, b) => fits[a] - fits[b] || a - b);
    const rankOf = []; order.forEach((idx, r) => { rankOf[idx] = r + 1; });
    const maxFit = Math.max(...fits);

    let k = 3;
    let rng = null;
    let runs = 0;
    let busy = false;
    let token = 0;
    let view = { picked: [], winner: null, phase: 0 };

    const kSeg = GP.segmented($('sel-k'), [2, 3, 4, 5].map((v) => ({ value: String(v), label: () => String(v) })), String(k), (v) => { k = Number(v); renderSim(null); });
    const phases = GP.stepList($('sel-phases'), () => GP.t('sel.phases'));

    function renderList() {
      $('sel-list').innerHTML = pop.map((t, i) => {
        const inT = view.picked.includes(i);
        const cls = [inT ? 'is-in' : '', view.winner === i ? 'is-win' : '', view.picked.length && !inT ? 'is-out' : ''].join(' ');
        const showFit = view.phase >= 2 || !view.picked.length;
        return `<li class="sel-row ${cls}">
          <span class="sel-id">I${i + 1}</span>
          <code class="sel-expr">${esc(GP.toExpr(t))}</code>
          <span class="sel-bar" aria-hidden="true"><i style="width:${Math.max(4, (fits[i] / maxFit) * 100)}%"></i></span>
          <span class="sel-fit"${inT && view.phase >= 2 ? ' data-hot="1"' : ''}>${showFit || !inT ? GP.fmtNum(fits[i]) : '·'}</span>
          <span class="sel-rank">#${rankOf[i]}</span>
          <span class="sel-badge">${view.winner === i ? esc(GP.t('sel.badge.win')) : inT ? esc(GP.t('sel.badge.in')) : ''}</span>
        </li>`;
      }).join('');
    }

    function log(text, strong) {
      const li = document.createElement('li');
      if (strong) li.className = 'is-strong';
      li.textContent = text;
      const ol = $('sel-log');
      ol.append(li);
      while (ol.children.length > 40) ol.firstChild.remove();
      ol.scrollTop = ol.scrollHeight;
    }

    function resetSeed() {
      token++;
      busy = false;
      const s = Math.max(1, Math.floor(Number($('sel-seed').value)) || 1);
      $('sel-seed').value = s;
      rng = GP.rng(s);
      runs = 0;
      view = { picked: [], winner: null, phase: 0 };
      phases.set(0);
      $('sel-log').innerHTML = '';
      log(GP.t('sel.log.empty'));
      $('sel-run').disabled = false;
      renderList();
    }

    async function run() {
      if (busy) return;
      busy = true;
      const my = ++token;
      $('sel-run').disabled = true;
      runs += 1;
      const t = GP.tournament(rng, fits, k);
      const ids = t.picked.map((i) => 'I' + (i + 1));
      view = { picked: t.picked, winner: null, phase: 1 };
      phases.set(1); renderList();
      log(GP.t('sel.log.pick', { n: runs, k, ids: ids.join(', ') }));
      await GP.wait(900); if (my !== token) return;
      view.phase = 2; phases.set(2); renderList();
      log(GP.t('sel.log.fit', { list: t.picked.map((i) => `I${i + 1} = ${GP.fmtNum(fits[i])}`).join(', ') }));
      await GP.wait(900); if (my !== token) return;
      view.phase = 3; phases.set(3); renderList();
      log(GP.t('sel.log.cmp'));
      await GP.wait(900); if (my !== token) return;
      view.phase = 4; view.winner = t.winner; phases.set(4); renderList();
      log(GP.t('sel.log.win', { id: 'I' + (t.winner + 1), v: GP.fmtNum(fits[t.winner]) }), true);
      busy = false;
      $('sel-run').disabled = false;
    }

    /* 1000 torneos con una semilla propia: cuántas veces gana cada posición del ranking. */
    let simData = null;
    function renderSim(data) {
      if (data) simData = data;
      if (!simData || simData.k !== k) {
        $('sel-sim-title').textContent = GP.t('sel.simTitle', { k });
        $('sel-sim').innerHTML = `<p class="hint">${esc(GP.t('sel.simHint'))}</p>`;
        return;
      }
      $('sel-sim-title').textContent = GP.t('sel.simTitle', { k });
      const top = Math.max(...simData.wins);
      $('sel-sim').innerHTML = simData.wins.map((w, r) => `<div class="bar-row"><span>${esc(GP.t('sel.simRank', { r: r + 1 }))}</span>
        <span class="bar-track"><i style="width:${(w / top) * 100}%"></i></span><b>${(w / SIM_RUNS * 100).toFixed(1)}%</b></div>`).join('');
    }
    function simulate() {
      const r = GP.rng(1000 + k);
      const wins = new Array(POP_SIZE).fill(0);
      for (let i = 0; i < SIM_RUNS; i++) wins[rankOf[GP.tournament(r, fits, k).winner] - 1] += 1;
      renderSim({ k, wins });
    }

    $('sel-run').addEventListener('click', run);
    $('sel-reset').addEventListener('click', resetSeed);
    $('sel-seed').addEventListener('change', resetSeed);
    $('sel-sim-btn').addEventListener('click', simulate);

    GP.onLang(() => {
      kSeg.refresh();
      phases.refresh();
      renderSim(null);
      if (!rng) resetSeed(); else renderList();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
