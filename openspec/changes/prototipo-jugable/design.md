# Design

## Context

Ver `proposal.md`. El prototipo debe poder abrirse con un enlace y probarse entre varias personas. El diseño sigue las decisiones de `docs/DISENO.md` (Phaser, Colyseus) y las posteriores (niveles, cartas, accesos de la Planta 13).

## Goals / Non-Goals

**Goals:**
- Un prototipo local que arranque con un comando y admita varios jugadores a la vez.
- Reglas de acceso y de nivel como código compartido y con pruebas.
- Gráficos sustituibles: los fondos y las piezas se cargan por planta, de modo que los renders de Blender entren sin tocar la lógica.

**Non-Goals:**
- Seguridad de producción: la entrada de prueba no usa contraseña ni correo.
- Rendimiento a escala.

## Decisions

- **Monorepo en `game/` con tres paquetes:** `shared` (reglas de niveles, accesos y mapas de las plantas), `server` y `client`. Las reglas viven solo en `shared`, así cliente y servidor no se contradicen.
- **Servidor autoritativo con Colyseus, una sala por planta.** El servidor valida el movimiento y las reglas de acceso. Alternativa: servidor propio con WebSocket, más simple pero sin salas ni sincronización de estado.
- **Entrada de prueba con token en el navegador y perfiles en un archivo JSON.** Basta para probar. Alternativa: Supabase desde el principio, que se deja para cuando se decida seguir.
- **Cliente con Phaser 4 y Vite.** La interfaz (login, menú del ascensor, chat, carta) es HTML y CSS encima del lienzo, para que el texto sea nítido.
- **Gráficos básicos dibujados por código.** Cada planta es un fondo más una lista de piezas con su profundidad. Más adelante el fondo se sustituye por el render de Blender y las piezas con las que se interactúa se mantienen como sprites.
- **Controles como acciones con nombre** (`mover`, `interactuar`, `chat`, `gesto`) con teclado y mando.
- **Modo prueba controlado por variable de entorno.** Si está desactivado, el panel de pruebas no funciona.

## Risks / Trade-offs

- [El prototipo se confunde con el producto] → Se declara como prueba y no se reutiliza la entrada de prueba en producción.
- [Los fondos de Blender no encajan con los colisionadores] → Cada planta define sus colisionadores en datos, separados del arte.
- [Cambios en las APIs de Phaser 4 y Colyseus] → Fijar versiones exactas y consultar las skills `phaser-core`.

## Open Questions

- Dónde se aloja la prueba abierta para los entrevistados.
- Cuándo se sustituye la entrada de prueba por cuentas reales.
