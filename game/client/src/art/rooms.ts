// @ts-nocheck
/* Arte de cada planta: fondo estático, piezas con profundidad, luces y arcos eléctricos.
   Los renders de Blender sustituirán paintStatic; las piezas con las que se interactúa seguirán siendo sprites. */
import * as D from './draw.ts';
import { VESTIBULO, PLANTA13 } from './rooms_base.ts';
const { W, H, WALL, SERIF, BRASS, brassG, shadow, lin, rad, rng, drawColumn, drawCandelabra, drawChair, drawPerson, drawDesk, drawPlant, drawSofa, drawElevatorDoor, drawTapestry, drawRoundTable, drawCameraRig } = D;

function parquet(g, x0, y0, x1, y1, seed = 3) {
  const R = rng(seed); g.fillStyle = '#1b0f09'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (let y = y0; y < y1; y += 24) { let x = x0 - R() * 90; while (x < x1) { const w = 80 + R() * 110, l = 14 + R() * 10; g.fillStyle = `rgb(${52 + R() * 26 | 0},${28 + R() * 14 | 0},${16 + R() * 8 | 0})`; g.fillRect(x + 1, y + 1, w - 2, 22); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(x + 1, y + 1, w - 2, 3); x += w; } }
  g.fillStyle = lin(g, 0, y0, 0, y0 + 100, [[0, 'rgba(0,0,0,.65)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(x0, y0, x1 - x0, 100);
}
const person = (x, y, o) => drawPerson;
function cafeTable(c, x, y, cloth, t) { // base en (x,y): centro de la mesa
  shadow(c, x, y + 30, 66, 14, .5);
  c.fillStyle = '#20140e'; c.beginPath(); c.ellipse(x, y + 14, 56, 22, 0, 0, 7); c.fill();
  c.fillStyle = '#3a261a'; c.beginPath(); c.ellipse(x, y + 6, 56, 22, 0, 0, 7); c.fill(); c.strokeStyle = BRASS[1]; c.lineWidth = 3; c.stroke();
  c.fillStyle = cloth; c.beginPath(); c.ellipse(x, y + 3, 47, 17, 0, 0, 7); c.fill();
  c.fillStyle = '#f4ead2'; c.fillRect(x - 2, y - 6, 4, 9); c.fillStyle = '#ffd36a'; c.beginPath(); c.ellipse(x, y - 9, 2.6, 5, 0, 0, 7); c.fill();
  c.fillStyle = '#f6efe0'; c.strokeStyle = '#86253b'; c.lineWidth = 1.5; [[-22, 4, -12], [-14, 6, 6], [24, 3, 14]].forEach(([dx, dy, r]) => { c.save(); c.translate(x + dx, y + dy); c.rotate(r * Math.PI / 180); c.beginPath(); c.roundRect(-5, -7, 10, 14, 2); c.fill(); c.stroke(); c.restore(); });
}
function bottle(g, x, y, col) { g.fillStyle = col; g.fillRect(x, y, 9, 26); g.fillRect(x + 3, y - 9, 3, 10); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 1, y + 2, 2, 20); }
function chairRing(P, x, y, n, jackets, seated) {
  const spots = [[-74, 4, 'd'], [74, 4, 'd'], [0, -30, 'd'], [0, 44, 'u']];
  spots.slice(0, n).forEach(([dx, dy, d], i) => {
    P.push({ y: y + dy, f: c => drawChair(c, x + dx, y + dy, d) });
    if (seated[i]) P.push({ y: y + dy + 2, f: c => drawPerson(c, x + dx, y + dy - 2, { jacket: jackets[i % jackets.length], seated: true, hat: i % 2 === 0, face: dx > 0 ? -1 : dx < 0 ? 1 : 0 }) });
  });
}

export const CAFE = {
  id: 0, name: 'Café del Naipe', seed: 21, ambient: .74, tint: 'rgba(255,170,90,.05)', arcs: [],
  paintStatic(g) {
    parquet(g, 0, WALL, W, H, 5);
    g.fillStyle = lin(g, 0, H - 150, 0, H, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.4)']]); g.fillRect(0, H - 150, W, 150);
    g.fillStyle = '#120b08'; g.fillRect(60, 40, 380, 120); g.strokeStyle = BRASS[1]; g.lineWidth = 3; g.strokeRect(60, 40, 380, 120);
    [70, 125].forEach(y => { g.fillStyle = brassG(g, 60, 440); g.fillRect(64, y, 372, 5); });
    ['#2f7a46', '#86253b', '#c8993e', '#1d5a6b', '#6b1a2c', '#2f7a46', '#c8993e', '#1d5a6b'].forEach((c, i) => { bottle(g, 80 + i * 44, 44, c); bottle(g, 96 + i * 44, 99, i % 2 ? '#86253b' : '#c8993e'); });
    g.fillStyle = '#1b120d'; g.strokeStyle = BRASS[1]; g.lineWidth = 3; g.beginPath(); g.roundRect(560, 56, 300, 70, 8); g.fill(); g.stroke();
    g.fillStyle = '#e8c36a'; g.font = `400 30px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CAFÉ DEL NAIPE', 710, 84); g.fillStyle = '#a79c88'; g.font = `400 14px 'Fira Sans', sans-serif`; g.fillText('Charla libre · todos los niveles', 710, 110);
    g.fillStyle = 'rgba(111,240,255,.9)'; g.font = `600 15px 'Fira Sans', sans-serif`; g.fillText('↓ RINCÓN DE NOVATOS', 150, 450);
    [40, 920].forEach(x => drawColumn(g, x, WALL + 4));
  },
  props(t) {
    const P = [];
    P.push({ y: WALL + 2, f: c => drawElevatorDoor(c, 480, WALL + 4, t, 0) });
    P.push({ y: 290, f: c => drawDesk(c, 60, 246, 380) });
    [110, 190, 270, 350].forEach(x => P.push({ y: 316, f: c => { shadow(c, x, 318, 14, 5, .4); c.fillStyle = BRASS[2]; c.fillRect(x - 2, 300, 4, 18); c.fillStyle = '#86253b'; c.beginPath(); c.ellipse(x, 298, 13, 6, 0, 0, 7); c.fill(); c.strokeStyle = BRASS[1]; c.lineWidth = 2; c.stroke(); } }));
    P.push({ y: 232, f: c => drawPerson(c, 250, 236, { jacket: '#23403f', hat: false, face: 0 }) });
    P.push({ y: 320, f: c => drawPerson(c, 190, 316, { jacket: '#5a2a2a', seated: true, hat: true, face: 0 }) });
    const mesas = [[215, 380, '#0e4a54', ['#2a2f4a', '#3a2438'], [1, 0, 1, 0]], [465, 440, '#2a6a3a', ['#4a3320', '#7a1d33'], [1, 1, 0, 1]], [715, 400, '#0e4a54', ['#23403f', '#5a2a2a'], [0, 1, 1, 1]], [175, 535, '#2a6a3a', ['#7a1d33', '#2c3e5a'], [1, 0, 0, 0]], [725, 555, '#0e4a54', ['#3a2438', '#4a3320'], [1, 1, 1, 0]]];
    mesas.forEach(([x, y, cloth, jackets, seated]) => { P.push({ y: y + 26, f: c => cafeTable(c, x, y, cloth, t) }); chairRing(P, x, y, 4, jackets, seated); });
    P.push({ y: 340, f: c => { shadow(c, 865, 346, 52, 10, .5); c.fillStyle = '#0e0c10'; c.beginPath(); c.roundRect(820, 292, 90, 48, 4); c.fill(); c.fillStyle = BRASS[2]; c.fillRect(820, 292, 90, 4); c.fillStyle = '#efe9dc'; c.fillRect(826, 318, 78, 16); c.fillStyle = '#111'; for (let i = 0; i < 12; i++) c.fillRect(830 + i * 6.3, 318, 3, 10); } });
    P.push({ y: 590, f: c => drawPlant(c, 60, 586, t) }); P.push({ y: 590, f: c => drawPlant(c, 900, 586, t) });
    [[40, WALL + 70], [920, WALL + 70]].forEach(([x, y], i) => P.push({ y, f: c => drawCandelabra(c, x, y, t, i * 4) }));
    return P;
  },
  lights(t) {
    const f = i => .92 + .08 * Math.sin(t * 9 + i * 2) + .04 * Math.sin(t * 21 + i);
    return [...[[215, 372], [465, 432], [715, 392], [175, 527], [725, 547]].map(([x, y], i) => ({ x, y, r: 190, a: .85 * f(i), c: '255,190,100' })),
      { x: 250, y: 120, r: 240, a: .8, c: '255,190,100' }, { x: 710, y: 100, r: 200, a: .6, c: '255,190,100' }, { x: 480, y: WALL - 30, r: 150, a: .85, c: '111,240,255' }, { x: 40, y: WALL + 22, r: 150, a: .7 * f(9), c: '255,190,100' }, { x: 920, y: WALL + 22, r: 150, a: .7 * f(8), c: '255,190,100' }];
  },
};

export const SALON = {
  id: 1, name: 'Gran Salón', seed: 31, ambient: .8, tint: 'rgba(255,150,80,.04)', arcs: [],
  paintStatic(g) {
    g.fillStyle = '#1b120d'; g.fillRect(0, 0, W, WALL);
    // telón del escenario
    g.fillStyle = lin(g, 170, 0, 790, 0, [[0, '#3a0b18'], [.2, '#86253b'], [.5, '#5a1424'], [.8, '#86253b'], [1, '#3a0b18']]); g.fillRect(170, 14, 620, WALL - 24);
    for (let x = 170; x < 790; x += 22) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, 14, 3, WALL - 24); }
    g.fillStyle = brassG(g, 170, 790); g.fillRect(160, 8, 640, 14);
    g.fillStyle = 'rgba(232,195,106,.9)'; g.font = `400 40px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CHARLAS DEL HOTEL', 480, 96);
    // escenario
    g.fillStyle = lin(g, 0, WALL, 0, 330, [[0, '#4a3020'], [1, '#2a190f']]); g.fillRect(170, WALL, 620, 130);
    g.fillStyle = brassG(g, 170, 790); g.fillRect(170, 318, 620, 6); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(170, 324, 620, 10);
    // pasillo central
    g.fillStyle = '#5a1424'; g.fillRect(450, 336, 60, H - 336); g.strokeStyle = BRASS[2]; g.lineWidth = 3; g.strokeRect(450, 336, 60, H - 336);
    // biblioteca de recursos
    g.fillStyle = '#20140d'; g.fillRect(24, 244, 56, 352); g.strokeStyle = BRASS[1]; g.lineWidth = 3; g.strokeRect(24, 244, 56, 352);
    const R = rng(8); for (let r = 0; r < 9; r++) { const y = 252 + r * 38; g.fillStyle = BRASS[0]; g.fillRect(28, y + 32, 48, 4); let x = 30; while (x < 74) { const w = 4 + R() * 5; g.fillStyle = ['#86253b', '#1d5a6b', '#c8993e', '#2f7a46', '#4a3320'][R() * 5 | 0]; g.fillRect(x, y + 6 + R() * 6, w, 26); x += w + 1; } }
    g.fillStyle = 'rgba(111,240,255,.9)'; g.font = `600 13px 'Fira Sans', sans-serif`; g.textAlign = 'left'; g.fillText('BIBLIOTECA', 30, 236);
    [30, 930].forEach(x => drawColumn(g, x, WALL + 4)); drawTapestry(g, 40, 30, 90, 130, 'XIII'); drawTapestry(g, 830, 30, 90, 130, '1');
  },
  props(t) {
    const P = [];
    P.push({ y: WALL + 2, f: c => drawElevatorDoor(c, 868, WALL + 4, t, 1) });
    P.push({ y: 300, f: c => drawDesk(c, 322, 262, 58) });
    P.push({ y: 300, f: c => drawPerson(c, 420, 294, { jacket: '#7a1d33', face: 0 }) });
    const J = ['#2a2f4a', '#3a2438', '#23403f', '#4a3320', '#5a2a2a', '#2c3e5a'];
    [[200, 0], [510, 1]].forEach(([x0, side]) => { for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) {
      const x = x0 + 25 + k * 50, y = 428 + r * 55; P.push({ y, f: c => drawChair(c, x, y, 'u') });
      if ((k * 3 + r * 5 + side) % 3 === 0) P.push({ y: y + 1, f: c => drawPerson(c, x, y - 4, { jacket: J[(k + r + side) % 6], seated: true, hat: (k + r) % 2 === 0, face: 0 }) });
    } });
    [[44, WALL + 66], [916, WALL + 66]].forEach(([x, y], i) => P.push({ y, f: c => drawCandelabra(c, x, y, t, i * 4) }));
    P.push({ y: 600, f: c => drawPlant(c, 120, 596, t) }); P.push({ y: 600, f: c => drawPlant(c, 850, 596, t) });
    return P;
  },
  lights(t) {
    const f = i => .92 + .08 * Math.sin(t * 9 + i * 2);
    return [{ x: 480, y: 270, r: 380, a: .95, c: '255,200,120' }, { x: 480, y: 500, r: 300, a: .55, c: '255,190,110' }, { x: 868, y: WALL - 40, r: 160, a: .85, c: '111,240,255' }, { x: 52, y: 420, r: 200, a: .6, c: '255,190,100' }, { x: 44, y: WALL + 24, r: 150, a: .7 * f(1), c: '255,190,100' }, { x: 916, y: WALL + 24, r: 150, a: .7 * f(2), c: '255,190,100' }];
  },
};

export const SALAMESA = {
  id: 4, name: 'Sala de mesa', seed: 41, ambient: .8, tint: 'rgba(255,150,80,.05)', arcs: [],
  paintStatic(g) {
    parquet(g, 150, WALL, W - 150, H - 70, 9);
    g.fillStyle = '#050407'; g.fillRect(0, 0, 150, H); g.fillRect(W - 150, 0, 150, H); g.fillStyle = '#120b08'; g.fillRect(150, H - 70, W - 300, 70);
    g.fillStyle = brassG(g, 0, W); g.fillRect(150, H - 74, W - 300, 6); g.fillRect(146, 0, 5, H); g.fillRect(W - 151, 0, 5, H);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(150, 0, 60, WALL); g.fillRect(W - 210, 0, 60, WALL);
    // chimenea
    g.fillStyle = '#2b2018'; g.fillRect(200, 70, 130, 122); g.strokeStyle = BRASS[1]; g.lineWidth = 4; g.strokeRect(200, 70, 130, 122);
    g.fillStyle = '#0d0907'; g.beginPath(); g.moveTo(220, 192); g.lineTo(220, 116); g.quadraticCurveTo(265, 86, 310, 116); g.lineTo(310, 192); g.fill();
    g.fillStyle = '#ff9a3c'; g.beginPath(); g.moveTo(236, 192); g.quadraticCurveTo(250, 140, 265, 130); g.quadraticCurveTo(282, 150, 294, 192); g.fill(); g.fillStyle = '#ffe08a'; g.beginPath(); g.moveTo(252, 192); g.quadraticCurveTo(264, 156, 276, 192); g.fill();
    drawTapestry(g, 640, 30, 120, 130, 'XIII'); drawColumn(g, 180, WALL + 4); drawColumn(g, 780, WALL + 4);
    g.fillStyle = 'rgba(232,195,106,.9)'; g.font = `400 26px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SALA DE MESA', 480, 60);
  },
  props(t) {
    const P = [];
    P.push({ y: WALL + 2, f: c => drawElevatorDoor(c, 480, WALL + 4, t, 4) });
    P.push({ y: 430, f: c => { c.save(); c.translate(480, 372); c.scale(.82, .82); drawRoundTable(c, 0, 0, t); c.restore(); } });
    P.push({ y: 200, f: c => { c.save(); c.translate(480, 372); c.scale(.82, .82); drawCameraRig(c, 0, 0, t); c.restore(); }, top: true });
    P.push({ y: 318, f: c => drawChair(c, 480, 318, 'd') }); P.push({ y: 320, f: c => drawPerson(c, 480, 314, { jacket: '#23403f', seated: true, hat: true, face: 0 }) });
    P.push({ y: 470, f: c => drawChair(c, 480, 470, 'u') });
    P.push({ y: 500, f: c => { shadow(c, 640, 500, 14, 5, .4); c.strokeStyle = '#111'; c.lineWidth = 3; c.beginPath(); c.moveTo(640, 500); c.lineTo(640, 462); c.stroke(); c.fillStyle = '#0d0b10'; c.fillRect(632, 436, 16, 28); c.fillStyle = '#6ff0ff'; c.fillRect(634, 438, 12, 22); } });
    [[170, 230], [790, 230], [170, 560], [790, 560]].forEach(([x, y], i) => P.push({ y, f: c => drawCandelabra(c, x, y, t, i * 3) }));
    P.push({ y: 560, f: c => drawPlant(c, 200, 556, t) });
    return P;
  },
  lights(t) {
    const f = i => .9 + .1 * Math.sin(t * 9 + i * 2) + .05 * Math.sin(t * 23 + i);
    return [{ x: 265, y: 190, r: 260, a: .95 * f(1), c: '255,150,60' }, { x: 480, y: 372, r: 230, a: .9, c: '111,240,255' }, { x: 480, y: 330, r: 330, a: .5, c: '255,190,110' }, { x: 480, y: WALL - 30, r: 150, a: .8, c: '111,240,255' },
      ...[[170, 200], [790, 200], [170, 530], [790, 530]].map(([x, y], i) => ({ x, y, r: 170, a: .8 * f(i + 3), c: '255,190,100' }))];
  },
};

const withArcs = (room, coils, target) => Object.assign(room, { arcs: coils.map(x => ({ from: [x, WALL - 78], to: target })) });
withArcs(PLANTA13, [334, 626], [480, WALL - 140]); withArcs(VESTIBULO, [372, 588], [480, WALL - 140]);
export const ART = { vestibulo: VESTIBULO, cafe: CAFE, salon: SALON, salamesa: SALAMESA, planta13: PLANTA13 };
