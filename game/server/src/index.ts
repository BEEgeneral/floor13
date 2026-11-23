import { start } from './app.ts';
start().then(() => console.log('Floor 13 · servidor de prueba en el puerto', process.env.PORT ?? 2567));
