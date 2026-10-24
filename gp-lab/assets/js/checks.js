/* Comprobaciones de opción múltiple. Cada .check[data-check][data-correct] lee sus textos de chk.<id>.{q,o,w}. */
(function () {
  const GP = (window.GP = window.GP || {});
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(box) {
    const id = box.getAttribute('data-check');
    const correct = Number(box.getAttribute('data-correct'));
    let answer = null;

    function render() {
      const opts = GP.t(`chk.${id}.o`);
      const why = GP.t(`chk.${id}.w`);
      const answered = answer !== null;
      const items = opts.map((o, i) => {
        const state = !answered ? '' : i === correct ? ' is-correct' : i === answer ? ' is-wrong' : '';
        return `<li>
          <button type="button" class="opt${state}" data-i="${i}"${answered ? ' aria-disabled="true"' : ''}>
            <span class="opt-key" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span>${esc(o)}</span>
          </button>
          ${answered ? `<p class="opt-why${i === correct ? ' is-correct' : ''}">${esc(why[i])}</p>` : ''}
        </li>`;
      }).join('');
      const verdict = answered
        ? `<p class="check-verdict ${answer === correct ? 'is-correct' : 'is-wrong'}">${esc(GP.t(answer === correct ? 'check.ok' : 'check.no'))}</p>
           <button type="button" class="text-btn check-retry">${esc(GP.t('check.retry'))}</button>`
        : '';
      box.innerHTML = `<p class="check-title">${esc(GP.t('check.title'))}</p>
        <p class="check-q" id="${id}-q">${esc(GP.t(`chk.${id}.q`))}</p>
        <ul class="opt-list" aria-labelledby="${id}-q">${items}</ul>
        <div class="check-fb" aria-live="polite">${verdict}</div>`;
    }

    box.addEventListener('click', (ev) => {
      const opt = ev.target.closest('.opt');
      if (opt && answer === null) {
        answer = Number(opt.getAttribute('data-i'));
        render();
        const v = box.querySelector('.check-verdict');
        if (v) v.setAttribute('tabindex', '-1');
        return;
      }
      if (ev.target.closest('.check-retry')) {
        answer = null;
        render();
        const first = box.querySelector('.opt');
        if (first) first.focus();
      }
    });

    GP.onLang(render);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.check[data-check]').forEach(mount);
  });
})();
