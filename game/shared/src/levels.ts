import type { Stats, Tier } from './types.ts';

/** Pesos acordados: Técnica 30, Presentación 30, Creatividad 25, Enseñanza 15. */
export const WEIGHTS: Record<keyof Stats, number> = { tec: 0.30, pre: 0.30, cre: 0.25, ens: 0.15 };

export function levelFromStats(s: Stats): number {
  return Math.round((Object.keys(WEIGHTS) as (keyof Stats)[]).reduce((a, k) => a + WEIGHTS[k] * s[k], 0));
}
export function tierFromLevel(n: number): Tier {
  return n >= 90 ? 'neon' : n >= 75 ? 'oro' : n >= 60 ? 'plata' : n >= 40 ? 'bronce' : 'antesala';
}
const RANGOS: [number, number, string][] = [
  [0, 9, 'Curioso'], [10, 19, 'Aprendiz'], [20, 29, 'Manos Ligeras'], [30, 39, 'Aficionado de Salón'],
  [40, 49, 'Mago de Mesa'], [50, 59, 'Artífice'], [60, 66, 'Prestidigitador'], [67, 74, 'Ilusionista'],
  [75, 82, 'Maestro de Mesa'], [83, 89, 'Gran Ilusionista'], [90, 94, 'Archimago'], [95, 99, 'Gran Maestro'], [100, 100, 'Leyenda de la Planta 13'],
];
const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
export function rankName(n: number): string {
  const r = RANGOS.find(([a, b]) => n >= a && n <= b);
  if (!r) throw new RangeError(`nivel fuera de 0–100: ${n}`);
  return r[0] === r[1] ? r[2] : `${r[2]} ${ROM[n - r[0]]}`;
}
/** Horas de práctica acumuladas para llegar al nivel n (curva cúbica de docs/diseno/niveles.md). */
export const hoursToReach = (n: number) => 0.0025 * n ** 3;
