import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { normalizeLook, type Profile, type Specialty, type Role, type Key, type Stats } from '@floor13/shared';

export interface Stored { token: string; profile: Profile }
const SPECIALTIES: Specialty[] = ['naipe', 'moneda', 'ojo', 'cubilete'];

/** Perfiles de prueba en un archivo JSON. No es una base de datos de producción. */
export class Store {
  private byToken = new Map<string, Stored>();
  constructor(private file: string | null) {
    if (file && existsSync(file)) for (const s of JSON.parse(readFileSync(file, 'utf8')) as Stored[]) this.byToken.set(s.token, s);
  }
  private save() { if (!this.file) return; mkdirSync(dirname(this.file), { recursive: true }); writeFileSync(this.file, JSON.stringify([...this.byToken.values()], null, 2)); }
  byTokenOrNull(token?: string) { return token ? this.byToken.get(token) ?? null : null; }
  nameTaken(name: string) { const n = name.trim().toLowerCase(); return [...this.byToken.values()].some(s => s.profile.name.toLowerCase() === n); }
  all() { return [...this.byToken.values()].map(s => s.profile); }
  byId(id: string) { return [...this.byToken.values()].find(s => s.profile.id === id) ?? null; }

  create(input: { name: string; country?: string; specialty?: string; schoolName?: string; look?: unknown }): Stored {
    const name = String(input.name ?? '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 24) throw new HttpError(400, 'El nombre debe tener entre 2 y 24 caracteres');
    if (this.nameTaken(name)) throw new HttpError(409, 'Ese nombre ya lo usa otro mago');
    const specialty = (SPECIALTIES as string[]).includes(input.specialty ?? '') ? input.specialty as Specialty : 'naipe';
    const schoolName = String(input.schoolName ?? '').trim().slice(0, 30) || 'Sin escuela';
    const profile: Profile = {
      id: randomBytes(6).toString('hex'), name, country: String(input.country ?? 'ES').toUpperCase().slice(0, 2), specialty,
      school: { name: schoolName, letter: schoolName === 'Sin escuela' ? '?' : schoolName[0].toUpperCase() },
      role: 'visitante', stats: null, keys: [], look: [], createdAt: Date.now(),
    };
    profile.look = normalizeLook(input.look, profile.id);
    const s = { token: randomBytes(24).toString('hex'), profile }; this.byToken.set(s.token, s); this.save(); return s;
  }
  /** Cambia rol, notas o llaves. La comprobación de permisos la hace quien llama. */
  patch(profileId: string, p: { role?: Role; stats?: Stats | null; keys?: Key[]; look?: unknown }) {
    const s = this.byId(profileId); if (!s) throw new HttpError(404, 'Perfil no encontrado');
    if (p.role) s.profile.role = p.role;
    if (p.stats !== undefined) s.profile.stats = p.stats;
    if (p.keys) s.profile.keys = p.keys;
    if (p.look !== undefined) s.profile.look = normalizeLook(p.look, s.profile.id);
    this.save(); return s.profile;
  }
}
export class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }
