# Tasks

## 1. Base del proyecto

- [ ] 1.1 Crear el monorepo `game/` con `shared`, `server` y `client`, y verificar que `npm run dev` arranca los dos
- [ ] 1.2 Escribir en `shared` el cálculo de nivel, tramo y rango con pruebas, y verificar que el ejemplo 84/80/83/79 da 82 y Oro
- [ ] 1.3 Escribir en `shared` las reglas de acceso por planta con pruebas, y verificar los escenarios de la especificación

## 2. Servidor

- [ ] 2.1 Implementar la entrada de prueba y el guardado de perfiles, y verificar que un perfil se recupera con su token
- [ ] 2.2 Crear una sala por planta con movimiento validado y colisiones, y verificar que dos clientes se ven entre sí
- [ ] 2.3 Aplicar las reglas de acceso al entrar en cada sala, y verificar que se rechaza con motivo
- [ ] 2.4 Implementar chat de proximidad y gestos, y verificar que solo llegan a los cercanos
- [ ] 2.5 Implementar el modo prueba (rol, nivel y llaves) protegido por variable de entorno

## 3. Cliente

- [ ] 3.1 Pantalla de entrada y creación del jugador, y verificar que se puede crear y recuperar
- [ ] 3.2 Plantas con gráficos básicos, avatares y colisiones, y verificar visualmente cada planta
- [ ] 3.3 Controles con teclado y mando, y verificar que ambos mueven al jugador
- [ ] 3.4 Menú del ascensor con ocupación, candados y motivo, y verificar que la Planta 13 solo aparece con acceso
- [ ] 3.5 Chat, gestos y carta del jugador, y verificar que se ven en dos pestañas
- [ ] 3.6 Panel de modo prueba, y verificar que cambia los accesos

## 4. Prueba conjunta

- [ ] 4.1 Prueba automática con dos jugadores: entrar, verse, hablar y subir de planta
- [ ] 4.2 Anotar en `docs/` cómo arrancar y probar el prototipo

## Workflow follow-up

- Sustituir los fondos por los renders de Blender, planta por planta.
- Archivar el cambio cuando el prototipo esté revisado.
