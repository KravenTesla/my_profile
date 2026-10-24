/* Sección «Representación mediante árboles»: expresiones, construcción paso a paso, selección de nodos y valores. */
(function () {
  const GP = (window.GP = window.GP || {});
  const STEP_MS = 1100;

  const X = () => GP.v('x');
  const sq = () => GP.op('*', X(), X());
  const EXPRS = [
    () => GP.op('+', GP.op('+', sq(), GP.op('*', GP.c(2), X())), GP.c(1)),
    () => GP.op('*', GP.op('+', X(), GP.c(2)), GP.op('-', X(), GP.c(1))),
    () => GP.op('+', GP.op('+', GP.op('*', sq(), X()), GP.op('*', GP.c(3), X())), GP.c(2)),
    () => GP.op('+', GP.fn('sin', X()), GP.c(1)),
  ];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function init() {
    const svg = $('tree-svg');
    if (!svg) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let exprIdx = 0;
    let step = null;   // null = árbol completo
    let timer = null;
    let order = [];

    const view = new GP.TreeView(svg, EXPRS[0](), { r: 21, dx: 62, dy: 78, onSelect: renderPanel });

    function bfsOrder() {
      const out = [];
      const queue = [0];
      while (queue.length) {
        const id = queue.shift();
        out.push(id);
        queue.push(...view.recs[id].childIds);
      }
      return out;
    }

    /* ---- selector de expresión ---- */
    function renderExprButtons() {
      $('tree-expr-group').innerHTML = EXPRS.map((_, i) =>
        `<button type="button" class="seg${i === exprIdx ? ' is-active' : ''}" role="radio" aria-checked="${i === exprIdx}" tabindex="${i === exprIdx ? 0 : -1}" data-i="${i}">${esc(GP.t('trees.expr.' + (i + 1)))}</button>`).join('');
    }

    function loadExpr(i) {
      stopTimer();
      exprIdx = i;
      step = null;
      view.setTree(EXPRS[i]());
      view.setValues($('tv-toggle').checked, Number($('tv-x').value));
      order = bfsOrder();
      view.select(null);
      renderExprButtons();
      renderStatic();
      renderControls();
      $('tb-caption').textContent = '';
    }

    function renderStatic() {
      const root = view.root;
      $('tree-expr-out').textContent = 'f(x) = ' + GP.toExpr(root);
      const note = $('tree-note');
      if (exprIdx === 3) note.textContent = GP.t('trees.noteFn');
      else note.textContent = GP.t('trees.noteSquare');
      const total = GP.size(root);
      const leaves = GP.leaves(root);
      const stats = [['nodes', total], ['depth', GP.depth(root)], ['leaves', leaves], ['internal', total - leaves]];
      $('tree-stats').innerHTML = stats.map(([k, v]) => `<div><dt>${esc(GP.t('trees.s.' + k))}</dt><dd>${v}</dd></div>`).join('');
    }

    /* ---- panel del nodo ---- */
    function renderPanel(rec) {
      const panel = $('node-panel');
      if (!rec) {
        panel.innerHTML = `<p class="panel-empty">${esc(GP.t('trees.panelEmpty'))}</p>`;
        return;
      }
      const n = rec.node;
      const xv = Number($('tv-x').value);
      const kids = rec.childIds.length
        ? rec.childIds.map((c) => `<code>${esc(GP.toExpr(view.recs[c].node))}</code>`).join(' · ')
        : esc(GP.t('trees.f.none'));
      const rows = [
        ['type', `<span class="kind-chip kind-${n.kind}"><i aria-hidden="true"></i>${esc(GP.t('trees.kind.' + n.kind))}</span>`],
        ['symbol', `<code>${esc(GP.display(n.label))}</code>`],
        ['depth', rec.depth + (rec.depth === 0 ? ` (${esc(GP.t('trees.f.root'))})` : '')],
        ['children', kids],
        ['size', String(GP.size(n))],
        ['sub', `<code>${esc(GP.toExpr(n))}</code>`],
      ];
      const valueRow = `<div><dt>${esc(GP.t('trees.f.value', { x: GP.fmtNum(xv) }))}</dt><dd><code>${GP.fmtNum(GP.evaluate(n, xv))}</code></dd></div>`;
      panel.innerHTML = `
        <p class="kind-text">${esc(GP.t('trees.kindText.' + n.kind))}</p>
        ${rec.depth === 0 ? `<p class="root-text">${esc(GP.t('trees.rootText'))}</p>` : ''}
        <dl class="fields">${rows.map(([k, v]) => `<div><dt>${esc(GP.t('trees.f.' + k))}</dt><dd>${v}</dd></div>`).join('')}${valueRow}</dl>`;
    }

    /* ---- construcción paso a paso ---- */
    function stopTimer() { clearInterval(timer); timer = null; }

    function applyStep() {
      if (step === null) {
        view.setVisible(null);
        $('tb-caption').textContent = GP.t('trees.cap.done');
      } else {
        const ids = new Set(order.slice(0, step));
        view.setVisible(ids);
        if (view.selected !== null && !ids.has(view.selected)) view.select(null);
        const rec = view.recs[order[step - 1]];
        const key = rec.id === 0 ? 'root' : rec.childIds.length ? 'internal' : 'leaf';
        $('tb-caption').textContent = GP.t('trees.cap.step', { n: step, total: order.length }) + ' ' + GP.t('trees.cap.' + key, { label: GP.display(rec.node.label) });
      }
      renderControls();
    }

    function advance() {
      if (step === null) step = 1;
      else if (step >= order.length) { step = null; stopTimer(); }
      else step += 1;
      applyStep();
    }

    function startBuild(autoplay) {
      stopTimer();
      view.select(null);
      step = 1;
      applyStep();
      if (autoplay) timer = setInterval(advance, STEP_MS);
      renderControls();
    }

    function renderControls() {
      const building = step !== null;
      const playing = timer !== null;
      $('tb-build').hidden = building;
      $('tb-play').hidden = !building;
      $('tb-next').hidden = false;
      $('tb-full').hidden = !building;
      $('tb-play').textContent = GP.t(playing ? 'trees.playing' : 'trees.resume');
      $('tb-play').setAttribute('aria-pressed', String(playing));
    }

    $('tb-build').addEventListener('click', () => startBuild(!reduced));
    $('tb-play').addEventListener('click', () => {
      if (timer) { stopTimer(); renderControls(); } else {
        timer = setInterval(advance, STEP_MS);
        renderControls();
      }
    });
    $('tb-next').addEventListener('click', () => { stopTimer(); if (step === null) { view.select(null); step = 1; applyStep(); } else advance(); renderControls(); });
    $('tb-full').addEventListener('click', () => { stopTimer(); step = null; applyStep(); });

    /* ---- selector de expresión ---- */
    const group = $('tree-expr-group');
    group.addEventListener('click', (ev) => {
      const b = ev.target.closest('.seg');
      if (b) { loadExpr(Number(b.getAttribute('data-i'))); const nb = group.querySelector('.is-active'); if (nb) nb.focus(); }
    });
    group.addEventListener('keydown', (ev) => {
      const d = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      ev.preventDefault();
      loadExpr((exprIdx + d + EXPRS.length) % EXPRS.length);
      group.querySelector('.is-active').focus();
    });

    /* ---- valores de nodo ---- */
    function syncValues() {
      const on = $('tv-toggle').checked;
      const xv = Number($('tv-x').value);
      $('tv-xval').textContent = GP.fmtNum(xv);
      $('tv-x').disabled = !on;
      $('tv-hint').hidden = !on;
      view.setValues(on, xv);
      if (view.selected !== null) renderPanel(view.recs[view.selected]);
    }
    $('tv-toggle').addEventListener('change', syncValues);
    $('tv-x').addEventListener('input', syncValues);

    GP.onLang(() => {
      view.labelNodes();
      renderExprButtons();
      renderStatic();
      renderControls();
      renderPanel(view.selected === null ? null : view.recs[view.selected]);
      if (step !== null) applyStep(); else if ($('tb-caption').textContent) $('tb-caption').textContent = GP.t('trees.cap.done');
    });

    order = bfsOrder();
    syncValues();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
