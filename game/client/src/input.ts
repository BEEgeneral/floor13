/** Controles como acciones con nombre: teclado y mando. */
export type Actions = { x: number; y: number; act: boolean; back: boolean; clap: boolean; hand: boolean; chat: boolean; card: boolean; panel: boolean; up: boolean; down: boolean };
const keys: Record<string, boolean> = {}; const edge: Record<string, boolean> = {};
const typing = () => { const a = document.activeElement as HTMLElement | null; return !!a && ['INPUT', 'SELECT', 'TEXTAREA'].includes(a.tagName); };
addEventListener('keydown', e => {
  if (typing()) return;
  if (!keys[e.code]) edge[e.code] = true; keys[e.code] = true;
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
let prevPad: boolean[] = []; let stickLatched = false; export let usingPad = false;
const took = (code: string) => { const v = !!edge[code]; edge[code] = false; return v; };

export function poll(): Actions {
  let x = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), y = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  const a: Actions = { x: 0, y: 0, act: took('KeyE') || took('Enter'), back: took('Escape'), clap: took('Digit1'), hand: took('Digit2'), chat: took('KeyT'), card: took('KeyC'), panel: took('KeyP'), up: took('ArrowUp'), down: took('ArrowDown') };
  const pads = (navigator.getGamepads ? navigator.getGamepads() : []) as (Gamepad | null)[];
  const now: boolean[] = []; let sy = 0;
  for (const p of pads) {
    if (!p) continue;
    const ax = p.axes[0] ?? 0, ay = p.axes[1] ?? 0, m = Math.hypot(ax, ay);
    if (m > 0.2) { const k = (m - 0.2) / 0.8 / m; x += ax * k; y += ay * k; usingPad = true; }          // zona muerta radial
    if (Math.abs(ay) > Math.abs(sy)) sy = ay;
    if (p.buttons[14]?.pressed) x -= 1;
    if (p.buttons[15]?.pressed) x += 1;
    if (p.buttons[12]?.pressed) y -= 1;
    if (p.buttons[13]?.pressed) y += 1;
    p.buttons.forEach((b, i) => { now[i] = now[i] || b.pressed; });
  }
  const pressed = (i: number) => !!now[i] && !prevPad[i];
  if (pressed(0)) { a.act = true; usingPad = true; }
  if (pressed(1)) a.back = true;
  if (pressed(2)) a.clap = true;
  if (pressed(3)) a.hand = true;
  if (pressed(8)) a.card = true;
  if (pressed(9)) a.panel = true;
  if (pressed(12)) a.up = true;
  if (pressed(13)) a.down = true;
  // el stick vertical también navega por menús, una vez por empujón
  if (Math.abs(sy) > 0.6 && !stickLatched) { stickLatched = true; if (sy < 0) a.up = true; else a.down = true; } else if (Math.abs(sy) < 0.3) stickLatched = false;
  prevPad = now;
  const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
  a.x = x; a.y = y; return a;
}
