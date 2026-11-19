# Proposal

## Why

La carta de puntuación de Floor 13 solo tiene valor si el nivel de cada mago es justo y verificable, y la comunidad necesita quien la dinamice y quien custodie el conocimiento que se comparte sin ponerlo en riesgo. El secreto de los métodos es un principio central del hotel, así que cualquier uso de IA con ese conocimiento necesita reglas claras desde el principio, antes de construir nada.

Estas decisiones son provisionales hasta que `validar-concepto` dé el visto bueno a seguir adelante.

## What Changes

- **Inscripción gratuita:** cualquier mago puede registrarse sin coste y acceder a los espacios gratuitos.
- **Ascenso de grado por examen:** el mago crea un efecto o show de 5 minutos y explica los conocimientos aplicados. Los magos que asisten al examen lo evalúan.
- **Tribunal humano (decidido):** el grado lo decide siempre un tribunal de personas. La valoración de la IA es una voz más y no decide.
- **IA con tres papeles:** dinamizar la comunidad, examinar (valorar) y guardar conocimientos.
- **Regla de la IA (decidida):** la IA custodia, analiza y valora el conocimiento, pero **no lo difunde**. Hacia fuera solo salen valoraciones y datos de la carta, nunca el contenido de un método. Las valoraciones las ven solo el autor y el tribunal.
- **IA siempre identificada (decidido):** toda IA se muestra como IA. No hay perfiles que finjan ser personas.

### Por decidir

- Si los perfiles de IA se plantean como personajes declarados (maestros virtuales con especialidad visible), en lugar de "jugadores" que no se sabe que son IA.
- Número de grados y requisitos de cada uno (el borrador usa Bronce, Plata, Oro y Neón).
- Quién forma el primer tribunal mientras la comunidad es pequeña, y si los grados altos los validan magos de rango superior.
- Política de grabación de los exámenes: hace falta poder revisarlos para las apelaciones, pero el principio del hotel es no grabar sin permiso expreso.
- Qué se guarda de cada aportación, quién lo ve (público, huéspedes, VIP o solo tribunal) y cómo se consiente.
- Confirmar con un asesor las obligaciones legales de transparencia sobre el uso de IA y de protección de datos (RGPD).

### Fuera de alcance

- Implementación, elección de modelos de IA concretos y pruebas técnicas.
- Precios y planes de suscripción.
- Contenido de los exámenes por especialidad.

## Capabilities

### New Capabilities

- `sistema-de-grados`: inscripción, exámenes de ascenso, tribunal humano, apelaciones y relación entre el grado y la carta de puntuación.
- `ia-asistente`: papeles de la IA (dinamizar, valorar, custodiar), regla de no difundir, identificación siempre como IA y permisos de acceso al conocimiento guardado.

### Modified Capabilities

<!-- Ninguna: el proyecto aún no tiene especificaciones. -->

## Impact

- **Código:** ninguno en este cambio.
- **Documentación:** concreta partes de `docs/DISENO.md` (carta de puntuación, cálculo del nivel, verificación y política de grabación).
- **Dependencias:** supeditado al resultado de `validar-concepto`. Si la validación es negativa, este cambio no se construye.
