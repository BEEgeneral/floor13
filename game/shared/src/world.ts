/** Mundo: tamaño de baldosa, colisiones y movimiento. Se usa igual en cliente y servidor. */
export const T = 48, W = 960, H = 624, WALL = 192;
export const SPEED = 150;                 // px/s
export const HEAR_RADIUS = 6 * T;         // distancia del chat de proximidad
export type Rect = { x: number; y: number; w: number; h: number };
export const FEET = { w: 22, h: 12, dy: -10 };

export function feetBox(x: number, y: number): Rect { return { x: x - FEET.w / 2, y: y + FEET.dy, w: FEET.w, h: FEET.h }; }
export function collides(x: number, y: number, rects: Rect[]): boolean {
  const b = feetBox(x, y);
  return rects.some(r => b.x < r.x + r.w && b.x + b.w > r.x && b.y < r.y + r.h && b.y + b.h > r.y);
}
/** Mueve con deslizamiento por ejes: si un eje choca, solo se anula ese eje. */
export function step(x: number, y: number, dx: number, dy: number, rects: Rect[]): { x: number; y: number } {
  let nx = x, ny = y;
  if (dx && !collides(x + dx, y, rects)) nx = x + dx;
  if (dy && !collides(nx, y + dy, rects)) ny = y + dy;
  return { x: nx, y: ny };
}
export const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
