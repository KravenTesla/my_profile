/* Sección «Inicialización»: poblaciones aleatorias con Full y Grow, reproducibles con semilla. */
(function () {
  const GP = window.GP;
  const $ = (id) => document.getElementById(id);

  function init() {
    if (!$('pop-grid')) return;
    let method = 'grow';

    const seg = GP.segmented($('pop-method'), [
      { value: 'full', label: () => GP.t('pop.fullTitle') },
      { value: 'grow', label: () => GP.t('pop.growTitle') },
    ], method, (v) => { method = v; build($('pop-seed').value); });

    const num = (id) => Number($(id).value);

    function build(seed) {
      const size = num('pop-size');
      const depth = num('pop-depth');
      $('pop-size-out').textContent = size;
      $('pop-depth-out').textContent = depth;
      const s = Math.max(1, Math.floor(Number(seed)) || 1);
      $('pop-seed').value = s;
      const pop = GP.initPopulation(GP.rng(s), size, depth, method);
      $('pop-grid').replaceChildren(...pop.map((t, i) => {
        const card = GP.treeCard(t);
        card.querySelector('figcaption').insertAdjacentHTML('afterbegin', `<span class="tcard-id">${i + 1}</span>`);
        return card;
      }));
      $('pop-out').textContent = GP.t('pop.out', { n: size, m: GP.t(method === 'full' ? 'pop.fullTitle' : 'pop.growTitle'), d: depth, s });
      compare(depth);
    }

    /* Full frente a Grow con la profundidad actual: 4 árboles de muestra y estadísticas sobre 200. */
    function compare(depth) {
      $('pop-compare-title').textContent = GP.t('pop.compare', { d: depth });
      ['full', 'grow'].forEach((m) => {
        const trees = GP.initPopulation(GP.rng(2024), 200, depth, m);
        const sizes = trees.map(GP.size);
        const depths = trees.map(GP.depth);
        $('cmp-' + m).replaceChildren(...trees.slice(0, 4).map((t) => GP.treeCard(t)));
        $('cmp-' + m + '-stats').textContent = GP.t('pop.cmpStats', {
          n: trees.length, min: Math.min(...sizes), max: Math.max(...sizes), dmin: Math.min(...depths), dmax: Math.max(...depths),
        });
      });
    }

    $('pop-gen').addEventListener('click', () => build(1 + Math.floor(Math.random() * 99999)));
    $('pop-replay').addEventListener('click', () => build($('pop-seed').value));
    ['pop-size', 'pop-depth'].forEach((id) => $(id).addEventListener('input', () => build($('pop-seed').value)));
    $('pop-seed').addEventListener('change', () => build($('pop-seed').value));

    GP.onLang(() => { seg.refresh(); build($('pop-seed').value); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
