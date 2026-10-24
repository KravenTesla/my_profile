/* Ruta de aprendizaje: línea de tiempo de cinco semanas con listas marcables y progreso persistente. */
(function () {
  const GP = (window.GP = window.GP || {});
  const WEEKS = 5;
  const BOOK_URL = 'http://www.gp-field-guide.org.uk/';
  const LISTS = [['a', 'activities'], ['d', 'deliverables'], ['m', 'mastery']];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const key = (w, s, i) => `w${w}:${s}:${i}`;

  function totals(w) {
    let total = 0;
    let done = 0;
    LISTS.forEach(([s, name]) => {
      GP.t(`w.${w}.${name}`).forEach((_, i) => {
        total += 1;
        if (GP.progress.item(key(w, s, i))) done += 1;
      });
    });
    return { total, done };
  }

  function checklist(w, s, name, titleKey) {
    const items = GP.t(`w.${w}.${name}`).map((text, i) => `
      <li><label class="check-item"><input type="checkbox" data-key="${key(w, s, i)}"${GP.progress.item(key(w, s, i)) ? ' checked' : ''}><span>${esc(text)}</span></label></li>`).join('');
    return `<section class="wk-block"><h4>${esc(GP.t(titleKey))}</h4><ul class="check-list">${items}</ul></section>`;
  }

  function dataTable() {
    const rows = GP.DATA.map(([x, y]) => `<tr><td>${GP.fmtNum(x)}</td><td>${GP.fmtNum(y)}</td></tr>`).join('');
    return `<section class="wk-block"><h4>${esc(GP.t('path.dataTitle'))}</h4>
      <table class="data-table"><thead><tr><th scope="col">x</th><th scope="col">y</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }

  function init() {
    const root = document.getElementById('roadmap');
    if (!root) return;
    const timeline = root.querySelector('.timeline');
    const panel = root.querySelector('.wk-panel');
    const meter = root.querySelector('.path-meter');
    const meterFill = root.querySelector('.path-meter-fill');
    const meterText = root.querySelector('.path-meter-text');
    let current = Math.min(Math.max(GP.progress.week(), 1), WEEKS);

    function renderTimeline() {
      timeline.innerHTML = Array.from({ length: WEEKS }, (_, i) => {
        const w = i + 1;
        const done = GP.progress.isDone(w);
        return `<li class="tl-item${done ? ' is-done' : ''}">
          <button type="button" class="tl-node${w === current ? ' is-current' : ''}" data-week="${w}"${w === current ? ' aria-current="step"' : ''}>
            <span class="tl-dot" aria-hidden="true">${done ? '✓' : w}</span>
            <span class="tl-week">${esc(GP.t('path.week', { n: w }))}${done ? `<span class="visually-hidden"> (${esc(GP.t('path.done'))})</span>` : ''}</span>
            <span class="tl-title">${esc(GP.t(`w.${w}.title`))}</span>
          </button></li>`;
      }).join('');
    }

    function renderMeter() {
      const n = GP.progress.doneCount();
      meterFill.style.width = (n / WEEKS) * 100 + '%';
      meter.setAttribute('aria-valuenow', String(n));
      meterText.textContent = GP.t('path.progress', { n, total: WEEKS });
    }

    function renderCounter() {
      const t = totals(current);
      panel.querySelector('.wk-counter').textContent = GP.t('path.items', { a: t.done, b: t.total });
    }

    function renderPanel() {
      const w = current;
      const done = GP.progress.isDone(w);
      const reading = w === 1
        ? `<p>${esc(GP.t('w.1.reading'))}</p>`
        : `<p><strong>${esc(GP.t(`w.${w}.reading`))}</strong></p>
           <a class="text-link" href="${BOOK_URL}" target="_blank" rel="noopener"><span>${esc(GP.t('path.openBook'))}</span> <span aria-hidden="true">↗</span></a>`;
      panel.innerHTML = `
        <div class="wk-head">
          <p class="wk-kicker">${esc(GP.t('path.week', { n: w }))}</p>
          <h3 id="wk-title">${esc(GP.t(`w.${w}.title`))}</h3>
        </div>
        <div class="wk-grid">
          <div class="wk-col">
            <section class="wk-block"><h4>${esc(GP.t('path.objective'))}</h4><p>${esc(GP.t(`w.${w}.objective`))}</p></section>
            <section class="wk-block"><h4>${esc(GP.t('path.reading'))}</h4>${reading}</section>
            <section class="wk-block"><h4>${esc(GP.t('path.concepts'))}</h4>
              <div class="tag-list">${GP.t(`w.${w}.concepts`).map((c) => `<span>${esc(c)}</span>`).join('')}</div></section>
            ${w === 2 ? dataTable() : ''}
            <section class="wk-block wk-reflect"><h4>${esc(GP.t('path.reflect'))}</h4>
              <ul>${GP.t(`w.${w}.reflect`).map((q) => `<li>${esc(q)}</li>`).join('')}</ul></section>
          </div>
          <div class="wk-col">
            ${checklist(w, 'a', 'activities', 'path.activities')}
            ${checklist(w, 'd', 'deliverables', 'path.deliverables')}
            ${checklist(w, 'm', 'mastery', 'path.mastery')}
            <div class="wk-foot">
              <p class="wk-counter" aria-live="polite"></p>
              <button type="button" class="button ${done ? 'button-secondary' : 'button-primary'} wk-done" aria-pressed="${done}">${esc(GP.t(done ? 'path.markUndo' : 'path.markDone'))}</button>
            </div>
          </div>
        </div>`;
      renderCounter();
    }

    function renderAll() { renderTimeline(); renderMeter(); renderPanel(); }

    timeline.addEventListener('click', (ev) => {
      const b = ev.target.closest('.tl-node');
      if (!b) return;
      current = Number(b.getAttribute('data-week'));
      GP.progress.setWeek(current);
      renderTimeline();
      renderPanel();
      const nb = timeline.querySelector(`[data-week="${current}"]`);
      if (nb) nb.focus();
    });

    panel.addEventListener('change', (ev) => {
      const k = ev.target.getAttribute && ev.target.getAttribute('data-key');
      if (!k) return;
      GP.progress.setItem(k, ev.target.checked);
      renderCounter();
    });

    panel.addEventListener('click', (ev) => {
      if (!ev.target.closest('.wk-done')) return;
      GP.progress.setDone(current, !GP.progress.isDone(current));
      renderTimeline();
      renderMeter();
      renderPanel();
      panel.querySelector('.wk-done').focus();
    });

    root.querySelector('.path-reset').addEventListener('click', () => {
      if (window.confirm(GP.t('path.resetConfirm'))) {
        GP.progress.reset();
        current = 1;
        renderAll();
      }
    });

    GP.onLang(renderAll);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
