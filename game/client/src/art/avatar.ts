import Phaser from 'phaser';
import { lookFromString, type Look } from '@floor13/shared';

export const FW = 72, FH = 104, FEET_Y = 90, FRAMES = 8;
export const JACKETS = ['#7a1d33', '#1d5a6b', '#2a2f4a', '#3a2438', '#23403f', '#5a3a1e', '#5a2a2a', '#2c3e5a'];
export const SKINS = ['#f0c9a6', '#e2b48e', '#c28d68', '#9a6a48', '#6b4630'];
export const HAIRS = ['#2a1d16', '#111111', '#5a3a22', '#9a9a9a', '#c9a14a', '#8a3a1a'];
export const NAMES = {
  hat: ['Sin sombrero', 'Chistera', 'Bombín', 'Fedora', 'Boina'],
  hairStyle: ['Corto', 'Raya lateral', 'Largo', 'Rapado', 'Rizado', 'Coleta'],
  acc: ['Nada', 'Bigote', 'Barba', 'Gafas'],
  cape: ['Sin capa', 'Capa'],
};

const shade = (hex: string, k: number) => { const n = parseInt(hex.slice(1), 16); const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };

/** Dibuja un mago mirando a la derecha. `walk` es la fase del paso en radianes (0 = quieto). */
export function drawMago(g: CanvasRenderingContext2D, cx: number, fy: number, look: Look, walk: number) {
  const [j, hatI, skI, hcI, hsI, acc, cape] = look, jacket = JACKETS[j], skin = SKINS[skI], hair = HAIRS[hcI];
  const sw = Math.sin(walk), bob = Math.abs(Math.sin(walk)) * 2.4, step = sw * 6;
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  // sombra de contacto
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(cx, fy + 1, 15, 4.5, 0, 0, 7); g.fill();
  const hipY = fy - 20 - bob, shY = hipY - 27;
  // capa detrás del cuerpo
  if (cape) { g.fillStyle = '#12101a'; g.beginPath(); g.moveTo(cx - 9, shY + 2); g.quadraticCurveTo(cx - 20 - Math.abs(sw) * 4, hipY, cx - 14 - sw * 3, fy - 6); g.lineTo(cx + 2, fy - 8); g.lineTo(cx + 4, shY + 2); g.fill(); g.fillStyle = '#8b1c2f'; g.beginPath(); g.moveTo(cx - 9, shY + 2); g.quadraticCurveTo(cx - 17 - Math.abs(sw) * 3, hipY, cx - 12 - sw * 3, fy - 7); g.lineTo(cx - 6, fy - 8); g.quadraticCurveTo(cx - 8, hipY, cx - 3, shY + 3); g.fill(); }
  // pelo largo por detrás
  if (hsI === 2) { g.fillStyle = hair; g.beginPath(); g.roundRect(cx - 11, shY - 22, 12, 30, 5); g.fill(); }
  if (hsI === 5) { g.fillStyle = hair; g.beginPath(); g.ellipse(cx - 12, shY - 18 + Math.sin(walk * 2) * 1.5, 4, 8, .4, 0, 7); g.fill(); }
  // pierna trasera, delantera
  const leg = (dx: number, lift: number, back: boolean) => {
    g.fillStyle = back ? '#0d0c12' : '#17151d'; g.beginPath(); g.roundRect(cx + dx - 4, hipY - 2, 8, 20 - lift, 3); g.fill();
    g.fillStyle = '#050507'; g.beginPath(); g.ellipse(cx + dx + 2, fy - 2 - lift, 7, 3.4, 0, 0, 7); g.fill();
  };
  leg(-4 - step * .8, Math.max(0, -sw) * 3, true); leg(4 + step * .8, Math.max(0, sw) * 3, false);
  // brazo trasero
  const arm = (dx: number, s: number, back: boolean) => {
    g.fillStyle = back ? shade(jacket, .7) : shade(jacket, .92); g.beginPath(); g.roundRect(cx + dx - 3.5 + s * .3, shY + 1, 7, 21, 3.5); g.fill();
    g.fillStyle = skin; g.beginPath(); g.arc(cx + dx + s * .4, shY + 23, 3.3, 0, 7); g.fill();
  };
  arm(-1 + sw * 3, -sw * 4, true);
  // torso con degradado y solapas
  const gr = g.createLinearGradient(cx - 12, 0, cx + 12, 0); gr.addColorStop(0, shade(jacket, 1.15)); gr.addColorStop(1, shade(jacket, .72));
  g.fillStyle = gr; g.beginPath(); g.roundRect(cx - 12, shY - 1, 24, 30, 7); g.fill();
  g.fillStyle = '#f1ebdc'; g.beginPath(); g.moveTo(cx - 4, shY); g.lineTo(cx + 5, shY); g.lineTo(cx + 1, shY + 17); g.fill();
  g.strokeStyle = shade(jacket, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx - 4, shY); g.lineTo(cx + 1, shY + 17); g.lineTo(cx + 5, shY); g.stroke();
  g.fillStyle = '#a31c3d'; g.beginPath(); g.moveTo(cx + .5, shY + 3); g.lineTo(cx - 3, shY + 1); g.lineTo(cx - 3, shY + 5); g.fill(); g.beginPath(); g.moveTo(cx + .5, shY + 3); g.lineTo(cx + 4, shY + 1); g.lineTo(cx + 4, shY + 5); g.fill();
  g.fillStyle = '#e8c36a'; g.fillRect(cx + 5, shY + 14, 2, 2); g.fillRect(cx + 5, shY + 20, 2, 2);
  arm(1 - sw * 3, sw * 4, false);
  // cabeza
  const hy = shY - 13;
  g.fillStyle = shade(skin, .86); g.fillRect(cx - 3, shY - 5, 6, 6);
  g.fillStyle = skin; g.beginPath(); g.ellipse(cx, hy, 8.8, 9.6, 0, 0, 7); g.fill();
  g.fillStyle = shade(skin, .9); g.beginPath(); g.ellipse(cx - 8.4, hy + 1, 2, 3, 0, 0, 7); g.fill();
  g.fillStyle = shade(skin, .93); g.beginPath(); g.moveTo(cx + 8.4, hy + 1); g.lineTo(cx + 11, hy + 3.5); g.lineTo(cx + 8, hy + 4.6); g.fill();   // nariz
  // pelo según peinado
  g.fillStyle = hair;
  if (hsI === 0) { g.beginPath(); g.ellipse(cx - 1, hy - 4, 9.4, 7, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 9.6, hy - 5, 3, 8); }
  if (hsI === 1) { g.beginPath(); g.ellipse(cx - 1, hy - 4, 9.6, 7.4, 0, Math.PI * .92, Math.PI * 2.02); g.fill(); g.beginPath(); g.moveTo(cx - 3, hy - 11); g.quadraticCurveTo(cx + 9, hy - 9, cx + 9.6, hy - 2); g.lineTo(cx + 3, hy - 6); g.fill(); }
  if (hsI === 2) { g.beginPath(); g.ellipse(cx - 1, hy - 3, 9.8, 8, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 10, hy - 4, 4, 16); }
  if (hsI === 3) { g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(cx - 2, hy - 7, 3.5, 1.6, -.4, 0, 7); g.fill(); }
  if (hsI === 4) { for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(cx - 8 + i * 2.8, hy - 7 - Math.sin(i / 6 * Math.PI) * 3, 3.6, 0, 7); g.fill(); } }
  if (hsI === 5) { g.beginPath(); g.ellipse(cx - 1, hy - 4, 9.4, 6.8, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 9.6, hy - 5, 3, 7); }
  // cara
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(cx + 3.6, hy - .5, 2.5, 2.7, 0, 0, 7); g.fill(); g.fillStyle = '#1b1410'; g.beginPath(); g.arc(cx + 4.4, hy - .3, 1.4, 0, 7); g.fill();
  g.strokeStyle = shade(hair, .9); g.lineWidth = 1.4; g.beginPath(); g.moveTo(cx + 1.2, hy - 4); g.lineTo(cx + 6, hy - 4.6); g.stroke();
  g.strokeStyle = shade(skin, .55); g.lineWidth = 1.1; g.beginPath(); g.moveTo(cx + 3.5, hy + 6); g.quadraticCurveTo(cx + 6, hy + 7, cx + 8, hy + 5.8); g.stroke();
  if (acc === 1) { g.fillStyle = hair; g.beginPath(); g.ellipse(cx + 5.4, hy + 4.2, 4.6, 1.7, .1, 0, 7); g.fill(); }
  if (acc === 2) { g.fillStyle = hair; g.beginPath(); g.moveTo(cx - 6, hy + 2); g.quadraticCurveTo(cx - 1, hy + 18, cx + 8, hy + 4); g.lineTo(cx + 8, hy + 6.5); g.quadraticCurveTo(cx + 2, hy + 11, cx - 5, hy + 5); g.fill(); }
  if (acc === 3) { g.strokeStyle = '#d9b25a'; g.lineWidth = 1.3; g.beginPath(); g.arc(cx + 3.7, hy - .4, 3.4, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx + .4, hy - .6); g.lineTo(cx - 8, hy - 1.6); g.stroke(); }
  // sombrero
  const band = '#a31c3d', dk = '#15131a';
  if (hatI === 1) { g.fillStyle = dk; g.beginPath(); g.ellipse(cx, hy - 8, 13.5, 3.4, 0, 0, 7); g.fill(); g.beginPath(); g.roundRect(cx - 8, hy - 26, 16, 19, 2); g.fill(); g.fillStyle = band; g.fillRect(cx - 8, hy - 12, 16, 3.6); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(cx - 6, hy - 25, 3, 15); }
  if (hatI === 2) { g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(cx, hy - 8, 12.5, 3.2, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx, hy - 11, 8.8, 8.2, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 8.8, hy - 11, 17.6, 3.2); g.fillStyle = band; g.fillRect(cx - 8.8, hy - 11.5, 17.6, 2.4); }
  if (hatI === 3) { g.fillStyle = '#6a5a44'; g.beginPath(); g.ellipse(cx + 1, hy - 8.4, 15, 3.8, -.05, 0, 7); g.fill(); g.beginPath(); g.roundRect(cx - 7.5, hy - 20, 15, 12.5, 5); g.fill(); g.fillStyle = '#2a211a'; g.fillRect(cx - 7.5, hy - 12, 15, 3.2); g.strokeStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.moveTo(cx - 3, hy - 19); g.lineTo(cx - 3, hy - 14); g.stroke(); }
  if (hatI === 4) { g.fillStyle = '#3a2a4a'; g.beginPath(); g.ellipse(cx - 1, hy - 8.4, 11, 4.4, -.15, 0, 7); g.fill(); g.beginPath(); g.arc(cx - 2, hy - 13, 2, 0, 7); g.fill(); g.fillRect(cx - 3, hy - 16, 2, 4); }
  g.restore();
}

/** Hoja de 8 fotogramas: el 0 es el reposo y 1–7 el ciclo de paso. Mira a la derecha (se voltea para la izquierda). */
export function avatarTexture(scene: Phaser.Scene, lookStr: string) {
  const key = `av_${lookStr}`; if (scene.textures.exists(key)) return key;
  const look = lookFromString(lookStr), c = document.createElement('canvas'); c.width = FW * FRAMES; c.height = FH; const g = c.getContext('2d')!;
  for (let f = 0; f < FRAMES; f++) drawMago(g, f * FW + FW / 2, FEET_Y, look, f === 0 ? 0 : ((f - 1) / (FRAMES - 1)) * Math.PI * 2);
  const tex = scene.textures.addCanvas(key, c)!; for (let f = 0; f < FRAMES; f++) tex.add(f, 0, f * FW, 0, FW, FH);
  return key;
}
