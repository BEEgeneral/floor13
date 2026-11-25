import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelFromStats, tierFromLevel, rankName, accessFor, FLOORS, FLOOR_ORDER, collides, step, hoursToReach } from './index.ts';

test('nivel a partir de las notas (84/80/83/79 → 82, Oro)', () => {
  const n = levelFromStats({ tec: 84, pre: 80, cre: 83, ens: 79 });
  assert.equal(n, 82); assert.equal(tierFromLevel(n), 'oro');
});
test('tramos en los límites', () => {
  assert.deepEqual([39, 40, 59, 60, 74, 75, 89, 90, 100].map(tierFromLevel), ['antesala', 'bronce', 'bronce', 'plata', 'plata', 'oro', 'oro', 'neon', 'neon']);
});
test('nombres de rango', () => {
  assert.equal(rankName(0), 'Curioso I'); assert.equal(rankName(43), 'Mago de Mesa IV'); assert.equal(rankName(91), 'Archimago II'); assert.equal(rankName(100), 'Leyenda de la Planta 13');
  for (let n = 0; n <= 100; n++) assert.ok(rankName(n));
  assert.throws(() => rankName(101));
});
test('la curva de horas crece siempre y llega a 2.500 h', () => {
  for (let n = 0; n < 100; n++) assert.ok(hoursToReach(n + 1) > hoursToReach(n));
  assert.equal(Math.round(hoursToReach(100)), 2500);
});
test('accesos: plantas libres', () => {
  for (const id of ['vestibulo', 'cafe', 'salon'] as const) assert.equal(accessFor({ role: 'visitante', keys: [] }, id).allowed, true);
});
test('accesos: sala de mesa requiere huésped', () => {
  const a = accessFor({ role: 'visitante', keys: [] }, 'salamesa');
  assert.equal(a.allowed, false); assert.match(a.reason!, /huésped/);
  assert.equal(accessFor({ role: 'huesped', keys: [] }, 'salamesa').allowed, true);
});
test('accesos: Planta 13 con llave, invitación o rol, y oculta si no', () => {
  assert.equal(accessFor({ role: 'visitante', keys: ['llave_examen'] }, 'planta13').allowed, true);
  assert.equal(accessFor({ role: 'visitante', keys: ['invitacion_charla'] }, 'planta13').allowed, true);
  assert.equal(accessFor({ role: 'tribunal', keys: [] }, 'planta13').allowed, true);
  const no = accessFor({ role: 'huesped', keys: [] }, 'planta13');
  assert.equal(no.allowed, false); assert.equal(no.visible, false);
});
test('cada planta: el punto de aparición y el ascensor son transitables', () => {
  for (const id of FLOOR_ORDER) { const f = FLOORS[id]; assert.equal(collides(f.spawn[0], f.spawn[1], f.colliders), false, `${id} spawn`); assert.equal(collides(f.lift[0], f.lift[1], f.colliders), false, `${id} lift`); }
});
test('pared: el movimiento se detiene y desliza', () => {
  const f = FLOORS.vestibulo; const p = step(480, 214, 0, -20, f.colliders);
  assert.ok(p.y >= 214 - 1e-9 && p.y <= 214);   // no atraviesa la pared
  const q = step(20, 400, -30, 0, f.colliders); assert.ok(q.x >= 10);
});

test('aspecto: se normaliza y es estable', async () => {
  const { normalizeLook, defaultLook, LOOK_SIZES, lookFromString, lookToString } = await import('./look.ts');
  assert.deepEqual(defaultLook('abc'), defaultLook('abc'));
  const l = normalizeLook([99, -1, 'x', 2.5, 3, 1, 1], 'abc');
  l.forEach((v, i) => assert.ok(Number.isInteger(v) && v >= 0 && v < LOOK_SIZES[i]));
  assert.equal(l[4], 3); assert.equal(l[5], 1);
  assert.deepEqual(lookFromString(lookToString(l)), l);
  assert.equal(normalizeLook(null, 'z').length, LOOK_SIZES.length);
});
