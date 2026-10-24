/* i18n: diccionario ES/EN, idioma persistente y actualización del DOM. */
(function () {
  const GP = (window.GP = window.GP || {});

  const D = { es: {}, en: {} };

  /* ---------- Navegación y marco ---------- */
  Object.assign(D.es, {
    'page.title': 'Laboratorio de Genetic Programming | José Manuel Muñoz Contreras',
    skip: 'Saltar al contenido',
    'nav.home': 'Inicio', 'nav.path': 'Ruta', 'nav.basics': 'Fundamentos', 'nav.trees': 'Árboles', 'nav.site': 'Sitio principal',
    'nav.menuOpen': 'Abrir menú', 'nav.menuClose': 'Cerrar menú', 'nav.aria': 'Navegación del laboratorio',
    'theme.toLight': 'Cambiar a tema claro', 'theme.toDark': 'Cambiar a tema oscuro',
    'lang.aria': 'Switch to English', 'lang.label': 'EN',
    'footer.text': 'Laboratorio de aprendizaje · Genetic Programming', 'footer.back': 'Volver arriba',
    'footer.note': 'Material didáctico · Contenido sujeto a actualización',
    'check.title': 'Comprueba tu aprendizaje', 'check.correct': 'Correcto.', 'check.wrong': 'No es la respuesta correcta.',
    'check.retry': 'Intentar de nuevo', 'check.ok': 'Respuesta correcta', 'check.no': 'Respuesta incorrecta',
    'reflect.label': 'Pregunta de reflexión',
  });
  Object.assign(D.en, {
    'page.title': 'Genetic Programming Lab | José Manuel Muñoz Contreras',
    skip: 'Skip to content',
    'nav.home': 'Home', 'nav.path': 'Roadmap', 'nav.basics': 'Fundamentals', 'nav.trees': 'Trees', 'nav.site': 'Main site',
    'nav.menuOpen': 'Open menu', 'nav.menuClose': 'Close menu', 'nav.aria': 'Lab navigation',
    'theme.toLight': 'Switch to light theme', 'theme.toDark': 'Switch to dark theme',
    'lang.aria': 'Cambiar a español', 'lang.label': 'ES',
    'footer.text': 'Learning lab · Genetic Programming', 'footer.back': 'Back to top',
    'footer.note': 'Teaching material · Content subject to updates',
    'check.title': 'Check your understanding', 'check.correct': 'Correct.', 'check.wrong': 'That is not the correct answer.',
    'check.retry': 'Try again', 'check.ok': 'Correct answer', 'check.no': 'Incorrect answer',
    'reflect.label': 'Reflection question',
  });

  /* ---------- Hero ---------- */
  Object.assign(D.es, {
    'hero.eyebrow': 'Laboratorio de aprendizaje',
    'hero.title': 'Genetic Programming',
    'hero.sub': 'Cómo evolucionan los programas para resolver problemas',
    'hero.lead': 'Aprende cómo una computadora puede generar, evaluar, combinar y modificar programas para encontrar soluciones a problemas sin que tengamos que especificar previamente la estructura de la solución.',
    'hero.cta1': 'Comenzar aprendizaje', 'hero.cta2': 'Explorar cómo funciona GP', 'hero.cta3': 'Consultar ruta de estudio',
    'hero.sceneLabel': 'Animación conceptual del ciclo evolutivo de programas',
    'hero.play': 'Reproducir', 'hero.pause': 'Pausar', 'hero.prev': 'Paso anterior', 'hero.next': 'Paso siguiente',
    'hero.step': 'Paso {n} de {total}',
    'hero.goStage': 'Ir al paso {n}',
    'hero.note': 'Animación conceptual. Los árboles son ejemplos pequeños y los errores se calculan con los datos de f(x) = x² + 2x + 1; no es una ejecución completa de GP.',
    'hero.stages': [
      { t: 'Población inicial', d: 'GP parte de varios programas representados como árboles. En una ejecución real se generan al azar; aquí usamos cuatro ejemplos.' },
      { t: 'Evaluación', d: 'Cada programa se prueba con los datos del problema. Una barra más corta significa menor error: mejor programa.' },
      { t: 'Selección', d: 'Los programas con menor error tienen más oportunidades de ser progenitores. Aquí se resaltan los dos mejores.' },
      { t: 'Elegir subárboles', d: 'En cada progenitor se elige un subárbol. Ambos se van a intercambiar.' },
      { t: 'Nuevos programas', d: 'Tras el intercambio nacen dos descendientes que combinan material de ambos progenitores.' },
      { t: 'Hacia una solución', d: 'Repetir el ciclo durante muchas generaciones puede producir programas cada vez mejores, como x² + 2x + 1. No está garantizado en cada ejecución.' },
    ],
    'hero.err': 'RMSE', 'hero.parent': 'progenitor', 'hero.parentA': 'Progenitor A', 'hero.parentB': 'Progenitor B',
    'hero.subA': 'subárbol A', 'hero.subB': 'subárbol B', 'hero.child': 'Descendiente {n}',
  });
  Object.assign(D.en, {
    'hero.eyebrow': 'Learning lab',
    'hero.title': 'Genetic Programming',
    'hero.sub': 'How programs evolve to solve problems',
    'hero.lead': 'Learn how a computer can generate, evaluate, combine, and modify programs to find solutions to problems without us having to specify the structure of the solution beforehand.',
    'hero.cta1': 'Start learning', 'hero.cta2': 'Explore how GP works', 'hero.cta3': 'View study roadmap',
    'hero.sceneLabel': 'Conceptual animation of the evolutionary cycle of programs',
    'hero.play': 'Play', 'hero.pause': 'Pause', 'hero.prev': 'Previous step', 'hero.next': 'Next step',
    'hero.step': 'Step {n} of {total}',
    'hero.goStage': 'Go to step {n}',
    'hero.note': 'Conceptual animation. The trees are small examples and the errors are computed on the f(x) = x² + 2x + 1 data; this is not a full GP run.',
    'hero.stages': [
      { t: 'Initial population', d: 'GP starts from several programs represented as trees. In a real run they are generated at random; here we use four examples.' },
      { t: 'Evaluation', d: 'Each program is tested on the problem data. A shorter bar means lower error: a better program.' },
      { t: 'Selection', d: 'Programs with lower error have a higher chance of becoming parents. The two best are highlighted here.' },
      { t: 'Choosing subtrees', d: 'A subtree is chosen in each parent. Both are about to be exchanged.' },
      { t: 'New programs', d: 'After the exchange, two offspring are born that combine material from both parents.' },
      { t: 'Towards a solution', d: 'Repeating the cycle for many generations can produce increasingly better programs, such as x² + 2x + 1. This is not guaranteed in every run.' },
    ],
    'hero.err': 'RMSE', 'hero.parent': 'parent', 'hero.parentA': 'Parent A', 'hero.parentB': 'Parent B',
    'hero.subA': 'subtree A', 'hero.subB': 'subtree B', 'hero.child': 'Offspring {n}',
  });

  /* ---------- Ruta de aprendizaje ---------- */
  Object.assign(D.es, {
    'path.eyebrow': 'Ruta de aprendizaje',
    'path.title': 'Cinco semanas para comprender GP',
    'path.intro': 'Cada semana tiene un objetivo, una lectura de A Field Guide to Genetic Programming, actividades y un entregable. Marca tu avance tú mismo: nada se completa automáticamente.',
    'path.timelineAria': 'Semanas de la ruta de aprendizaje',
    'path.week': 'Semana {n}', 'path.done': 'completada',
    'path.objective': 'Objetivo de aprendizaje', 'path.reading': 'Lectura asignada', 'path.concepts': 'Conceptos fundamentales',
    'path.activities': 'Actividades', 'path.deliverables': 'Entregables', 'path.mastery': 'Criterios de dominio',
    'path.reflect': 'Preguntas de reflexión', 'path.openBook': 'Abrir el libro',
    'path.markDone': 'Marcar semana como completada', 'path.markUndo': 'Quitar marca de completada',
    'path.progress': '{n} de {total} semanas completadas', 'path.items': '{a} de {b} elementos marcados en esta semana',
    'path.reset': 'Reiniciar progreso', 'path.resetConfirm': '¿Borrar todo el progreso guardado en este navegador?',
    'path.saved': 'Tu progreso se guarda únicamente en este navegador.',
    'path.dataTitle': 'Datos del problema',
    'w.1.title': 'Preparación conceptual', 'w.2.title': 'Introducción a GP', 'w.3.title': 'Mecánica de GP',
    'w.4.title': 'Configuración del problema', 'w.5.title': 'Ejecución completa de GP',
    'w.1.reading': 'Sin capítulo asignado: repasa árboles, nodos y recursividad de tus apuntes de estructuras de datos.',
    'w.2.reading': 'Capítulo 1 — Introduction',
    'w.3.reading': 'Capítulo 2 — Representation, Initialisation and Operators in Tree-based GP',
    'w.4.reading': 'Capítulo 3 — Getting Ready to Run Genetic Programming',
    'w.5.reading': 'Capítulo 4 — Example Genetic Programming Run',
    'w.1.objective': 'Comprender los conceptos matemáticos y computacionales que se necesitan para estudiar GP.',
    'w.2.objective': 'Definir GP, diferenciar Genetic Algorithms de Genetic Programming, comprender qué es un individuo, qué significa evolucionar programas y qué es el fitness.',
    'w.3.objective': 'Comprender cómo se representan, inicializan y modifican los programas en GP basado en árboles.',
    'w.4.objective': 'Aprender a preparar un problema para GP: conjuntos de funciones y terminales, fitness, parámetros y criterio de terminación.',
    'w.5.objective': 'Comprender cómo se conectan todos los componentes de GP en una ejecución completa.',
    'w.1.concepts': ['Algoritmo', 'Árboles', 'Nodos', 'Terminales', 'Funciones', 'Recursividad', 'Población', 'Optimización', 'Fitness'],
    'w.2.concepts': ['Genetic Programming', 'GA frente a GP', 'Individuo', 'Evolucionar programas', 'Fitness'],
    'w.3.concepts': ['Tree-based representation', 'Initialisation', 'Selection', 'Recombination', 'Crossover', 'Mutation'],
    'w.4.concepts': ['Terminal set', 'Function set', 'Closure', 'Sufficiency', 'Fitness function', 'GP parameters', 'Termination criteria'],
    'w.5.concepts': ['Ciclo evolutivo completo', 'Generaciones', 'Interacción de operadores', 'Terminación'],
    'w.1.activities': [
      'Representa f(x) = x² + 2x + 1 mediante un árbol de expresión.',
      'Representa f(x) = (x + 2) × (x − 1) mediante un árbol de expresión.',
      'Representa f(x) = x³ + 3x + 2 mediante un árbol de expresión.',
      'Comprueba tus dibujos con la sección «Representación mediante árboles» de esta página.',
    ],
    'w.2.activities': [
      'Toma el problema f(x) = x² + 2x + 1 con los cinco datos de la tabla.',
      'Evalúa a mano x + 1 en cada valor de x.',
      'Evalúa a mano x × x en cada valor de x.',
      'Evalúa a mano x² + 1 en cada valor de x.',
      'Evalúa a mano x² + 2x + 1 en cada valor de x.',
    ],
    'w.3.activities': [
      'Crea una población de diez árboles.',
      'Evalúa a cada individuo con los datos del problema.',
      'Realiza manualmente una selección, un cruce y una mutación.',
    ],
    'w.4.activities': [
      'Diseña la configuración de GP para la regresión simbólica f(x) = x² + 2x + 1.',
      'Define T = {x, constantes} y F = {+, −, ×, división protegida}.',
      'Define la función de fitness: RMSE = √( (1/n) · Σ (yᵢ − ŷᵢ)² ).',
    ],
    'w.5.activities': [
      'Documenta una ejecución completa siguiendo estas siete etapas:',
      '1. Inicialización.', '2. Evaluación.', '3. Selección.', '4. Crossover.', '5. Mutación.', '6. Nueva generación.', '7. Terminación.',
    ],
    'w.1.deliverables': ['Tres expresiones representadas como árboles.', 'Explicación de la diferencia entre nodos operadores y nodos terminales.'],
    'w.2.deliverables': ['Documento con las expresiones evaluadas y una explicación de por qué una solución es mejor que otra.'],
    'w.3.deliverables': ['Documento que describe una generación evolutiva completa.'],
    'w.4.deliverables': ['Especificación matemática y técnica del problema.'],
    'w.5.deliverables': ['Pseudocódigo completo de un algoritmo GP y explicación de cada etapa.'],
    'w.1.mastery': ['Convierto una expresión en un árbol y regreso del árbol a la expresión.', 'Identifico la raíz, las hojas y la profundidad de un árbol.', 'Distingo operadores, funciones y terminales.'],
    'w.2.mastery': ['Calculo la salida de una expresión para cada valor de x.', 'Comparo dos expresiones usando sus errores sobre los datos.', 'Explico en qué se diferencian GA y GP.'],
    'w.3.mastery': ['Genero árboles con los métodos Full y Grow.', 'Describo cómo funciona un torneo, un crossover de subárboles y una mutación de subárbol.', 'Explico por qué los árboles pueden crecer tras muchos cruces.'],
    'w.4.mastery': ['Defino T y F y justifico que cumplen cierre y suficiencia.', 'Explico por qué la división debe protegerse.', 'Elijo parámetros y un criterio de terminación razonables.'],
    'w.5.mastery': ['Escribo el pseudocódigo del ciclo evolutivo completo.', 'Explico qué entra y qué sale de cada etapa.', 'Anticipo qué ocurre al cambiar una probabilidad de operador.'],
    'w.1.reflect': ['¿Por qué la raíz es la última operación que se calcula?', '¿Qué ventaja tiene representar una fórmula como árbol y no como texto?'],
    'w.2.reflect': ['Si dos expresiones tienen errores parecidos, ¿cuál preferirías y por qué?', '¿Qué información necesita GP para saber si un programa es bueno?'],
    'w.3.reflect': ['¿Qué ocurre con el tamaño de los árboles tras muchos cruces?', 'Si ya existe el cruce, ¿por qué hace falta la mutación?'],
    'w.4.reflect': ['¿Qué ocurre si F no permite construir la solución?', '¿Cómo cambiaría la función de fitness si el problema fuera otro?'],
    'w.5.reflect': ['¿Cómo sabes que una ejecución terminó bien?', '¿Qué pasaría si en cada generación se reemplazara toda la población sin conservar nada?'],
  });
  Object.assign(D.en, {
    'path.eyebrow': 'Learning roadmap',
    'path.title': 'Five weeks to understand GP',
    'path.intro': 'Each week has an objective, a reading from A Field Guide to Genetic Programming, activities, and a deliverable. You mark your own progress: nothing is completed automatically.',
    'path.timelineAria': 'Weeks of the learning roadmap',
    'path.week': 'Week {n}', 'path.done': 'completed',
    'path.objective': 'Learning objective', 'path.reading': 'Assigned reading', 'path.concepts': 'Key concepts',
    'path.activities': 'Activities', 'path.deliverables': 'Deliverables', 'path.mastery': 'Mastery criteria',
    'path.reflect': 'Reflection questions', 'path.openBook': 'Open the book',
    'path.markDone': 'Mark week as completed', 'path.markUndo': 'Remove completed mark',
    'path.progress': '{n} of {total} weeks completed', 'path.items': '{a} of {b} items checked this week',
    'path.reset': 'Reset progress', 'path.resetConfirm': 'Delete all progress saved in this browser?',
    'path.saved': 'Your progress is saved only in this browser.',
    'path.dataTitle': 'Problem data',
    'w.1.title': 'Conceptual preparation', 'w.2.title': 'Introduction to GP', 'w.3.title': 'GP mechanics',
    'w.4.title': 'Problem setup', 'w.5.title': 'A complete GP run',
    'w.1.reading': 'No chapter assigned: review trees, nodes, and recursion from your data-structures notes.',
    'w.2.reading': 'Chapter 1 — Introduction',
    'w.3.reading': 'Chapter 2 — Representation, Initialisation and Operators in Tree-based GP',
    'w.4.reading': 'Chapter 3 — Getting Ready to Run Genetic Programming',
    'w.5.reading': 'Chapter 4 — Example Genetic Programming Run',
    'w.1.objective': 'Understand the mathematical and computational concepts needed to study GP.',
    'w.2.objective': 'Define GP, tell Genetic Algorithms and Genetic Programming apart, understand what an individual is, what it means to evolve programs, and what fitness is.',
    'w.3.objective': 'Understand how programs are represented, initialised, and modified in tree-based GP.',
    'w.4.objective': 'Learn to prepare a problem for GP: function and terminal sets, fitness, parameters, and termination criterion.',
    'w.5.objective': 'Understand how all the components of GP connect in a complete run.',
    'w.1.concepts': ['Algorithm', 'Trees', 'Nodes', 'Terminals', 'Functions', 'Recursion', 'Population', 'Optimisation', 'Fitness'],
    'w.2.concepts': ['Genetic Programming', 'GA versus GP', 'Individual', 'Evolving programs', 'Fitness'],
    'w.3.concepts': ['Tree-based representation', 'Initialisation', 'Selection', 'Recombination', 'Crossover', 'Mutation'],
    'w.4.concepts': ['Terminal set', 'Function set', 'Closure', 'Sufficiency', 'Fitness function', 'GP parameters', 'Termination criteria'],
    'w.5.concepts': ['Complete evolutionary cycle', 'Generations', 'Operator interaction', 'Termination'],
    'w.1.activities': [
      'Represent f(x) = x² + 2x + 1 as an expression tree.',
      'Represent f(x) = (x + 2) × (x − 1) as an expression tree.',
      'Represent f(x) = x³ + 3x + 2 as an expression tree.',
      'Check your drawings with the “Tree representation” section of this page.',
    ],
    'w.2.activities': [
      'Take the problem f(x) = x² + 2x + 1 with the five data points in the table.',
      'Evaluate x + 1 by hand at each value of x.',
      'Evaluate x × x by hand at each value of x.',
      'Evaluate x² + 1 by hand at each value of x.',
      'Evaluate x² + 2x + 1 by hand at each value of x.',
    ],
    'w.3.activities': [
      'Create a population of ten trees.',
      'Evaluate each individual on the problem data.',
      'Manually perform one selection, one crossover, and one mutation.',
    ],
    'w.4.activities': [
      'Design the GP configuration for the symbolic regression f(x) = x² + 2x + 1.',
      'Define T = {x, constants} and F = {+, −, ×, protected division}.',
      'Define the fitness function: RMSE = √( (1/n) · Σ (yᵢ − ŷᵢ)² ).',
    ],
    'w.5.activities': [
      'Document a complete run following these seven stages:',
      '1. Initialisation.', '2. Evaluation.', '3. Selection.', '4. Crossover.', '5. Mutation.', '6. New generation.', '7. Termination.',
    ],
    'w.1.deliverables': ['Three expressions represented as trees.', 'An explanation of the difference between operator nodes and terminal nodes.'],
    'w.2.deliverables': ['A document with the evaluated expressions and an explanation of why one solution is better than another.'],
    'w.3.deliverables': ['A document describing one complete evolutionary generation.'],
    'w.4.deliverables': ['Mathematical and technical specification of the problem.'],
    'w.5.deliverables': ['Complete pseudocode of a GP algorithm and an explanation of each stage.'],
    'w.1.mastery': ['I convert an expression into a tree and go back from the tree to the expression.', 'I identify the root, the leaves, and the depth of a tree.', 'I tell operators, functions, and terminals apart.'],
    'w.2.mastery': ['I compute the output of an expression for each value of x.', 'I compare two expressions using their errors on the data.', 'I explain how GA and GP differ.'],
    'w.3.mastery': ['I generate trees with the Full and Grow methods.', 'I describe how a tournament, a subtree crossover, and a subtree mutation work.', 'I explain why trees can grow after many crossovers.'],
    'w.4.mastery': ['I define T and F and justify that they satisfy closure and sufficiency.', 'I explain why division must be protected.', 'I choose reasonable parameters and a termination criterion.'],
    'w.5.mastery': ['I write the pseudocode of the complete evolutionary cycle.', 'I explain what goes in and out of each stage.', 'I anticipate what happens when an operator probability changes.'],
    'w.1.reflect': ['Why is the root the last operation to be computed?', 'What is the advantage of representing a formula as a tree rather than as text?'],
    'w.2.reflect': ['If two expressions have similar errors, which would you prefer and why?', 'What information does GP need to know whether a program is good?'],
    'w.3.reflect': ['What happens to tree size after many crossovers?', 'If crossover already exists, why is mutation needed?'],
    'w.4.reflect': ['What happens if F cannot build the solution?', 'How would the fitness function change if the problem were different?'],
    'w.5.reflect': ['How do you know a run ended well?', 'What would happen if the whole population were replaced every generation, keeping nothing?'],
  });

  /* ---------- Fundamentos ---------- */
  Object.assign(D.es, {
    'basics.eyebrow': 'Fundamentos',
    'basics.title': '¿Qué es Genetic Programming?',
    'basics.question': '¿Y si, en lugar de escribir un programa, dejáramos que evolucione?',
    'basics.def': 'Genetic Programming (GP) es un paradigma de computación evolutiva que permite generar y evolucionar programas mediante mecanismos inspirados en la selección natural.',
    'basics.treeNote': 'En GP basado en árboles (Tree-based GP), el individuo normalmente es un árbol que representa un programa. Existen otras variantes de GP con representaciones distintas.',
    'basics.thread': 'Hilo conductor de esta página: encontrar una expresión que se ajuste a f(x) = x² + 2x + 1 a partir de datos.',
    'basics.termsTitle': 'Vocabulario esencial',
    'basics.termsHint': 'Elige un término para ver su definición y un ejemplo con nuestro problema.',
    'basics.termsAria': 'Términos de GP',
    'basics.example': 'Ejemplo',
    'term.pop.t': 'Población', 'term.pop.d': 'Conjunto de programas candidatos que existen al mismo tiempo en una generación.', 'term.pop.e': 'Por ejemplo, 500 árboles distintos; cada uno propone una fórmula para ajustar los datos.',
    'term.ind.t': 'Individuo', 'term.ind.d': 'Un programa candidato. En Tree-based GP normalmente es un árbol.', 'term.ind.e': 'La expresión x × x + 2 es un individuo: una solución candidata, aunque no muy buena.',
    'term.rep.t': 'Representación', 'term.rep.d': 'La forma en que un individuo se almacena y se manipula (a veces llamada cromosoma). En Tree-based GP son nodos de función y terminales organizados en un árbol.', 'term.rep.e': 'La expresión x² + 2x + 1 se puede escribir como un árbol de 9 nodos.',
    'term.fit.t': 'Fitness', 'term.fit.d': 'Número que mide qué tan bien resuelve el problema un individuo. Depende del problema y de cómo se defina; puede maximizarse o minimizarse.', 'term.fit.e': 'En nuestro problema usamos el error RMSE sobre los datos: un valor menor es mejor.',
    'term.gen.t': 'Generación', 'term.gen.d': 'Una iteración del ciclo evolutivo: a partir de una población se obtiene la siguiente.', 'term.gen.e': 'La generación 0 es la población inicial generada al azar.',
    'term.sel.t': 'Selección', 'term.sel.d': 'Mecanismo que decide qué individuos serán progenitores, favoreciendo a los mejores sin descartar del todo a los demás.', 'term.sel.e': 'En un torneo se eligen k individuos al azar y gana el de menor error.',
    'term.rpr.t': 'Reproducción', 'term.rpr.d': 'Producir individuos para la siguiente generación: copiando un individuo sin cambios o creando descendientes con operadores como crossover y mutación.', 'term.rpr.e': 'Un individuo excelente puede copiarse tal cual a la siguiente generación.',
    'term.mut.t': 'Mutación', 'term.mut.d': 'Operador que modifica un solo individuo, por ejemplo reemplazando un subárbol por otro.', 'term.mut.e': '(x + 1) × x puede mutar a (x + 2) × x al cambiar la constante 1 por 2.',
    'term.cro.t': 'Crossover', 'term.cro.d': 'Operador que combina dos progenitores intercambiando subárboles entre ellos.', 'term.cro.e': 'Intercambiar partes de (x + 1) × x y x × x + 2 produce dos programas nuevos.',
    'cmp.title': 'GA frente a GP',
    'cmp.ga.t': 'Genetic Algorithm (GA)', 'cmp.ga.d': 'Una solución se representa con una codificación, frecuentemente una cadena o un vector. La estructura del problema está decidida de antemano.',
    'cmp.ga.e': 'Ejemplo: el vector [1, 2, 1] contiene los coeficientes de la fórmula fija a·x² + b·x + c.',
    'cmp.gp.t': 'Genetic Programming (GP)', 'cmp.gp.d': 'Una solución se representa como un programa, frecuentemente mediante un árbol. La estructura también puede evolucionar.',
    'cmp.gp.e': 'Ejemplo: el árbol de la derecha es la fórmula completa; sus nodos y su forma pueden cambiar.',
    'cmp.note': 'Esta comparación describe el caso más frecuente. Los GA pueden usar otras codificaciones y existen variantes de GP que no se basan en árboles.',
    'cycle.title': 'El ciclo evolutivo',
    'cycle.hint': 'Selecciona una etapa del ciclo para leer qué ocurre en ella.',
    'cycle.aria': 'Etapas del ciclo evolutivo',
    'cycle.steps': [
      { t: 'Inicializar', d: 'Se crea la generación 0: una población de programas generados aleatoriamente. Esto se hace una sola vez.' },
      { t: 'Evaluar', d: 'Cada programa se ejecuta con los datos del problema y se calcula su fitness.' },
      { t: 'Seleccionar', d: 'Se eligen progenitores, favoreciendo a los programas con mejor fitness.' },
      { t: 'Variar', d: 'Se crean descendientes aplicando crossover (combinar dos progenitores) y mutación (modificar uno).' },
      { t: 'Reemplazar', d: 'Los descendientes forman la nueva población, conservando o no a algunos individuos de la anterior.' },
      { t: '¿Terminar?', d: 'Si se cumple el criterio de terminación se devuelve el mejor individuo. Si no, comienza una nueva generación en la etapa Evaluar.' },
    ],
    'cycle.center': 'Inicio',
    'chk.basics.q': '¿Qué diferencia principal muestran los ejemplos de GA y GP de arriba?',
    'chk.basics.o': [
      'En el GA solo se ajustan valores de una estructura ya fija; en GP la estructura del programa también puede cambiar.',
      'GP siempre usa cadenas binarias y GA siempre usa árboles.',
      'El GA no necesita una medida de calidad, GP sí.',
      'GP no usa población: evoluciona un único programa.',
    ],
    'chk.basics.w': [
      'Correcto: en el ejemplo, [1, 2, 1] solo ajusta números dentro de a·x² + b·x + c, mientras que un árbol puede crecer, cambiar operadores y cambiar su forma.',
      'Incorrecto: es al revés en el caso típico que mostramos, y ninguna de las dos afirmaciones es general; hay GA con otras codificaciones.',
      'Incorrecto: ambos necesitan una medida de calidad (fitness) para decidir qué soluciones favorecer.',
      'Incorrecto: GP también trabaja con una población de individuos que evoluciona generación tras generación.',
    ],
    'basics.reflect': 'Con un GA y la fórmula fija a·x² + b·x + c, ¿podrías encontrar x³ + 3x + 2? ¿Qué tendrías que cambiar?',
  });
  Object.assign(D.en, {
    'basics.eyebrow': 'Fundamentals',
    'basics.title': 'What is Genetic Programming?',
    'basics.question': 'What if, instead of writing a program, we let it evolve?',
    'basics.def': 'Genetic Programming (GP) is an evolutionary computation paradigm that generates and evolves programs using mechanisms inspired by natural selection.',
    'basics.treeNote': 'In tree-based GP, the individual is normally a tree that represents a program. Other GP variants use different representations.',
    'basics.thread': 'Running thread of this page: find an expression that fits f(x) = x² + 2x + 1 from data.',
    'basics.termsTitle': 'Essential vocabulary',
    'basics.termsHint': 'Pick a term to see its definition and an example with our problem.',
    'basics.termsAria': 'GP terms',
    'basics.example': 'Example',
    'term.pop.t': 'Population', 'term.pop.d': 'The set of candidate programs that exist at the same time in one generation.', 'term.pop.e': 'For example, 500 different trees; each one proposes a formula to fit the data.',
    'term.ind.t': 'Individual', 'term.ind.d': 'One candidate program. In tree-based GP it is normally a tree.', 'term.ind.e': 'The expression x × x + 2 is an individual: a candidate solution, though not a very good one.',
    'term.rep.t': 'Representation', 'term.rep.d': 'The way an individual is stored and manipulated (sometimes called the chromosome). In tree-based GP it is function nodes and terminals arranged in a tree.', 'term.rep.e': 'The expression x² + 2x + 1 can be written as a tree with 9 nodes.',
    'term.fit.t': 'Fitness', 'term.fit.d': 'A number measuring how well an individual solves the problem. It depends on the problem and on how it is defined; it can be maximised or minimised.', 'term.fit.e': 'In our problem we use the RMSE error on the data: a lower value is better.',
    'term.gen.t': 'Generation', 'term.gen.d': 'One iteration of the evolutionary cycle: the next population is obtained from the current one.', 'term.gen.e': 'Generation 0 is the randomly generated initial population.',
    'term.sel.t': 'Selection', 'term.sel.d': 'The mechanism that decides which individuals become parents, favouring the best without completely discarding the others.', 'term.sel.e': 'In a tournament, k individuals are picked at random and the one with the lowest error wins.',
    'term.rpr.t': 'Reproduction', 'term.rpr.d': 'Producing individuals for the next generation: copying an individual unchanged or creating offspring with operators such as crossover and mutation.', 'term.rpr.e': 'An excellent individual can be copied as is into the next generation.',
    'term.mut.t': 'Mutation', 'term.mut.d': 'An operator that modifies a single individual, for example by replacing a subtree with another one.', 'term.mut.e': '(x + 1) × x can mutate into (x + 2) × x by changing the constant 1 to 2.',
    'term.cro.t': 'Crossover', 'term.cro.d': 'An operator that combines two parents by exchanging subtrees between them.', 'term.cro.e': 'Exchanging parts of (x + 1) × x and x × x + 2 produces two new programs.',
    'cmp.title': 'GA versus GP',
    'cmp.ga.t': 'Genetic Algorithm (GA)', 'cmp.ga.d': 'A solution is represented by an encoding, often a string or a vector. The structure of the problem is decided in advance.',
    'cmp.ga.e': 'Example: the vector [1, 2, 1] holds the coefficients of the fixed formula a·x² + b·x + c.',
    'cmp.gp.t': 'Genetic Programming (GP)', 'cmp.gp.d': 'A solution is represented as a program, often as a tree. The structure can evolve as well.',
    'cmp.gp.e': 'Example: the tree on the right is the whole formula; its nodes and shape can change.',
    'cmp.note': 'This comparison describes the most common case. GAs can use other encodings and there are GP variants that are not tree-based.',
    'cycle.title': 'The evolutionary cycle',
    'cycle.hint': 'Select a stage of the cycle to read what happens in it.',
    'cycle.aria': 'Stages of the evolutionary cycle',
    'cycle.steps': [
      { t: 'Initialise', d: 'Generation 0 is created: a population of randomly generated programs. This happens only once.' },
      { t: 'Evaluate', d: 'Each program is run on the problem data and its fitness is computed.' },
      { t: 'Select', d: 'Parents are chosen, favouring programs with better fitness.' },
      { t: 'Vary', d: 'Offspring are created by applying crossover (combining two parents) and mutation (modifying one).' },
      { t: 'Replace', d: 'The offspring form the new population, keeping or not some individuals from the previous one.' },
      { t: 'Stop?', d: 'If the termination criterion is met, the best individual is returned. Otherwise a new generation starts at the Evaluate stage.' },
    ],
    'cycle.center': 'Start',
    'chk.basics.q': 'What is the main difference shown by the GA and GP examples above?',
    'chk.basics.o': [
      'In the GA only values of an already fixed structure are tuned; in GP the structure of the program can change too.',
      'GP always uses binary strings and GA always uses trees.',
      'GA does not need a quality measure, GP does.',
      'GP does not use a population: it evolves one single program.',
    ],
    'chk.basics.w': [
      'Correct: in the example, [1, 2, 1] only tunes numbers inside a·x² + b·x + c, whereas a tree can grow, change operators, and change shape.',
      'Incorrect: it is the other way around in the typical case shown, and neither statement is general; some GAs use other encodings.',
      'Incorrect: both need a quality measure (fitness) to decide which solutions to favour.',
      'Incorrect: GP also works with a population of individuals that evolves generation after generation.',
    ],
    'basics.reflect': 'With a GA and the fixed formula a·x² + b·x + c, could you find x³ + 3x + 2? What would you have to change?',
  });

  /* ---------- Árboles ---------- */
  Object.assign(D.es, {
    'trees.eyebrow': 'Representación',
    'trees.title': 'Representación mediante árboles',
    'trees.question': '¿Cómo puede una computadora manipular una fórmula como si fuera una pieza ensamblable?',
    'trees.explain': 'Un árbol de expresión coloca cada operación en un nodo y sus operandos como hijos. Las hojas son los valores finales (terminales). La raíz es la última operación que se calcula.',
    'trees.exprLabel': 'Expresión',
    'trees.expr.1': 'x² + 2x + 1', 'trees.expr.2': '(x + 2) × (x − 1)', 'trees.expr.3': 'x³ + 3x + 2', 'trees.expr.4': 'sin(x) + 1 (con función)',
    'trees.noteSquare': 'Como el conjunto de funciones solo tiene +, −, × y ÷, escribimos x² como x × x y x³ como (x × x) × x.',
    'trees.noteFn': 'sin(x) no pertenece al conjunto de operadores del problema; se incluye para mostrar un nodo de función de un argumento.',
    'trees.exprOut': 'Expresión que representa el árbol',
    'trees.build': 'Construir paso a paso', 'trees.playing': 'Pausar', 'trees.resume': 'Reproducir', 'trees.next': 'Siguiente nodo', 'trees.reset': 'Mostrar árbol completo',
    'trees.restart': 'Reiniciar construcción',
    'trees.showValues': 'Mostrar el valor de cada nodo con x =',
    'trees.valuesHint': 'Cada nodo muestra el resultado de su subárbol: así se calcula el árbol de las hojas hacia la raíz.',
    'trees.legend': 'Tipos de nodo', 'trees.legendFn': 'Nodos de función (internos)', 'trees.legendTerm': 'Terminales (hojas)',
    'trees.kind.op': 'Operador', 'trees.kind.fn': 'Función', 'trees.kind.var': 'Variable', 'trees.kind.const': 'Constante',
    'trees.svgLabel': 'Árbol de expresión interactivo',
    'trees.nodeLabel': '{kind} {label}, profundidad {depth}',
    'trees.panelTitle': 'Nodo seleccionado', 'trees.panelEmpty': 'Selecciona un nodo del árbol para ver qué es y qué hace.',
    'trees.f.type': 'Tipo', 'trees.f.symbol': 'Símbolo', 'trees.f.depth': 'Profundidad', 'trees.f.children': 'Hijos', 'trees.f.size': 'Nodos en su subárbol',
    'trees.f.sub': 'Subexpresión', 'trees.f.value': 'Valor con x = {x}', 'trees.f.none': 'ninguno (es una hoja)', 'trees.f.root': 'raíz',
    'trees.kindText.op': 'Operador: combina dos subárboles con una operación binaria. Es un nodo interno y su resultado depende de los valores de sus dos hijos.',
    'trees.kindText.fn': 'Función: aplica una función matemática a su único hijo. Es un nodo interno; aquí se usa sin como ejemplo.',
    'trees.kindText.var': 'Variable: terminal que toma el valor de la entrada del problema (aquí, x). No tiene hijos.',
    'trees.kindText.const': 'Constante: terminal con un valor fijo. No tiene hijos.',
    'trees.rootText': 'Este nodo es la raíz: la última operación que se calcula.',
    'trees.stats': 'Resumen del árbol', 'trees.s.nodes': 'Nodos totales', 'trees.s.depth': 'Profundidad máxima', 'trees.s.leaves': 'Hojas (terminales)', 'trees.s.internal': 'Nodos internos',
    'trees.sets': 'Los operadores y las funciones forman el conjunto de funciones F; las variables y las constantes forman el conjunto de terminales T.',
    'trees.cap.root': 'La raíz es la última operación que se calcula: {label}.',
    'trees.cap.internal': 'Nodo interno {label}: combina el resultado de sus hijos.',
    'trees.cap.leaf': 'Hoja {label}: es un terminal, no tiene hijos.',
    'trees.cap.done': 'Árbol completo: ahora puedes seleccionar cualquier nodo.',
    'trees.cap.step': 'Paso {n} de {total}.',
    'trees.try': 'Prueba esto: selecciona un nodo × y observa su subárbol resaltado y su subexpresión. Un subárbol es en sí mismo un árbol completo.',
    'chk.root.q': 'En el árbol de x² + 2x + 1 (escrito como x × x + 2 × x + 1), ¿qué nodo es la raíz?',
    'chk.root.o': ['El + de más arriba, que suma el resultado anterior con 1', 'La variable x', 'El primer ×', 'La constante 1'],
    'chk.root.w': [
      'Correcto: la raíz es la última operación que se calcula. Primero se calculan x × x y 2 × x, luego su suma, y al final se suma 1.',
      'Incorrecto: x es una hoja (terminal); las hojas nunca son raíz en un árbol con operaciones.',
      'Incorrecto: los productos se calculan antes que las sumas, así que están más abajo en el árbol.',
      'Incorrecto: 1 es una hoja. Es hijo de la raíz, pero no la raíz.',
    ],
    'chk.leaves.q': 'El árbol de (x + 2) × (x − 1) tiene tres operadores. ¿Cuántas hojas (terminales) tiene?',
    'chk.leaves.o': ['2', '3', '4', '5'],
    'chk.leaves.w': [
      'Incorrecto: hay más hojas; cuenta x, 2, x y 1.',
      'Incorrecto: no olvides que x aparece dos veces y cada aparición es una hoja distinta.',
      'Correcto: las hojas son x, 2, x y 1. Con 3 operadores binarios hay 3 + 1 = 4 hojas.',
      'Incorrecto: son 7 nodos en total (3 operadores y 4 hojas), no 5 hojas.',
    ],
    'trees.reflect': '¿Por qué GP prefiere árboles a texto? Pista: ¿qué pasa si cambias un carácter al azar en «x*x+2*x+1»? ¿Y si cambias un nodo del árbol por otro del mismo tipo?',
  });
  Object.assign(D.en, {
    'trees.eyebrow': 'Representation',
    'trees.title': 'Tree representation',
    'trees.question': 'How can a computer manipulate a formula as if it were an assembly of parts?',
    'trees.explain': 'An expression tree puts each operation in a node and its operands as children. The leaves are the final values (terminals). The root is the last operation to be computed.',
    'trees.exprLabel': 'Expression',
    'trees.expr.1': 'x² + 2x + 1', 'trees.expr.2': '(x + 2) × (x − 1)', 'trees.expr.3': 'x³ + 3x + 2', 'trees.expr.4': 'sin(x) + 1 (with a function)',
    'trees.noteSquare': 'Since the function set only has +, −, × and ÷, we write x² as x × x and x³ as (x × x) × x.',
    'trees.noteFn': 'sin(x) is not in the problem’s operator set; it is included to show a one-argument function node.',
    'trees.exprOut': 'Expression represented by the tree',
    'trees.build': 'Build step by step', 'trees.playing': 'Pause', 'trees.resume': 'Play', 'trees.next': 'Next node', 'trees.reset': 'Show full tree',
    'trees.restart': 'Restart construction',
    'trees.showValues': 'Show the value of each node at x =',
    'trees.valuesHint': 'Each node shows the result of its subtree: this is how a tree is computed, from the leaves up to the root.',
    'trees.legend': 'Node types', 'trees.legendFn': 'Function nodes (internal)', 'trees.legendTerm': 'Terminals (leaves)',
    'trees.kind.op': 'Operator', 'trees.kind.fn': 'Function', 'trees.kind.var': 'Variable', 'trees.kind.const': 'Constant',
    'trees.svgLabel': 'Interactive expression tree',
    'trees.nodeLabel': '{kind} {label}, depth {depth}',
    'trees.panelTitle': 'Selected node', 'trees.panelEmpty': 'Select a node in the tree to see what it is and what it does.',
    'trees.f.type': 'Type', 'trees.f.symbol': 'Symbol', 'trees.f.depth': 'Depth', 'trees.f.children': 'Children', 'trees.f.size': 'Nodes in its subtree',
    'trees.f.sub': 'Subexpression', 'trees.f.value': 'Value at x = {x}', 'trees.f.none': 'none (it is a leaf)', 'trees.f.root': 'root',
    'trees.kindText.op': 'Operator: combines two subtrees with a binary operation. It is an internal node and its result depends on the values of its two children.',
    'trees.kindText.fn': 'Function: applies a mathematical function to its single child. It is an internal node; sin is used here as an example.',
    'trees.kindText.var': 'Variable: a terminal that takes the value of the problem input (here, x). It has no children.',
    'trees.kindText.const': 'Constant: a terminal with a fixed value. It has no children.',
    'trees.rootText': 'This node is the root: the last operation to be computed.',
    'trees.stats': 'Tree summary', 'trees.s.nodes': 'Total nodes', 'trees.s.depth': 'Maximum depth', 'trees.s.leaves': 'Leaves (terminals)', 'trees.s.internal': 'Internal nodes',
    'trees.sets': 'Operators and functions make up the function set F; variables and constants make up the terminal set T.',
    'trees.cap.root': 'The root is the last operation to be computed: {label}.',
    'trees.cap.internal': 'Internal node {label}: combines the results of its children.',
    'trees.cap.leaf': 'Leaf {label}: a terminal, it has no children.',
    'trees.cap.done': 'Tree complete: you can now select any node.',
    'trees.cap.step': 'Step {n} of {total}.',
    'trees.try': 'Try this: select a × node and look at its highlighted subtree and its subexpression. A subtree is itself a complete tree.',
    'chk.root.q': 'In the tree of x² + 2x + 1 (written as x × x + 2 × x + 1), which node is the root?',
    'chk.root.o': ['The topmost +, which adds the previous result and 1', 'The variable x', 'The first ×', 'The constant 1'],
    'chk.root.w': [
      'Correct: the root is the last operation to be computed. First x × x and 2 × x are computed, then their sum, and finally 1 is added.',
      'Incorrect: x is a leaf (terminal); leaves are never the root of a tree with operations.',
      'Incorrect: products are computed before sums, so they sit lower in the tree.',
      'Incorrect: 1 is a leaf. It is a child of the root, but not the root.',
    ],
    'chk.leaves.q': 'The tree of (x + 2) × (x − 1) has three operators. How many leaves (terminals) does it have?',
    'chk.leaves.o': ['2', '3', '4', '5'],
    'chk.leaves.w': [
      'Incorrect: there are more leaves; count x, 2, x, and 1.',
      'Incorrect: remember x appears twice and each occurrence is a separate leaf.',
      'Correct: the leaves are x, 2, x, and 1. With 3 binary operators there are 3 + 1 = 4 leaves.',
      'Incorrect: there are 7 nodes in total (3 operators and 4 leaves), not 5 leaves.',
    ],
    'trees.reflect': 'Why does GP prefer trees over text? Hint: what happens if you change a random character in “x*x+2*x+1”? And if you replace a tree node with another of the same type?',
  });

  /* ---------- Motor ---------- */
  let lang = 'es';
  try {
    const stored = localStorage.getItem('lang');
    if (stored === 'es' || stored === 'en') lang = stored;
  } catch (e) { /* almacenamiento no disponible */ }

  GP.lang = () => lang;
  GP.t = function (key, vars) {
    let v = D[lang][key];
    if (v === undefined) v = D.es[key];
    if (v === undefined) return key;
    if (typeof v === 'string' && vars) {
      v = v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    }
    return v;
  };

  function apply() {
    document.documentElement.lang = lang;
    document.title = GP.t('page.title');
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = GP.t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', GP.t(el.getAttribute('data-i18n-aria'))); });
  }

  GP.setLang = function (next) {
    lang = next;
    try { localStorage.setItem('lang', next); } catch (e) { /* ignorar */ }
    apply();
    document.dispatchEvent(new CustomEvent('gp:langchange', { detail: next }));
  };

  /* Los módulos se suscriben con GP.onLang(fn); fn corre ahora y en cada cambio. */
  GP.onLang = function (fn) {
    fn();
    document.addEventListener('gp:langchange', fn);
  };

  /* Permite que cada fase añada sus textos sin crecer este archivo. */
  GP.addStrings = function (es, en) { Object.assign(D.es, es); Object.assign(D.en, en); };

  GP.applyI18n = apply;
  // Primer listener de DOMContentLoaded: los demás módulos ya encuentran el texto traducido.
  document.addEventListener('DOMContentLoaded', apply);
})();
