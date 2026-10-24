/* Sección «Crossover»: intercambio real de subárboles, con animación de los subárboles en vuelo. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);
  const { esc } = GP;

  const X = () => GP.v('x');
  const presetA = () => GP.op('*', GP.op('+', X(), GP.c(1)), X());        // (x + 1) × x
  const presetB = () => GP.op('+', GP.op('*', X(), X()), GP.c(2));        // x × x + 2

  function init() {
    if (!$('xo-a')) return;
    const OPTS = { r: 21, dx: 62, dy: 78 };
    let mode = 'manual';
    let rng = null;
    let busy = false;
    let token = 0;
    let parentA = presetA();
    let parentB = presetB();
    let offA = null;
    let offB = null;

    const vA = new GP.TreeView($('xo-a'), parentA, Object.assign({ onSelect: (rec) => showPoint('a', rec) }, OPTS));
    const vB = new GP.TreeView($('xo-b'), parentB, Object.assign({ onSelect: (rec) => showPoint('b', rec) }, OPTS));
    const vOA = new GP.TreeView($('xo-oa'), parentA, OPTS);
    const vOB = new GP.TreeView($('xo-ob'), parentB, OPTS);
    [vOA, vOB].forEach((v) => { v.locked = true; });

    const steps = GP.stepList($('xo-steps'), () => GP.t('cro.steps'));
    const modeSeg = GP.segmented($('xo-mode'), [
      { value: 'manual', label: () => GP.t('cro.manual') },
      { value: 'auto', label: () => GP.t('cro.auto') },
    ], mode, (v) => { mode = v; applyMode(); });

    function showPoint(side, rec) {
      const v = side === 'a' ? vA : vB;
      $(`xo-${side}-point`).textContent = rec ? GP.nodeText(rec) : GP.t('cro.none');
      $(`xo-${side}-sub`).textContent = rec ? GP.toExpr(rec.node) : '—';
      if (!busy) { v.clearBoxes(); }
    }

    function applyMode() {
      vA.locked = vB.locked = mode === 'auto';
      $('xo-hint').textContent = GP.t(mode === 'auto' ? 'cro.hintAuto' : 'cro.hintManual');
      $('xo-msg').textContent = '';
    }

    function emptyOffspring() {
      [vOA, vOB].forEach((v) => { v.setVisible(new Set()); v.svg.classList.add('is-empty'); });
      ['xo-oa-expr', 'xo-ob-expr'].forEach((id) => { $(id).textContent = '—'; });
      $('xo-sizes').innerHTML = '';
      offA = offB = null;
    }

    function setParents(a, b) {
      token++; busy = false;
      parentA = a; parentB = b;
      vA.setTree(a); vB.setTree(b);
      [vA, vB].forEach((v) => { v.locked = mode === 'auto'; });
      showPoint('a', null); showPoint('b', null);
      $('xo-a-expr').textContent = GP.toExpr(a);
      $('xo-b-expr').textContent = GP.toExpr(b);
      vOA.setTree(a); vOB.setTree(b);
      emptyOffspring();
      steps.set(0);
      $('xo-run').disabled = false;
      $('xo-msg').textContent = '';
    }

    function resetSeed() {
      const s = Math.max(1, Math.floor(Number($('xo-seed').value)) || 1);
      $('xo-seed').value = s;
      rng = GP.rng(s);
    }

    function randomParent() { return GP.randomTree(rng, { maxDepth: 2 + rng.int(2), method: 'grow' }); }

    /* Subárboles en vuelo: dos copias que cruzan de un progenitor al otro. */
    async function fly(fromRect, toRect, subtree, cls) {
      const wrap = $('xo-wrap').getBoundingClientRect();
      const f = document.createElement('div');
      f.className = 'flyer ' + cls;
      f.style.left = fromRect.left - wrap.left + 'px';
      f.style.top = fromRect.top - wrap.top + 'px';
      f.style.width = fromRect.width + 'px';
      f.style.height = fromRect.height + 'px';
      const svg = GP.treeSvg(subtree, OPTS);
      svg.style.width = '100%'; svg.style.height = '100%';
      f.append(svg);
      $('xo-wrap').append(f);
      const anim = f.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${toRect.left - fromRect.left}px, ${toRect.top - fromRect.top}px)` }], { duration: 1300, easing: 'ease-in-out', fill: 'forwards' });
      await anim.finished.catch(() => {});
      f.remove();
    }

    async function run() {
      if (busy) return;
      let ia, ib;
      if (mode === 'auto') {
        ia = rng.int(vA.recs.length); ib = rng.int(vB.recs.length);
        vA.select(ia); vB.select(ib);
      } else {
        ia = vA.selected; ib = vB.selected;
        if (ia === null || ib === null) { $('xo-msg').textContent = GP.t('cro.needBoth'); return; }
      }
      $('xo-msg').textContent = '';
      busy = true;
      const my = ++token;
      $('xo-run').disabled = true;
      vA.clearBoxes(); vB.clearBoxes();
      vA.mark(null, 'is-ghost'); vB.mark(null, 'is-ghost');
      emptyOffspring();

      steps.set(1); await GP.wait(700); if (my !== token) return;
      steps.set(2); await GP.wait(900); if (my !== token) return;
      steps.set(3);
      const boxA = vA.box(ia, 'is-a');
      const boxB = vB.box(ib, 'is-b');
      await GP.wait(1000); if (my !== token) return;

      steps.set(4);
      const pathA = GP.pathTo(vA.recs, ia);
      const pathB = GP.pathTo(vB.recs, ib);
      const subA = GP.getAt(parentA, pathA);
      const subB = GP.getAt(parentB, pathB);
      if (!GP.reducedMotion() && 'animate' in Element.prototype) {
        const rA = boxA.getBoundingClientRect();
        const rB = boxB.getBoundingClientRect();
        vA.mark(GP.subtreeIds(vA.recs, ia), 'is-ghost');
        vB.mark(GP.subtreeIds(vB.recs, ib), 'is-ghost');
        await Promise.all([fly(rA, rB, subA, 'is-a'), fly(rB, rA, subB, 'is-b')]);
        if (my !== token) return;
        vA.mark(null, 'is-ghost'); vB.mark(null, 'is-ghost');
      }

      steps.set(5);
      [offA, offB] = GP.crossover(parentA, pathA, parentB, pathB);
      await GP.wait(500); if (my !== token) return;

      steps.set(6);
      vOA.setTree(offA); vOB.setTree(offB);
      vOA.svg.classList.remove('is-empty'); vOB.svg.classList.remove('is-empty');
      vOA.mark(GP.subtreeIds(vOA.recs, vOA.idAt(pathA)), 'from-b'); // A recibe el subárbol de B
      vOB.mark(GP.subtreeIds(vOB.recs, vOB.idAt(pathB)), 'from-a'); // B recibe el subárbol de A
      await GP.wait(900); if (my !== token) return;

      steps.set(7);
      renderResult();
      busy = false;
      $('xo-run').disabled = false;
    }

    function renderResult() {
      if (!offA) return;
      $('xo-oa-expr').textContent = GP.toExpr(offA);
      $('xo-ob-expr').textContent = GP.toExpr(offB);
      const limit = Math.max(1, Number($('xo-limit').value) || 1);
      const row = (name, t) => {
        const d = GP.depth(t);
        const over = name.startsWith('off') && d > limit;
        return `<tr class="${over ? 'is-bad' : ''}"><th scope="row">${esc(GP.t('cro.' + name))}</th><td>${GP.size(t)}</td><td>${d}</td><td>${name.startsWith('off') ? esc(GP.t(over ? 'cro.limitBad' : 'cro.limitOk')) : ''}</td></tr>`;
      };
      $('xo-sizes').innerHTML = `<thead><tr><th scope="col">${esc(GP.t('cro.col.tree'))}</th><th scope="col">${esc(GP.t('cro.col.nodes'))}</th><th scope="col">${esc(GP.t('cro.col.depth'))}</th><th scope="col"></th></tr></thead>
        <tbody>${row('parentA', parentA)}${row('parentB', parentB)}${row('offA', offA)}${row('offB', offB)}</tbody>`;
    }

    $('xo-run').addEventListener('click', run);
    $('xo-reset').addEventListener('click', () => setParents(parentA, parentB));
    $('xo-preset').addEventListener('click', () => setParents(presetA(), presetB()));
    $('xo-random').addEventListener('click', () => setParents(randomParent(), randomParent()));
    $('xo-seed').addEventListener('change', resetSeed);
    $('xo-limit').addEventListener('input', renderResult);

    GP.onLang(() => {
      modeSeg.refresh(); steps.refresh();
      [vA, vB, vOA, vOB].forEach((v) => v.labelNodes());
      applyMode();
      if (!rng) { resetSeed(); setParents(parentA, parentB); }
      else {
        showPoint('a', vA.selected === null ? null : vA.recs[vA.selected]);
        showPoint('b', vB.selected === null ? null : vB.recs[vB.selected]);
        renderResult();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
