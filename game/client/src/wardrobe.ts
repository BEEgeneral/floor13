import { LOOK_SIZES, LOOK_LABELS, normalizeLook, type Look } from '@floor13/shared';
import { drawMago, JACKETS, SKINS, HAIRS, NAMES } from './art/avatar.ts';

const NAME_OF: (string[] | null)[] = [null, NAMES.hat, null, null, NAMES.hairStyle, NAMES.acc, NAMES.cape];
const SWATCH: (string[] | null)[] = [JACKETS, null, SKINS, HAIRS, null, null, null];

/** Selector de aspecto: vista previa grande y una fila ◀ ▶ por cada elemento. */
export function mountWardrobe(el: HTMLElement, initial: Look, onChange?: (l: Look) => void) {
  let look = normalizeLook(initial, 'x');
  el.innerHTML = `<div class="wprev"><canvas width="216" height="312"></canvas><div class="wrows"></div></div><button type="button" class="ghost wrand">🎲 Al azar</button>`;
  const cv = el.querySelector('canvas')!, g = cv.getContext('2d')!, rows = el.querySelector('.wrows') as HTMLElement;
  let t0 = performance.now(), raf = 0;
  const draw = (now: number) => {
    g.clearRect(0, 0, cv.width, cv.height); g.save(); g.scale(3, 3); const w = Math.sin((now - t0) / 140) * 0.0;
    const bg = g.createRadialGradient(36, 60, 4, 36, 70, 70); bg.addColorStop(0, 'rgba(111,240,255,.18)'); bg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = bg; g.fillRect(0, 0, 72, 104);
    drawMago(g, 36, 94, look, w); g.restore(); raf = requestAnimationFrame(draw);
  };
  const build = () => {
    rows.innerHTML = '';
    LOOK_LABELS.forEach((label, i) => {
      const r = document.createElement('div'); r.className = 'wrow';
      const val = NAME_OF[i] ? NAME_OF[i]![look[i]] : `${look[i] + 1} / ${LOOK_SIZES[i]}`;
      r.innerHTML = `<span class="wl">${label}</span><button type="button" aria-label="Anterior ${label}">◀</button><span class="wv"></span><button type="button" aria-label="Siguiente ${label}">▶</button>`;
      const wv = r.querySelector('.wv') as HTMLElement; wv.textContent = val;
      if (SWATCH[i]) { const sw = document.createElement('i'); sw.className = 'sw'; sw.style.background = SWATCH[i]![look[i]]; wv.prepend(sw); }
      const bs = r.querySelectorAll('button'), prev = bs[0], next = bs[1];
      const move = (d: number) => { look[i] = (look[i] + d + LOOK_SIZES[i]) % LOOK_SIZES[i]; build(); onChange?.([...look]); };
      prev.onclick = () => move(-1); next.onclick = () => move(1); rows.append(r);
    });
  };
  (el.querySelector('.wrand') as HTMLElement).onclick = () => { look = LOOK_SIZES.map(n => Math.floor(Math.random() * n)); build(); onChange?.([...look]); };
  build(); raf = requestAnimationFrame(draw);
  return { get: () => [...look], set: (l: Look) => { look = normalizeLook(l, 'x'); build(); }, stop: () => cancelAnimationFrame(raf), start: () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
}
