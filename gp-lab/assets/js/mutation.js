/* Sección «Mutación»: sustitución real de un terminal o de un subárbol, con probabilidad pₘ y semilla. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);

  const preset = () => GP.op('*', GP.op('+', GP.v('x'), GP.c(1)), GP.v('x')); // (x + 1) × x

  function init() {
    if (!$('mu-o')) return;
    const OPTS = { r: 21, dx: 62, dy: 78 };
    let type = 'terminal';
    let mode = 'manual';
    let rng = null;
    let busy = false;
    let token = 0;
    let original = preset();
    let result = null;

    const vO = new GP.TreeView($('mu-o'), original, Object.assign({ onSelect: onPick }, OPTS));
    const vR = new GP.TreeView($('mu-r'), original, OPTS);
    vR.locked = true;
    const steps = GP.stepList($('mu-steps'), () => GP.t('mut.steps'));

    const typeSeg = GP.segmented($('mu-type'), [
      { value: 'terminal', label: () => GP.t('mut.terminal') },
      { value: 'subtree', label: () => GP.t('mut.subtree') },
    ], type, (v) => { type = v; applyMode(); });
    const modeSeg = GP.segmented($('mu-mode'), [
      { value: 'manual', label: () => GP.t('mut.manual') },
      { value: 'auto', label: () => GP.t('mut.auto') },
    ], mode, (v) => { mode = v; applyMode(); });

    function termOptions() {
      const sel = $('mu-term');
      const cur = sel.value || 'random';
      const opts = [['random', GP.t('mut.random')], ['x', 'x']].concat(GP.CONSTS.map((c) => [String(c), GP.display(String(c))]));
      sel.innerHTML = opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
      sel.value = cur;
    }

    function onPick(rec) {
      if (!busy) vO.clearBoxes();
      if (rec && type === 'terminal' && rec.childIds.length) $('mu-msg').textContent = GP.t('mut.mustLeaf');
      else $('mu-msg').textContent = '';
    }

    function applyMode() {
      vO.locked = mode === 'auto';
      $('mu-term-field').hidden = type !== 'terminal';
      $('mu-hint').textContent = mode === 'auto' ? GP.t('mut.hintAuto') : GP.t(type === 'terminal' ? 'mut.hintTerminal' : 'mut.hintManual');
      $('mu-msg').textContent = '';
    }

    function clearResult() {
      vR.setVisible(new Set());
      vR.svg.classList.add('is-empty');
      $('mu-new').innerHTML = '';
      ['mu-eb', 'mu-ea'].forEach((id) => { $(id).textContent = '—'; });
      $('mu-draw').textContent = '';
      result = null;
    }

    function setTree(t) {
      token++; busy = false;
      original = t;
      vO.setTree(t);
      vO.locked = mode === 'auto';
      vR.setTree(t);
      clearResult();
      $('mu-eb').textContent = GP.toExpr(t);
      steps.set(0);
      $('mu-run').disabled = false;
      $('mu-msg').textContent = '';
    }

    function resetSeed() {
      const s = Math.max(1, Math.floor(Number($('mu-seed').value)) || 1);
      $('mu-seed').value = s;
      rng = GP.rng(s);
    }

    /* Terminal nuevo, distinto del actual. */
    function pickTerminal(old) {
      const want = $('mu-term').value;
      const make = (v) => (v === 'x' ? GP.v('x') : GP.c(Number(v)));
      if (want !== 'random' && make(want).label !== old.label) return make(want);
      let t;
      do { t = GP.randomTerminal(rng); } while (t.label === old.label);
      return t;
    }

    /* Subárbol nuevo (Grow, profundidad ≤ 2) distinto del reemplazado. */
    function pickSubtree(old) {
      const oldExpr = GP.toExpr(old);
      let t;
      for (let i = 0; i < 30; i++) {
        t = GP.randomTree(rng, { maxDepth: 1 + rng.int(2), method: 'grow' });
        if (GP.toExpr(t) !== oldExpr) return t;
      }
      return t;
    }

    async function run() {
      if (busy) return;
      const p = Number($('mu-p').value);
      let id;
      if (mode === 'auto') {
        const leaves = vO.recs.filter((r) => !r.childIds.length);
        id = type === 'terminal' ? rng.pick(leaves).id : rng.int(vO.recs.length);
      } else {
        id = vO.selected;
        if (id === null) { $('mu-msg').textContent = GP.t('mut.mustNode'); return; }
        if (type === 'terminal' && vO.recs[id].childIds.length) { $('mu-msg').textContent = GP.t('mut.mustLeaf'); return; }
      }
      $('mu-msg').textContent = '';
      busy = true;
      const my = ++token;
      $('mu-run').disabled = true;
      vO.clearBoxes(); clearResult(); vR.setTree(original); clearResult();
      $('mu-eb').textContent = GP.toExpr(original);

      const u = rng();
      steps.set(1); await GP.wait(600); if (my !== token) return;
      if (u >= p) {
        $('mu-draw').textContent = GP.t('mut.draw.no', { u: u.toFixed(2), p: p.toFixed(2) });
        busy = false; $('mu-run').disabled = false;
        return;
      }
      $('mu-draw').textContent = GP.t('mut.draw.yes', { u: u.toFixed(2), p: p.toFixed(2) });

      steps.set(2);
      if (mode === 'auto') vO.select(id);
      await GP.wait(800); if (my !== token) return;

      steps.set(3);
      const path = GP.pathTo(vO.recs, id);
      const old = GP.getAt(original, path);
      vO.box(id, 'is-a');
      await GP.wait(900); if (my !== token) return;

      steps.set(4);
      const fresh = type === 'terminal' ? pickTerminal(old) : pickSubtree(old);
      const holder = document.createElement('div');
      holder.className = 'new-sub';
      holder.append(GP.treeSvg(fresh, Object.assign({ scale: 0.7 }, OPTS)));
      const cap = document.createElement('p');
      cap.className = 'new-sub-expr';
      cap.innerHTML = `<small>${GP.esc(GP.t('mut.old'))}:</small> <code>${GP.esc(GP.toExpr(old))}</code><br><small>${GP.esc(GP.t('mut.newSub'))}:</small> <code>${GP.esc(GP.toExpr(fresh))}</code>`;
      $('mu-new').replaceChildren(holder, cap);
      await GP.wait(1000); if (my !== token) return;

      steps.set(5);
      result = GP.setAt(original, path, fresh);
      await GP.wait(600); if (my !== token) return;

      steps.set(6);
      vR.setTree(result);
      vR.svg.classList.remove('is-empty');
      vR.mark(GP.subtreeIds(vR.recs, vR.idAt(path)), 'from-b');
      await GP.wait(800); if (my !== token) return;

      steps.set(7);
      $('mu-ea').textContent = GP.toExpr(result);
      busy = false; $('mu-run').disabled = false;
    }

    $('mu-run').addEventListener('click', run);
    $('mu-reset').addEventListener('click', () => setTree(original));
    $('mu-preset').addEventListener('click', () => setTree(preset()));
    $('mu-random').addEventListener('click', () => setTree(GP.randomTree(rng, { maxDepth: 2 + rng.int(2), method: 'grow' })));
    $('mu-seed').addEventListener('change', resetSeed);
    $('mu-p').addEventListener('input', () => { $('mu-p-out').textContent = Number($('mu-p').value).toFixed(2); });

    GP.onLang(() => {
      typeSeg.refresh(); modeSeg.refresh(); steps.refresh();
      termOptions();
      [vO, vR].forEach((v) => v.labelNodes());
      applyMode();
      $('mu-p-out').textContent = Number($('mu-p').value).toFixed(2);
      if (!rng) { resetSeed(); setTree(original); }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
