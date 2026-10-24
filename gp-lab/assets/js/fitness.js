/* Sección «Fitness»: evalúa individuos sobre los datos reales, calcula RMSE y compara con una gráfica. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);
  const { esc } = GP;

  const BASE = [['P1', 'x + 1'], ['P2', 'x * x'], ['P3', 'x^2 + 1'], ['P4', 'x^2 + 2*x + 1']];

  function evaluate(name, tree) {
    const rows = GP.DATA.map(([x, y]) => {
      const pred = GP.evaluate(tree, x);
      const err = y - pred;
      return { x, y, pred, err, err2: err * err };
    });
    const sum = rows.reduce((a, r) => a + r.err2, 0);
    const mean = sum / rows.length;
    return { name, tree, expr: GP.toExpr(tree), rows, sum, mean, rmse: Math.sqrt(mean) };
  }

  function init() {
    if (!$('eval-table')) return;
    const list = BASE.map(([n, src]) => evaluate(n, GP.parse(src)));
    let custom = null;
    let selected = 'P1';

    const all = () => (custom ? list.concat(custom) : list);
    const rank = (ind) => 1 + all().filter((o) => o.rmse < ind.rmse - 1e-9).length;
    const label = (ind) => (ind.name === 'T' ? GP.t('fit.try.name') : ind.name);

    function renderTable() {
      const xs = GP.DATA.map((d) => d[0]);
      const head = `<thead><tr><th scope="col">${esc(GP.t('fit.col.ind'))}</th><th scope="col">${esc(GP.t('fit.col.expr'))}</th>
        ${xs.map((x) => `<th scope="col">ŷ(${GP.fmtNum(x)})</th>`).join('')}<th scope="col">RMSE</th><th scope="col">${esc(GP.t('fit.col.rank'))}</th></tr></thead>`;
      const real = `<tr class="row-real"><th scope="row">${esc(GP.t('fit.rowReal'))}</th><td>f(x) = x² + 2x + 1</td>${GP.DATA.map((d) => `<td>${GP.fmtNum(d[1])}</td>`).join('')}<td>—</td><td>—</td></tr>`;
      const body = all().map((ind) => `<tr class="${ind.name === selected ? 'is-selected' : ''}">
        <th scope="row"><button type="button" class="row-btn" data-name="${ind.name}" aria-pressed="${ind.name === selected}">${esc(label(ind))}</button></th>
        <td><code>${esc(ind.expr)}</code></td>
        ${ind.rows.map((r) => `<td>${GP.fmtNum(r.pred)}</td>`).join('')}
        <td><b>${GP.fmtNum(ind.rmse)}</b></td><td>${rank(ind)}</td></tr>`).join('');
      $('eval-table').innerHTML = head + `<tbody>${real}${body}</tbody>`;
    }

    function renderDetail() {
      const ind = all().find((o) => o.name === selected) || list[0];
      $('fit-detail-title').textContent = GP.t('fit.detail', { name: `${label(ind)} = ${ind.expr}` });
      const rows = ind.rows.map((r) => `<tr><td>${GP.fmtNum(r.x)}</td><td>${GP.fmtNum(r.y)}</td><td>${GP.fmtNum(r.pred)}</td><td>${GP.fmtNum(r.err)}</td><td>${GP.fmtNum(r.err2)}</td></tr>`).join('');
      $('detail-table').innerHTML = `<thead><tr><th scope="col">x</th><th scope="col">${esc(GP.t('fit.d.real'))}</th><th scope="col">${esc(GP.t('fit.d.pred'))}</th><th scope="col">${esc(GP.t('fit.d.err'))}</th><th scope="col">${esc(GP.t('fit.d.err2'))}</th></tr></thead><tbody>${rows}</tbody>`;
      $('fit-detail-sum').innerHTML = `${esc(GP.t('fit.d.sum'))} = <b>${GP.fmtNum(ind.sum)}</b> &nbsp;→&nbsp; ${esc(GP.t('fit.d.mean', { n: GP.DATA.length }))} = <b>${GP.fmtNum(ind.mean)}</b> &nbsp;→&nbsp; ${esc(GP.t('fit.d.root'))} = <b>${GP.fmtNum(ind.rmse)}</b>`;
    }

    function renderChart() {
      const series = [{ id: 'real', main: true, cls: 'real', points: GP.DATA.map((d) => [d[0], d[1]]) }];
      all().forEach((ind, i) => {
        const pts = [];
        for (let x = -2; x <= 2.0001; x += 0.1) pts.push([x, GP.evaluate(ind.tree, x)]);
        series.push({ id: ind.name, cls: 's-' + i, points: pts, marks: ind.rows.map((r) => [r.x, r.pred]) });
      });
      GP.lineChart($('fit-chart'), { series, selected, xLabel: 'x', yLabel: 'y' });
      $('fit-legend').innerHTML = `<li><span class="sw real"></span>${esc(GP.t('fit.chart.real'))}</li>` + all().map((ind, i) =>
        `<li><button type="button" class="leg-btn${ind.name === selected ? ' is-active' : ''}" data-name="${ind.name}" aria-pressed="${ind.name === selected}"><span class="sw s-${i}"></span>${esc(label(ind))}</button></li>`).join('');
    }

    function render() { renderTable(); renderDetail(); renderChart(); }

    function pick(ev) {
      const b = ev.target.closest('[data-name]');
      if (!b) return;
      selected = b.getAttribute('data-name');
      render();
      const again = document.querySelector(`#${ev.currentTarget.id} [data-name="${selected}"]`);
      if (again) again.focus();
    }
    $('eval-table').addEventListener('click', pick);
    $('fit-legend').addEventListener('click', pick);

    $('fit-form').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const msg = $('fit-msg');
      try {
        const tree = GP.parse($('fit-input').value);
        custom = evaluate('T', tree);
        selected = 'T';
        msg.textContent = '';
        render();
      } catch (e) {
        msg.textContent = GP.t('fit.try.err');
      }
    });

    GP.onLang(() => { $('fit-msg').textContent = ''; render(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
