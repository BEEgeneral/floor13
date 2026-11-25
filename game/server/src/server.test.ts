import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@colyseus/sdk';
import { start } from './app.ts';

const PORT = 2599, API = `http://localhost:${PORT}/api`;
let server: Awaited<ReturnType<typeof start>>;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const post = async (p: string, body: unknown, token?: string) => { const r = await fetch(API + p, { method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { 'x-token': token } : {}) }, body: JSON.stringify(body) }); return { status: r.status, json: await r.json() as any }; };
const get = async (p: string, token: string) => (await (await fetch(API + p, { headers: { 'x-token': token } })).json()) as any;
const join = (name: string, token: string) => new Client(`ws://localhost:${PORT}`).joinOrCreate(name, { token });

before(async () => { server = await start({ port: PORT, dataFile: null, testMode: true }); });
after(async () => { await server.gracefullyShutdown(false).catch(() => {}); });

test('entrada: crea, recupera y rechaza nombre repetido', async () => {
  const a = await post('/login', { name: 'Ana Velo', country: 'es', specialty: 'naipe', schoolName: 'Escuela del Alba' });
  assert.equal(a.status, 200); assert.equal(a.json.profile.role, 'visitante'); assert.equal(a.json.profile.stats, null); assert.equal(a.json.card.rank, 'Sin examinar');
  const again = await post('/login', { token: a.json.token });
  assert.equal(again.json.profile.id, a.json.profile.id);
  const dup = await post('/login', { name: 'ana velo' }); assert.equal(dup.status, 409);
});

test('nivel y carta salen de las notas (modo prueba)', async () => {
  const { json } = await post('/login', { name: 'Lucía Arcana' });
  const r = await post('/prueba/perfil', { stats: { tec: 84, pre: 80, cre: 83, ens: 79 } }, json.token);
  assert.equal(r.json.card.level, 82); assert.equal(r.json.card.tier, 'oro'); assert.equal(r.json.card.rank, 'Maestro de Mesa VIII');
});

test('un visitante no puede darse permisos fuera del modo prueba ni cambiar a otro', async () => {
  const a = (await post('/login', { name: 'Intruso' })).json, b = (await post('/login', { name: 'Objetivo' })).json;
  const r = await post('/prueba/perfil', { profileId: b.profile.id, role: 'tribunal' }, a.token); assert.equal(r.status, 403);
});

test('accesos: plantas libres, sala de mesa y Planta 13 oculta', async () => {
  const a = (await post('/login', { name: 'Acceso Uno' })).json;
  let plantas = (await get('/plantas', a.token)) as any[];
  assert.deepEqual(plantas.map(p => p.id), ['vestibulo', 'cafe', 'salon', 'salamesa']);
  assert.equal(plantas.find(p => p.id === 'salamesa').allowed, false);
  await assert.rejects(() => join('salamesa', a.token), /huésped/);
  await assert.rejects(() => join('planta13', a.token), /llave|invitaci/);
  await post('/prueba/perfil', { role: 'huesped', keys: ['llave_examen'] }, a.token);
  plantas = await get('/plantas', a.token);
  assert.ok(plantas.find(p => p.id === 'planta13').allowed);
  const r13 = await join('planta13', a.token); assert.ok(r13.sessionId); await r13.leave();
  const rm = await join('salamesa', a.token); await rm.leave();
});

test('dos jugadores se ven, hablan por proximidad y el servidor valida el movimiento', async () => {
  const A = (await post('/login', { name: 'Jugador A' })).json, B = (await post('/login', { name: 'Jugador B' })).json;
  const ra: any = await join('vestibulo', A.token), rb: any = await join('vestibulo', B.token);
  await sleep(300);
  assert.equal(ra.state.players.size, 2); assert.equal(rb.state.players.size, 2);
  // otra planta no se ve
  const C = (await post('/login', { name: 'Jugador C' })).json; const rc: any = await join('cafe', C.token); await sleep(200);
  assert.equal(rc.state.players.size, 1);
  // chat cercano
  const got: string[] = []; rb.onMessage('chat', (m: any) => got.push(m.text)); ra.send('chat', { text: 'hola cerca' }); await sleep(200);
  assert.deepEqual(got, ['hola cerca']);
  // teletransporte ilegal: se corrige
  let fix: any = null; ra.onMessage('corregir', (m: any) => { fix = m; }); ra.send('pos', { x: 100, y: 400 }); await sleep(200);
  assert.ok(fix, 'debe corregir un salto'); assert.equal(Math.round(ra.state.players.get(ra.sessionId).x), 480);
  // pared: no se atraviesa
  fix = null; ra.send('pos', { x: 480, y: 200 }); await sleep(150); assert.ok(fix, 'no debe entrar en la pared');
  // movimiento legal de B hacia la izquierda hasta quedar lejos (> 6 baldosas)
  let x = 480; for (let i = 0; i < 50; i++) { x -= 7; rb.send('pos', { x, y: 540, face: -1, moving: true }); await sleep(50); }
  await sleep(150); assert.ok(ra.state.players.get(rb.sessionId).x < 200, 'A ve moverse a B');
  got.length = 0; const heard: string[] = []; rb.onMessage('chat', (m: any) => heard.push(m.text)); ra.send('chat', { text: 'hola lejos' }); await sleep(250);
  assert.deepEqual(heard, [], 'fuera de alcance no se oye');
  // gesto visible
  rb.send('gesto', { kind: 'aplauso' }); await sleep(200); assert.equal(ra.state.players.get(rb.sessionId).gesture, 'aplauso');
  await Promise.all([ra.leave(), rb.leave(), rc.leave()]);
});

test('el mismo mago no entra dos veces en una planta', async () => {
  const A = (await post('/login', { name: 'Doble' })).json; const r1 = await join('vestibulo', A.token);
  await assert.rejects(() => join('vestibulo', A.token), /otra pestaña/); await r1.leave();
});

test('el aspecto se elige al entrar, se corrige si es inválido y se puede cambiar', async () => {
  const a = await post('/login', { name: 'Vera Capa', look: [3, 2, 1, 0, 4, 2, 1] });
  assert.deepEqual(a.json.profile.look, [3, 2, 1, 0, 4, 2, 1]);
  const b = await post('/login', { name: 'Raro Look', look: [99, 'x'] });
  assert.equal(b.json.profile.look.length, 7); assert.ok(b.json.profile.look.every((v: number) => Number.isInteger(v) && v >= 0));
  const c = await post('/yo/aspecto', { look: [0, 0, 0, 0, 0, 0, 0] }, a.json.token);
  assert.deepEqual(c.json.profile.look, [0, 0, 0, 0, 0, 0, 0]);
});
