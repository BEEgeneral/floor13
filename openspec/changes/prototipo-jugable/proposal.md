# Proposal

## Why

Los conceptos de Floor 13 (cartas, niveles, exámenes, plantas) ya están definidos en `docs/`. Para decidir con datos reales hace falta algo con lo que jugar: un prototipo en el que varios magos de prueba entren, se muevan por el hotel, se vean y comprueben qué puertas se abren a cada uno. Los gráficos serán básicos y se mejorarán después con los renders de Blender.

El prototipo no sustituye a `validar-concepto`: es la herramienta con la que se enseñará el concepto en las entrevistas y se medirán las señales de compromiso.

## What Changes

- **Jugadores:** entrada de prueba con nombre de mago, país, especialidad y escuela. El perfil guarda nivel, las cuatro notas, rol y llaves, y se recupera al volver a entrar.
- **Accesos:** reglas por planta según rol, nivel y llaves. El ascensor muestra cada planta con su ocupación y, si está cerrada, el motivo. El botón de la Planta 13 solo aparece a quien puede entrar.
- **Mundo jugable:** cinco estancias (Vestíbulo, Café del Naipe, Gran Salón, Sala de mesa y Planta 13) con avatares que se ven en tiempo real.
- **Controles:** teclado y mando con acciones con nombre.
- **Dinámicas básicas:** chat por proximidad, gestos (aplauso, mano levantada) y la carta del jugador generada desde sus datos.
- **Modo prueba:** panel para dar roles, niveles y llaves a cualquier jugador y comprobar los accesos sin esperar a ningún examen.
- **Gráficos básicos:** dibujo propio y ligero, preparado para sustituir los fondos por los renders de Blender.

### Fuera de alcance

- Vídeo en directo y cámaras (se prueban en `validar-concepto`).
- Exámenes completos con tribunal y votos a ciegas (siguiente cambio).
- Pagos, cuentas reales con correo y alojamiento definitivo.
- IA.

## Capabilities

### New Capabilities

- `acceso-y-jugadores`: perfil del jugador, entrada de prueba, roles, llaves y reglas de acceso a las plantas.
- `mundo-jugable`: plantas, movimiento, controles, presencia de otros jugadores, ascensor, chat de proximidad y gestos.

### Modified Capabilities

<!-- Ninguna: aún no hay especificaciones principales. -->

## Impact

- **Código:** nuevo, en `game/` (cliente, servidor y código compartido).
- **Dependencias:** Phaser 4, Colyseus, Vite y TypeScript.
- **Documentación:** el cambio se apoya en `docs/diseno/niveles.md` y `docs/DISENO.md`.
