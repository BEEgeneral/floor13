import Phaser from 'phaser';
import { bakeStatic, W, H } from './draw.ts';
import { ART } from './rooms.ts';

const M = 200;   // margen del lienzo temporal: las piezas altas se salen del recuadro
/** Dibuja cada pieza en un lienzo temporal, recorta su caja visible y la guarda como textura. */
export function bakeRoom(scene: Phaser.Scene, id: string) {
  const art: any = (ART as any)[id];
  if (!scene.textures.exists(`bg_${id}`)) scene.textures.addCanvas(`bg_${id}`, bakeStatic(art));
  const items: { key: string; x: number; y: number; depth: number }[] = [];
  const tmp = document.createElement('canvas'); tmp.width = W + 2 * M; tmp.height = H + 2 * M; const g = tmp.getContext('2d', { willReadFrequently: true })!;
  art.props(0).forEach((p: any, i: number) => {
    const key = `p_${id}_${i}`;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, tmp.width, tmp.height); g.translate(M, M); g.save(); p.f(g); g.restore();
    const d = g.getImageData(0, 0, tmp.width, tmp.height), px = new Uint32Array(d.data.buffer);
    let x0 = tmp.width, y0 = tmp.height, x1 = -1, y1 = -1;
    for (let y = 0; y < tmp.height; y++) { const row = y * tmp.width; for (let x = 0; x < tmp.width; x++) if (px[row + x] >>> 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    if (x1 < 0) return;
    if (!scene.textures.exists(key)) { const c = document.createElement('canvas'); c.width = x1 - x0 + 1; c.height = y1 - y0 + 1; c.getContext('2d')!.drawImage(tmp, x0, y0, c.width, c.height, 0, 0, c.width, c.height); scene.textures.addCanvas(key, c); }
    items.push({ key, x: x0 - M, y: y0 - M, depth: p.top ? 3000 : p.y });
  });
  return { art, items };
}
