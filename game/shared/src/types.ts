export type Role = 'visitante' | 'huesped' | 'tribunal' | 'anfitrion';
export type Stats = { tec: number; pre: number; cre: number; ens: number };
export type Specialty = 'naipe' | 'moneda' | 'ojo' | 'cubilete';
export type Key = 'llave_examen' | 'invitacion_charla';

export interface Profile {
  id: string;
  name: string;
  country: string;          // ES, MX, AR…
  specialty: Specialty;
  school: { name: string; letter: string };
  role: Role;
  stats: Stats | null;      // null = sin examinar
  keys: Key[];
  look?: number[];          // aspecto (ver look.ts)
  createdAt: number;
}
export interface PublicCard {
  name: string; country: string; specialty: Specialty; school: { name: string; letter: string };
  role: Role; level: number | null; tier: Tier; rank: string;
}
export type Tier = 'antesala' | 'bronce' | 'plata' | 'oro' | 'neon';
