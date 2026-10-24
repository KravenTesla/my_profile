/* Sección «Bibliografía»: referencias agrupadas con estado de verificación explícito. */
(function () {
  const GP = window.GP;
  const { esc } = GP;

  /* status: verified | partial | pending. Los textos de relevancia y notas viven en strings-apps.js. */
  const GROUPS = [
    { id: 'found', entries: [
      { key: 'k1992', authors: 'Koza, J. R.', year: 1992, title: 'Genetic Programming: On the Programming of Computers by Means of Natural Selection', venue: 'MIT Press', ids: 'ISBN 978-0-262-11170-6 · 978-0-262-52791-0', status: 'partial', links: [{ href: 'https://mitpress.mit.edu/9780262527910/genetic-programming/', label: 'MIT Press' }] },
    ] },
    { id: 'book', entries: [
      { key: 'poli', authors: 'Poli, R., Langdon, W. B., & McPhee, N. F. (con contribuciones de J. R. Koza)', year: 2008, title: 'A Field Guide to Genetic Programming', venue: 'Lulu · acceso abierto (Creative Commons)', ids: 'ISBN 978-1-4092-0073-4', status: 'verified', links: [{ href: 'http://www.gp-field-guide.org.uk/', label: 'gp-field-guide.org.uk' }, { href: 'https://www.cs.ucl.ac.uk/staff/W.Langdon/ftp/papers/poli08_fieldguide.pdf', label: 'PDF' }, { href: 'https://wiki.creativecommons.org/wiki/A_Field_Guide_to_Genetic_Programming', label: 'Creative Commons' }] },
    ] },
    { id: 'apps', entries: [
      { key: 'lohn', authors: 'Lohn, J. D., Hornby, G. S., & Linden, D. S.', year: 2004, title: 'An Evolved Antenna for Deployment on NASA’s Space Technology 5 Mission', venue: 'NASA Technical Reports Server · Genetic Programming Theory and Practice II (pendiente de verificar)', ids: 'NASA ID 20040152147', status: 'partial', links: [{ href: 'https://ntrs.nasa.gov/citations/20040152147', label: 'NASA NTRS' }] },
      { key: 'koza2000', authors: 'Koza, J. R., Bennett, F. H. III, Andre, D., & Keane, M. A.', year: 2000, title: 'Synthesis of topology and sizing of analog electrical circuits by means of genetic programming', venue: 'Computer Methods in Applied Mechanics and Engineering, 186(2–4), 459–482', ids: 'DOI 10.1016/S0045-7825(99)00397-7', status: 'verified', links: [{ href: 'https://doi.org/10.1016/S0045-7825(99)00397-7', label: 'DOI' }, { href: 'https://gpbib.cs.ucl.ac.uk/gp-html/Koza_2000_CMAME.html', label: 'GP Bibliography' }] },
      { key: 'schmidt', authors: 'Schmidt, M., & Lipson, H.', year: 2009, title: 'Distilling free-form natural laws from experimental data', venue: 'Science, 324(5923), 81–85', ids: 'DOI 10.1126/science.1165893', status: 'verified', links: [{ href: 'https://doi.org/10.1126/science.1165893', label: 'DOI' }] },
      { key: 'barm', authors: 'Barmpalexis, P., Kachrimanis, K., Tsakonas, A., & Georgarakis, E.', year: 2011, title: 'Symbolic regression via genetic programming in the optimization of a controlled release pharmaceutical formulation', venue: 'Chemometrics and Intelligent Laboratory Systems, 107(1), 75–82', ids: 'DOI 10.1016/j.chemolab.2011.01.012', status: 'verified', links: [{ href: 'https://doi.org/10.1016/j.chemolab.2011.01.012', label: 'DOI' }] },
      { key: 'kay', authors: 'Kay, H., Kay, S., Mowbray, M., Lane, A., Mendoza, C., Martin, P., & Zhang, D.', year: 2023, title: 'Symbolic regression based interpretable data-driven soft-sensor for process quality control', venue: 'Computer Aided Chemical Engineering, 52, 1525–1530', ids: 'DOI: pendiente de verificar', status: 'partial', links: [{ href: 'https://www.sciencedirect.com/science/article/pii/B9780443152740502432', label: 'ScienceDirect' }] },
      { key: 'kay2024', authors: 'Kay, H., Kay, S., Mowbray, M., Lane, A., Mendoza, C., Martin, P., & Zhang, D.', year: 2024, title: 'Constructing a Symbolic Regression-Based Interpretable Soft Sensor for Industrial Data Analytics and Product Quality Control', venue: 'Industrial & Engineering Chemistry Research, 63(9), 4083–4092', ids: 'DOI 10.1021/acs.iecr.3c04021', status: 'verified', links: [{ href: 'https://doi.org/10.1021/acs.iecr.3c04021', label: 'DOI' }] },
      { key: 'gpbib', authors: 'GP Bibliography', year: '', title: 'The Collection of Computer Science Bibliographies: Genetic Programming', venue: 'University College London', ids: '', status: 'partial', links: [{ href: 'https://gpbib.cs.ucl.ac.uk/', label: 'gpbib.cs.ucl.ac.uk' }] },
    ] },
  ];

  function entryHtml(e) {
    return `<li class="bib-item">
      <div class="bib-main">
        <p class="bib-cite">${esc(e.authors)}${e.year ? ` (${e.year}).` : '.'} <i>${esc(e.title)}</i>. ${esc(e.venue)}.${e.ids ? ` <span class="bib-ids">${esc(e.ids)}</span>` : ''}</p>
        <p class="bib-rel"><b>${esc(GP.t('bib.rel'))}:</b> ${esc(GP.t(`bib.${e.key}.rel`))}</p>
        <details class="bib-note"><summary>${esc(GP.t('bib.note'))}</summary><p>${esc(GP.t(`bib.${e.key}.note`))}</p></details>
      </div>
      <div class="bib-side">
        ${e.status === 'verified' ? '' : `<span class="badge is-${e.status}">${esc(GP.t('bib.' + e.status))}</span>`}
        <div class="bib-links">${e.links.map((l) => `<a class="text-link" href="${l.href}" target="_blank" rel="noopener"><span>${esc(l.label)}</span> <span aria-hidden="true">↗</span></a>`).join('')}</div>
      </div>
    </li>`;
  }

  function render() {
    const host = document.getElementById('bib-list');
    if (!host) return;
    const open = new Set([...host.querySelectorAll('details[open]')].map((d) => d.getAttribute('data-k')));
    host.innerHTML = GROUPS.map((g) => `<section class="bib-group"><h3>${esc(GP.t('bib.g.' + g.id))}</h3><ul class="bib-ul">${g.entries.map(entryHtml).join('')}</ul></section>`).join('');
    host.querySelectorAll('details.bib-note').forEach((d, i) => { if (open.has(String(i))) d.open = true; d.setAttribute('data-k', i); });
  }

  document.addEventListener('DOMContentLoaded', () => GP.onLang(render));
})();
