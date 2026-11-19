# Proposal

## Why

Floor 13 Magic Hotel (ver `docs/DISENO.md`) descansa en dos supuestos que aún no se han comprobado: que enseñar magia de cerca por cámara funciona lo bastante bien, y que los magos querrían enseñar o aprender, y pagar, en este formato. Construir el hotel exige muchas piezas (mapa 2D, tiempo real, vídeo, pagos, cuentas) y varios meses de trabajo. Validar antes de programar evita invertir ese esfuerzo sobre una premisa sin probar.

## What Changes

- Se define una fase de validación previa al desarrollo (fase 0 del borrador de diseño), con tres líneas de trabajo:
  - Entrevistas a 5 a 10 magos.
  - Prueba de cámara con el kit mínimo (cara y mesa).
  - Maqueta sin código, opcional, para enseñar la idea.
- Se establece que **no se desarrolla el hotel hasta que la validación dé una respuesta** de continuar o parar.
- Se fijan los objetivos técnicos de la prueba de cámara, propuestos en el borrador y pendientes de confirmar: latencia de 400 ms o menos, una carta legible en el 80 % central del tapete y 20 minutos sin cortes.
- **Criterio de "seguimos": pendiente de decidir.** Opciones en discusión:
  1. El del borrador: la mitad de los magos entrevistados dice que enseñaría o aprendería en este formato, y la cámara cumple los objetivos.
  2. El del borrador más una señal de compromiso real (lista de espera o sesión de prueba reservada), porque el interés declarado no demuestra disposición a pagar.
  3. Otro criterio, incluido uno más exigente como una prueba de pago.

### Fuera de alcance

- Cualquier desarrollo del hotel, del mapa, de las cartas o de los pagos.
- Decisiones finales de marca, nombre, dominios y logo.
- Precios definitivos y modelo fiscal.

## Capabilities

### New Capabilities

<!-- Ninguna por ahora. Esta fase define un proceso de decisión, no un comportamiento del sistema.
     Queda pendiente decidir si el cambio debe declarar capacidades o marcarse con skip_specs. -->

### Modified Capabilities

<!-- Ninguna: el proyecto aún no tiene especificaciones. -->

## Impact

- **Código:** ninguno. No hay desarrollo en este cambio.
- **Documentación:** `docs/DISENO.md` queda como referencia del concepto; este cambio registra las decisiones que se tomen sobre él.
- **Decisiones que condiciona:** la hoja de ruta posterior. Un resultado negativo detiene las fases siguientes, y uno positivo abre el primer cambio de construcción (vestíbulo y café).
