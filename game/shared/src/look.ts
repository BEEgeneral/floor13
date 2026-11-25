/** Aspecto del mago: siete números pequeños (chaqueta, sombrero, piel, color de pelo, peinado, complemento, capa). */
export const LOOK_SIZES = [8, 5, 5, 6, 6, 4, 2] as const;
export const LOOK_LABELS = ['Chaqueta', 'Sombrero', 'Piel', 'Color de pelo', 'Peinado', 'Complemento', 'Capa'] as const;
export type Look = number[];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Aspecto estable a partir de un texto (se usa cuando el mago aún no ha elegido). */
export function defaultLook(seed: string): Look {
  let h = hash(seed); return LOOK_SIZES.map(n => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return (h >>> 8) % n; });
}
/** Acepta un aspecto del exterior y devuelve uno válido: cada valor entero dentro de su rango. */
export function normalizeLook(x: unknown, seed = ''): Look {
  const base = defaultLook(seed);
  if (!Array.isArray(x)) return base;
  return LOOK_SIZES.map((n, i) => { const v = Number(x[i]); return Number.isInteger(v) && v >= 0 && v < n ? v : base[i]; });
}
export const lookToString = (l: Look) => l.join('');
export const lookFromString = (s: string): Look => normalizeLook([...String(s ?? '')].map(Number));
