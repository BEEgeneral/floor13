# Niveles 0–100 · Propuesta

Estado: **borrador para aprobar**. Es diseño de concepto, no desarrollo.

El número de la carta (0–100) es el nivel. Se calcula con las cuatro notas del examen (Técnica 30 %, Presentación 30 %, Creatividad 25 %, Enseñanza 15 %). La lista completa de los 101 niveles con nombre está en `niveles.csv`, y `niveles_check.py` la regenera y comprueba la curva.

## 1. Rangos con nombre

Los nombres son títulos de oficio inventados para el hotel. No usan nombres de magos reales.

| Niveles | Rango | Tramo de la carta |
|---|---|---|
| 0–9 | Curioso | Antesala |
| 10–19 | Aprendiz | Antesala |
| 20–29 | Manos Ligeras | Antesala |
| 30–39 | Aficionado de Salón | Antesala |
| 40–49 | Mago de Mesa | Bronce |
| 50–59 | Artífice | Bronce |
| 60–66 | Prestidigitador | Plata |
| 67–74 | Ilusionista | Plata |
| 75–82 | Maestro de Mesa | Oro |
| 83–89 | Gran Ilusionista | Oro |
| 90–94 | Archimago | Neón |
| 95–99 | Gran Maestro | Neón |
| 100 | Leyenda de la Planta 13 | Neón |

Cada nivel lleva el número romano de su posición dentro del rango. Por ejemplo, el 43 es "Mago de Mesa IV" y el 91 es "Archimago II".

Los niveles 0–39 son la Antesala: aún no hay carta con marco de metal, solo la carta con el marco apagado.

## 2. Cómo se sube de nivel

Hay dos cosas separadas, y esa separación es la clave del diseño.

- **El nivel solo lo mueve un examen.** Nadie sube de nivel acumulando horas ni puntos. Así el número sigue siendo una medida de lo que sabes hacer.
- **La práctica solo da derecho a examinarse.** Cada actividad llena un medidor de práctica. Cuando está lleno, el mago consigue una **llave de la Planta 13** para pedir examen. Esto da dinámica entre exámenes sin inflar el número.

### Qué llena el medidor

- Ensayos delante del tribunal de práctica de IA, que da comentarios sin voto.
- Retos semanales.
- Enseñar a otro mago (cuenta doble: aprende el alumno y el maestro).
- Valorar bien los efectos de otros, es decir, de forma ajustada al resultado final del tribunal.
- Asistir a charlas de la Planta 13.

### Tres tipos de examen

| Examen | Para qué | Quién decide |
|---|---|---|
| Ronda de práctica | Probar sin riesgo; no cambia el nivel | IA de práctica (sin voto) |
| Examen de nivel | Moverse dentro de un rango | 1 mago real + valoración del público, que no vincula |
| Examen de rango | Cambiar de rango o de tramo (40, 60, 75, 90) | Consejo de 3 magos reales |

### Reglas de seguridad

- Un examen no sube más de 10 niveles de golpe.
- Una repetición no baja más de 3 niveles. No se baja nunca por inactividad: la carta muestra aparte una insignia "En forma".
- Para pasar de tramo hace falta que **las cuatro notas** estén por encima del mínimo del tramo nuevo. No vale compensar una nota muy baja con otra alta.

## 3. Cuánto cuesta cada nivel

Siguiendo la skill `rpg` (calcular desde el tiempo objetivo y comprobar con un script), la práctica acumulada para llegar al nivel `n` es `0,0025 × n³` horas. Es una curva cúbica: los primeros niveles vuelan y los últimos son una carrera de fondo.

| Nivel | Rango | Horas acumuladas | Horas hasta el siguiente nivel |
|---|---|---|---|
| 10 | Aprendiz I | 2 | 0,8 |
| 20 | Manos Ligeras I | 20 | 3,2 |
| 40 | Mago de Mesa I | 160 | 12,3 |
| 60 | Prestidigitador I | 540 | 27,5 |
| 75 | Maestro de Mesa I | 1.055 | 42,8 |
| 90 | Archimago I | 1.822 | 61,4 |
| 100 | Leyenda | 2.500 | — |

Estas horas son un objetivo de ritmo para diseñar el medidor, no una exigencia al mago. Hay que contrastarlas con las entrevistas de `validar-concepto` antes de fijarlas.

## 4. Teoría de juegos: que sea justo y no se pueda trucar

- **Sin amiguismo (colusión).** Los jurados se asignan al azar, nadie examina a socios ni familiares, y si dos magos se puntúan alto entre sí de forma repetida, esas notas pesan menos.
- **Votos a ciegas.** Cada jurado puntúa con la carta boca abajo y todos las muestran a la vez. Nadie copia al primero que habla (efecto de anclaje y de manada).
- **Jurados calibrados.** Un jurado gana reputación cuando sus notas se acercan a la mediana del tribunal, no cuando es más duro o más blando. Se evita así premiar la dureza como postureo. Si la diferencia entre notas supera 20 puntos, hay segunda revisión.
- **Ley de Goodhart** (cuando una medida se convierte en objetivo, deja de medir bien). Por eso hay cuatro notas y mínimos por tramo, para que nadie optimice una sola cosa.
- **Cuentas falsas.** La inscripción es gratis, así que el público solo aporta valoraciones sin peso. Los exámenes que cuentan exigen vídeo verificado y tribunal humano.
- **Sin azar que enganche.** No hay sobres ni premios aleatorios. El resultado de un examen es mérito, nunca suerte.

## 5. Que sea dinámico y divertido

- **Zona de flujo.** El hotel sugiere retos de dificultad entre +3 y +8 niveles sobre el tuyo: ni aburren ni abruman. Además enseña el punto más flojo de tus cuatro notas con un pequeño radar, para saber qué practicar. (Skill `game-ui-ux`: la interfaz escucha eventos del juego, no los consulta continuamente.)
- **Tras cada examen, elige tu próximo reto entre 3 propuestas.** Es el bucle de recompensa de la skill `card-game` (se ofrecen 3 y se elige 1 u omitir).
- **El ritual de subir de nivel.** La carta se gira, el número sube y los jurados revelan sus notas a la vez. Se afina con la skill `game-feel`: animaciones suaves, un instante de pausa y sonido.
- **Maestro y aprendiz.** Enseñar sube tu nota de Enseñanza y le da práctica a los dos. Así ayudar a otros es parte de crecer.
- **Temporadas con retos temáticos** (por ejemplo, "Noche de Halloween"). Dan sellos y marcos temporales, solo cosméticos. Nada de pagar para subir.
- **Racha suave.** El ritmo semanal se celebra, pero fallar una semana no quita nada.
- **Los datos de cada mago se guardan con versión** (skill `save-systems`), para poder reconstruir su historial si hay una apelación.

## 6. Decisiones que necesito de ti

1. ¿Te encajan los nombres de rango? Puedo proponer otra familia de nombres (más teatrales, más de hotel o más antiguos).
2. Los niveles 0–39 se llaman "Antesala" y la carta aparece con el marco apagado. ¿Prefieres un tramo propio con color, por ejemplo "Madera"?
3. ¿Mantienes la idea de que el nivel sea la planta del ascensor (la planta 40, la 75, la 100)?
4. ¿Apruebas los pesos 30/30/25/15 y el papel del público como valoración sin voto?
5. ¿Pongo el nombre del rango en la propia carta, bajo el número?

## Fuentes de diseño

- Skills del repositorio: `rpg` (curva de niveles y comprobación con script), `card-game` (bucle de recompensa), `game-feel` (ritual de subida), `game-ui-ux` (interfaz basada en eventos), `save-systems` (historial versionado), `game-docs` (este documento).
- Principios generales: teoría del flujo (Csikszentmihalyi), ley de Goodhart y diseño de incentivos para jurados.
