/* Progreso del estudiante en localStorage (con respaldo en memoria si el almacenamiento falla). */
(function () {
  const GP = (window.GP = window.GP || {});
  const KEY = 'gp-progress';
  let state = { done: {}, items: {}, week: 1 };

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) { /* usar estado en memoria */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
  }

  GP.progress = {
    isDone: (w) => !!state.done[w],
    setDone(w, v) { if (v) state.done[w] = true; else delete state.done[w]; save(); },
    doneCount: () => Object.keys(state.done).length,
    item: (k) => !!state.items[k],
    setItem(k, v) { if (v) state.items[k] = true; else delete state.items[k]; save(); },
    week: () => state.week,
    setWeek(w) { state.week = w; save(); },
    reset() { state = { done: {}, items: {}, week: 1 }; save(); },
  };
})();
