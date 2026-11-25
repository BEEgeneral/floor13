# Floor 13 · prototipo jugable

Requisitos: Node 22+.

```
cd game
npm install
npm run dev        # servidor en :2567 y cliente en :5173
npm test           # reglas compartidas y servidor (15 tests)
```

Abre http://localhost:5173, crea un mago (sin contraseña) y entra. Abre una segunda ventana en modo incógnito para probar con dos jugadores.

- Mover: flechas, WASD o stick · E/A: ascensor · T: chat de proximidad · M: sonido · 1: aplauso · 2: mano · C: tu carta · P: panel de pruebas (da rol, notas y llaves para comprobar accesos).
- Plantas: Vestíbulo, Café, Gran Salón (abiertas), Sala de mesa (requiere rol huésped o superior), Planta 13 (requiere llave de examen, invitación o rol tribunal/anfitrión; oculta si no se tiene).
- Los perfiles se guardan en `game/server/data/profiles.json` (ignorado por git). `F13_TEST=0` desactiva el panel de pruebas.
