# Design

## Context

Ver `proposal.md` (Why) para la motivación. El borrador `docs/DISENO.md` describe una fase 0 de 1 a 2 semanas con entrevistas, prueba de cámara y maqueta. Este diseño concreta cómo se ejecuta esa fase y cómo se registran los resultados. No hay código ni infraestructura previa: todo se hace con herramientas ya disponibles y con documentos Markdown en el repositorio.

## Goals / Non-Goals

**Goals:**
- Obtener una respuesta de continuar o parar basada en evidencia, no en opiniones sueltas.
- Que los resultados queden registrados y se puedan revisar después en el repositorio.
- Mantener el coste bajo: sin desarrollo y con el mínimo de herramientas.

**Non-Goals:**
- Construir el hotel, aunque sea parcialmente.
- Medir con precisión de laboratorio: basta con una medida repetible y comparable con los objetivos.

## Decisions

- **Entrevistas y prueba de cámara en paralelo.** Las dos líneas no dependen una de otra y juntas caben en las 1 a 2 semanas previstas. Alternativa: hacerlas en serie, que alarga la fase sin reducir riesgo.
- **La maqueta sin código es opcional.** Solo se hace si, durante las entrevistas, hace falta enseñar la idea para obtener respuestas útiles. Si se hace, sirve únicamente para prototipar: el borrador advierte de que WorkAdventure tiene una licencia que impide venderlo como servicio.
- **Prueba de cámara con una sesión real.** Se monta el kit mínimo de dos pistas (cara y mesa vista desde arriba) y un mago enseña un movimiento de cerca a otra persona durante 20 minutos seguidos. Se comprueban los tres objetivos: latencia de 400 ms o menos, carta legible en el 80 % central del tapete y sin cortes. Alternativa: pruebas sintéticas sin mago, que no capturan lo que importa (si se ve la técnica).
- **Señal de compromiso con coste bajo para el mago.** Lista de espera con correo o reserva de una sesión de prueba. Alternativa: preventa de pago, más fiable pero más exigente; se deja como posible endurecimiento si el resultado es dudoso.
- **Resultados en Markdown dentro del repositorio** (`docs/validacion/`): un archivo por entrevista y uno para la prueba de cámara. Las entrevistas se guardan sin nombres, salvo consentimiento expreso. Alternativa: hojas de cálculo externas, que separan los datos del resto del trabajo.
- **Plazo de 4 meses con convocatoria abierta.** Las 100 inscripciones no pueden salir solo de los 5 a 10 entrevistados, así que la convocatoria se mantiene abierta hasta la reunión de decisión del 19 de marzo de 2027. Las entrevistas y la prueba de cámara se hacen al principio, para aprender pronto mientras se sigue captando. Alternativa: una fase corta de 1 a 2 semanas como proponía el borrador, que no daría tiempo a reunir 100 inscripciones.
- **Datos personales mínimos.** Solo el correo de quien se apunta a la lista de espera, con consentimiento claro, de acuerdo con el compromiso del borrador con el RGPD.

## Risks / Trade-offs

- [Cortesía: los magos dicen que sí por amabilidad] → La señal de compromiso real pesa más que la opinión declarada.
- [Muestra sesgada hacia gente cercana] → Incluir entrevistados que no conozcan el proyecto y anotar cómo se contactó a cada uno.
- [Prueba de cámara en condiciones ideales que no se repetirán] → Probar con un móvil y una conexión domésticas normales, no con equipo de estudio.
- [La fase se alarga sin decisión] → Fijar una fecha límite para la reunión de decisión al empezar.

## Open Questions

- Método concreto para medir la latencia en la prueba de cámara.
- Cómo se recluta a los 5 a 10 magos a entrevistar y quién conduce las entrevistas.
- Dónde se aloja la lista de espera sin desarrollar nada propio.
