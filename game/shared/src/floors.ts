import type { Profile, Key } from './types.ts';
import { W, H, WALL, type Rect } from './world.ts';

export type FloorId = 'vestibulo' | 'cafe' | 'salon' | 'salamesa' | 'planta13';
export interface FloorDef {
  id: FloorId; number: number; name: string; sub: string;
  spawn: [number, number]; lift: [number, number]; colliders: Rect[];
}
const R = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });
const frame = (): Rect[] => [R(0, 0, W, WALL + 8), R(0, 0, 10, H), R(W - 10, 0, 10, H), R(0, H - 8, W, 8)];

export const FLOORS: Record<FloorId, FloorDef> = {
  vestibulo: { id: 'vestibulo', number: 0, name: 'Vestíbulo', sub: 'Recepción, tablón de eventos y ascensor', spawn: [480, 540], lift: [480, 226],
    colliders: [...frame(), R(84, 262, 230, 60), R(48, 560, 50, 30), R(862, 560, 50, 30), R(600, 300, 300, 40), R(318, WALL, 32, 30), R(610, WALL, 32, 30)] },
  cafe: { id: 'cafe', number: 0, name: 'Café del Naipe', sub: 'Charla libre, mesas de 4 a 6 y rincón de novatos', spawn: [480, 560], lift: [480, 226],
    colliders: [...frame(), R(60, 236, 380, 54), R(150, 340, 130, 80), R(400, 400, 130, 80), R(650, 360, 130, 80), R(110, 500, 130, 70), R(660, 520, 130, 70), R(380, 270, 24, 24), R(820, 300, 90, 40)] },
  salon: { id: 'salon', number: 1, name: 'Gran Salón', sub: 'Charlas abiertas y biblioteca de recursos', spawn: [480, 570], lift: [868, 226],
    colliders: [...frame(), R(170, WALL, 620, 130), R(30, 250, 46, 340), R(200, 400, 250, 170), R(510, 400, 250, 170)] },
  salamesa: { id: 'salamesa', number: 4, name: 'Sala de mesa', sub: 'Sala privada con mesa y cámara cenital', spawn: [480, 520], lift: [480, 226],
    colliders: [...frame(), R(0, 0, 150, H), R(W - 150, 0, 150, H), R(390, 330, 180, 90), R(150, H - 70, 660, 70)] },
  planta13: { id: 'planta13', number: 13, name: 'Planta 13', sub: 'Sala de exámenes y conferencias', spawn: [480, 540], lift: [480, 226],
    colliders: [...frame(), R(318, WALL, 32, 30), R(610, WALL, 32, 30), R(374, 382, 212, 86), R(78, 296, 134, 36), R(740, 300, 176, 36), R(740, 350, 176, 6)] },
};
export const FLOOR_ORDER: FloorId[] = ['vestibulo', 'cafe', 'salon', 'salamesa', 'planta13'];

export interface Access { allowed: boolean; visible: boolean; reason?: string }
const has = (p: Pick<Profile, 'keys'>, k: Key) => p.keys.includes(k);

export function accessFor(p: Pick<Profile, 'role' | 'keys'>, id: FloorId): Access {
  switch (id) {
    case 'vestibulo': case 'cafe': case 'salon': return { allowed: true, visible: true };
    case 'salamesa':
      return p.role === 'visitante' ? { allowed: false, visible: true, reason: 'Requiere el rol de huésped' } : { allowed: true, visible: true };
    case 'planta13': {
      const ok = p.role === 'tribunal' || p.role === 'anfitrion' || has(p, 'llave_examen') || has(p, 'invitacion_charla');
      return ok ? { allowed: true, visible: true } : { allowed: false, visible: false, reason: 'Necesitas una llave de examen o una invitación' };
    }
  }
}
