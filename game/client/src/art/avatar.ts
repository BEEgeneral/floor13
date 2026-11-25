import Phaser from 'phaser';
import { drawPerson } from './draw.ts';

const JACKETS = ['#7a1d33', '#1d5a6b', '#2a2f4a', '#3a2438', '#23403f', '#4a3320', '#5a2a2a', '#2c3e5a'];
const SKINS = ['#e2b48e', '#c28d68', '#f0c9a6', '#9a6a48', '#e8bf9a'], HAIRS = ['#2a1d16', '#111', '#5a3a22', '#8a8a8a', '#3a2a1a'];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export const FW = 64, FH = 96, FEET_Y = 82, FRAMES = 6;

/** Aspecto estable por jugador: color de chaqueta, sombrero, piel y pelo salen de su id. */
export function lookFor(pid: string, mine = false) {
  const h = hash(pid);
  return { jacket: mine ? '#1d5a6b' : JACKETS[h % JACKETS.length], hat: (h >> 3) % 4 !== 0, skin: SKINS[(h >> 5) % SKINS.length], hair: HAIRS[(h >> 7) % HAIRS.length] };
}
/** Hoja de 6 fotogramas de caminar; mira a la derecha (se voltea para la izquierda). */
export function avatarTexture(scene: Phaser.Scene, pid: string, mine: boolean) {
  const key = `av_${pid}_${mine ? 1 : 0}`; if (scene.textures.exists(key)) return key;
  const L = lookFor(pid, mine), c = document.createElement('canvas'); c.width = FW * FRAMES; c.height = FH; const g = c.getContext('2d')!;
  for (let f = 0; f < FRAMES; f++) { g.save(); drawPerson(g, f * FW + FW / 2, FEET_Y, { ...L, face: 1, walk: f === 0 ? 0 : (f / FRAMES) * Math.PI * 2 }); g.restore(); }
  const tex = scene.textures.addCanvas(key, c)!; for (let f = 0; f < FRAMES; f++) tex.add(f, 0, f * FW, 0, FW, FH);
  return key;
}
