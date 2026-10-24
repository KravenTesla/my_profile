# Laboratorio de Genetic Programming

Página educativa interactiva, bilingüe (ES/EN), enlazada desde la tarjeta «Programación genética y cómputo evolutivo» del sitio principal. Hereda su estilo visual (paleta azul, Manrope / DM Sans) y añade tema claro/oscuro.

## Ejecutarla

Es HTML, CSS y JavaScript sin build ni dependencias. Funciona abriendo `gp-lab/index.html`, pero lo recomendable es un servidor estático desde la raíz del repositorio:

```bash
# desde la raíz del repo (my_profile/)
python -m http.server 8000
# o: npx serve .
```

Después abre <http://localhost:8000/gp-lab/>. Las fuentes vienen de Google Fonts; sin conexión se usan tipografías del sistema y todo sigue funcionando.

## Estado por fases

| Fase | Contenido | Estado |
|---|---|---|
| A | Estructura, navegación, tema, hero animado | Hecha |
| B | Ruta de 5 semanas, fundamentos, árboles de expresión | Hecha |
| C | Inicialización, fitness, torneo, crossover, mutación | Hecha |
| D | Simulador completo de GP | Hecha |
| E | Aplicaciones reales y bibliografía | Hecha |
| F | Plan de lectura, laboratorio Python, evaluación | Pendiente |
| G | Integración, accesibilidad, pruebas finales | Pendiente |

## Estructura

```
gp-lab/
  index.html
  assets/
    css/   styles.css (tokens, base, header, hero)
           components.css (roadmap, fundamentos, laboratorio de árboles, checks)
           lab.css (Fase C: controles, tablas, gráfica, torneo, crossover, mutación)
           animations.css, responsive.css
    js/    i18n.js            diccionario ES/EN, idioma persistente
           gp-core.js         nodos, evaluación, RMSE, layout (lógica pura)
           tree-visualization.js   dibujo SVG y TreeView interactivo
           hero.js            animación conceptual del hero
           roadmap.js, progress.js ruta de 5 semanas y localStorage
           fundamentals.js    vocabulario, GA vs GP, ciclo evolutivo
           representation.js  laboratorio de árboles
           checks.js          comprobaciones de opción múltiple
           strings-lab.js     textos ES/EN de la Fase C
           lab-utils.js       selector segmentado, lista de pasos, tarjetas de árbol
           charts.js          gráficas SVG sin dependencias
           population.js, fitness.js, selection.js, crossover.js, mutation.js
           gp-simulator.js    motor GP completo (lógica pura, sin DOM)
           simulator-ui.js, strings-sim.js   interfaz y textos del simulador
           applications.js, bibliography.js, strings-apps.js   casos reales y referencias
           theme.js, navigation.js
  docs/README.md
```

Los scripts son clásicos (no módulos ES) y comparten el espacio de nombres `window.GP`, de modo que la página también abre con `file://`.

## Decisiones de diseño

- **Estilo:** se reutilizan los tokens del sitio principal. Los tipos de nodo se distinguen por forma y color (operador = círculo, función = rombo, variable = rectángulo redondeado, constante = hexágono), no solo por color.
- **Persistencia (localStorage):** `lang` (compartida con el sitio principal), `gp-theme`, `gp-progress` (semanas, elementos marcados y semana actual). Una semana nunca se marca sola.
- **Corrección:** `gp-core.js` es el único lugar donde se evalúan árboles. La división está protegida (divisor casi cero devuelve 1) y los resultados no finitos se reemplazan por 0. El hero calcula RMSE reales sobre los datos de f(x) = x² + 2x + 1 y el cruce intercambia subárboles reales; no hay valores inventados.
- **Contenido:** el texto vive en `i18n.js`; el HTML solo lleva claves `data-i18n`.
- **Movimiento:** con `prefers-reduced-motion` la animación del hero y la construcción de árboles no se reproducen solas; se avanzan con los botones.

## Pruebas manuales sugeridas

1. Marcar elementos y semanas, recargar, y comprobar que el progreso persiste.
2. En «Árboles»: construir paso a paso, seleccionar nodos, activar valores y cambiar x; con x = 2 la raíz de x² + 2x + 1 vale 9.
3. Cambiar idioma y tema, volver al sitio principal y comprobar que el idioma se conserva.
4. Revisar a 390 px de ancho: sin scroll horizontal y línea de tiempo vertical.

## Notas de la Fase C

- **Semillas:** `GP.rng(semilla)` (mulberry32) hace reproducibles la población, el torneo, los puntos de cruce y la mutación.
- **Operadores reales:** `GP.crossover`, `GP.setAt`, `GP.tournament` y `GP.randomTree` (Full/Grow) están en `gp-core.js`; las animaciones solo muestran lo que esas funciones calculan.
- **Fitness:** el RMSE de la tabla se calcula con `GP.rmse` sobre los cinco datos; el analizador `GP.parse` permite evaluar expresiones propias.
- **Selección:** la población de 10 individuos usa Grow, profundidad 3 y semilla 930, elegida porque sus RMSE son todos distintos.

## Notas de la Fase D

- **Motor:** `GP.Sim` (`gp-simulator.js`) no toca el DOM. `new GP.Sim(params)`, `.step()`, `.runAll()`, `.summary()`. La interfaz solo lo dibuja.
- **Estrategia:** reemplazo generacional, torneo, crossover o mutación de subárbol excluyentes (Pc + Pm = 1), elitismo de E individuos, inicialización ramped half-and-half.
- **Límites:** un descendiente que supera la profundidad o el tamaño máximos se descarta y se conserva el progenitor; el simulador cuenta esos rechazos.
- **Seguridad numérica:** división protegida, valores no finitos sustituidos y parámetros acotados en `GP.simParams`; no aparecen NaN ni infinitos.
- **Honestidad del resultado:** el mejor individuo se vuelve a evaluar en 8 puntos que el algoritmo nunca vio, y el botón «Probar 10 semillas» muestra cuántas ejecuciones recuperan x² + 2x + 1 (con los valores por defecto no son todas).
- **Pruebas del motor:** mismos resultados con la misma semilla, profundidad y tamaño siempre dentro de los límites, el mejor RMSE no empeora con elitismo, y parámetros fuera de rango se corrigen con aviso.

## Notas de la Fase E

- **Encabezado:** con 12 secciones el menú pasa a dos filas (marca y herramientas arriba, secciones abajo). Desde 1100 px de ancho se vuelve desplegable.
- **Verificación de referencias:** cada dato bibliográfico se comprobó en una fuente (NASA NTRS, GP Bibliography, repositorio de la Universidad de Manchester, fichas de Creative Commons y registros de bibliotecas). Cada entrada muestra su estado (verificado, verificado en parte o pendiente) y una nota con lo que se confirmó.
- **Ilustraciones:** son originales. La antena ejecuta de verdad un árbol de instrucciones; la red serie/paralelo calcula su respuesta en frecuencia y su distancia a un filtro paso bajo ideal; el caso 3 reproduce una ejecución real del simulador (semilla 27); los casos 4 y 5 son esquemas sin datos del estudio.
- **Honestidad del contenido:** ningún caso se presenta como producto comercial. El caso 5 aclara que el resumen consultado no dice si el algoritmo es GP, y el caso 3 advierte que ajustar datos no demuestra una ley.
