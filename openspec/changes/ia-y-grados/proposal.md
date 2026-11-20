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
- **Primer tribunal (decidido): consejo mixto.** Tres magos reales (dos de magia de cerca y uno de escena) deciden todos los grados. Antes del examen, un tribunal de práctica de IA da comentarios sin voto sobre el grado.
- **Reparto por especialidad (decidido):** la magia de cerca es la que se examina y valora, en mesa y con la cámara cenital. La magia stand-up es el conocimiento que se guarda y se estudia, en un archivo de escena.
- **Personajes de IA declarados (propuesta inicial):** se empieza con cuatro, cada uno con su especialidad visible en la carta, y se añaden más solo si hace falta.
  - **Maese Naipe** (cartomagia de cerca): tribunal de práctica; valora ensayos y comenta la técnica.
  - **La Dama del Tapete** (monedas y mesa): segundo tribunal de práctica, para contrastar.
  - **El Archivero** (conocimiento de escena): custodia y analiza el archivo, sin difundir nunca un método.
  - **Telón** (presentación y escena): dinamiza el café, recibe y propone retos o eventos, sin acceso al contenido guardado.

- **Consejo fundador (propuesta de perfiles):** tres puestos, cada uno cubierto por un mago real.
  - **Maestro de mesa, cartomagia (presidente en exámenes de mesa):** trayectoria demostrable en magia de cerca con cartas y experiencia enseñando.
  - **Maestro de mesa, monedas o mentalismo:** segunda mirada de cerca, con una especialidad distinta a la del presidente para contrastar.
  - **Maestro de escena (stand-up):** responsable del archivo de escena y de validar el conocimiento.
  - **Condiciones comunes:** trayectoria profesional demostrable, compromiso de confidencialidad sobre los métodos, no examinar a socios ni a familiares, y una disponibilidad mínima mensual (por fijar).
  - **Reclutamiento:** invitación directa a magos que muestren interés en las entrevistas de `validar-concepto` y a personas de asociaciones de magia. Se piden cartas de intención no vinculantes durante la validación y el nombramiento se confirma tras la reunión de decisión del 19 de marzo de 2027, para no comprometer a nadie antes de saber si el proyecto sigue.

### Por decidir

- Número de grados y requisitos de cada uno (el borrador usa Bronce, Plata, Oro y Neón).
- Años de trayectoria y horas mensuales que se piden a un fundador, y qué recibe a cambio (por ejemplo, sello de fundador y acceso VIP; la remuneración está por decidir).
- Si los grados altos los validan magos de rango superior cuando la comunidad crezca y el consejo fundador deje de ser suficiente.
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
