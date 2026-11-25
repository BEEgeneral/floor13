import { Room, ServerError, type Client } from 'colyseus';
import { FLOORS, accessFor, levelFromStats, tierFromLevel, rankName, collides, dist, HEAR_RADIUS, SPEED, type FloorId, type Profile } from '@floor13/shared';
import { FloorState, PlayerState } from './state.ts';
import type { Store } from './store.ts';

export const GESTURES = ['aplauso', 'mano'] as const;
export const ctx = { store: null as unknown as Store };   // se rellena al arrancar

export function publicFields(p: Profile) {
  const level = p.stats ? levelFromStats(p.stats) : 0;
  const st = p.stats ?? { tec: -1, pre: -1, cre: -1, ens: -1 };
  return { ...st, level: p.stats ? level : -1, tier: p.stats ? tierFromLevel(level) : 'antesala', rank: p.stats ? rankName(level) : 'Sin examinar' };
}

type Meta = { profileId: string; lastT: number };

export function floorRoom(floorId: FloorId) {
  const floor = FLOORS[floorId];
  return class FloorRoom extends Room<{ state: FloorState }> {
    maxClients = 100;
    private meta = new Map<string, Meta>();

    onCreate() {
      this.setState(new FloorState());
      this.onMessage('pos', (client, m: { x: number; y: number; face?: number; moving?: boolean }) => this.onPos(client, m));
      this.onMessage('chat', (client, m: { text: string }) => this.onChat(client, m));
      this.onMessage('gesto', (client, m: { kind: string }) => this.onGesture(client, m));
    }

    onAuth(_client: Client, options: { token?: string }) {
      const s = ctx.store.byTokenOrNull(options?.token);
      if (!s) throw new ServerError(401, 'Entrada no válida: vuelve a identificarte');
      const a = accessFor(s.profile, floorId);
      if (!a.allowed) throw new ServerError(403, a.reason ?? 'Acceso denegado');
      // un mismo mago no puede estar dos veces en la planta
      for (const m of this.meta.values()) if (m.profileId === s.profile.id) throw new ServerError(409, 'Ya estás en esta planta desde otra pestaña');
      return { profileId: s.profile.id };
    }

    onJoin(client: Client, _options: unknown, auth: { profileId: string }) {
      const p = ctx.store.byId(auth.profileId)!.profile;
      const ps = new PlayerState();
      Object.assign(ps, { pid: p.id, name: p.name, country: p.country, specialty: p.specialty, schoolLetter: p.school.letter, role: p.role, ...publicFields(p) });
      ps.x = floor.spawn[0]; ps.y = floor.spawn[1]; ps.face = 1; ps.moving = false; ps.gesture = '';
      this.state.players.set(client.sessionId, ps);
      this.meta.set(client.sessionId, { profileId: p.id, lastT: Date.now() });
    }

    onLeave(client: Client) { this.state.players.delete(client.sessionId); this.meta.delete(client.sessionId); }

    /** Validación en el servidor: velocidad máxima y colisiones. Si falla, se devuelve al jugador a su última posición válida. */
    private onPos(client: Client, m: { x: number; y: number; face?: number; moving?: boolean }) {
      const ps = this.state.players.get(client.sessionId); const meta = this.meta.get(client.sessionId); if (!ps || !meta) return;
      const now = Date.now(), dt = Math.min(1, (now - meta.lastT) / 1000);   // tiempo desde la última posición aceptada
      const x = Number(m.x), y = Number(m.y);
      const maxMove = SPEED * Math.max(dt, 0.1) * 1.6 + 6;
      if (!Number.isFinite(x) || !Number.isFinite(y) || dist({ x, y }, ps) > maxMove || collides(x, y, floor.colliders)) { client.send('corregir', { x: ps.x, y: ps.y }); return; }
      meta.lastT = now; ps.x = x; ps.y = y; ps.face = m.face === -1 ? -1 : 1; ps.moving = !!m.moving;
    }

    private onChat(client: Client, m: { text: string }) {
      const ps = this.state.players.get(client.sessionId); const text = String(m?.text ?? '').trim().slice(0, 200); if (!ps || !text) return;
      for (const c of this.clients) { const o = this.state.players.get(c.sessionId); if (o && dist(o, ps) <= HEAR_RADIUS) c.send('chat', { from: ps.name, text, sid: client.sessionId }); }
    }

    private onGesture(client: Client, m: { kind: string }) {
      const ps = this.state.players.get(client.sessionId); if (!ps || !(GESTURES as readonly string[]).includes(m?.kind)) return;
      ps.gesture = m.kind; this.clock.setTimeout(() => { if (ps.gesture === m.kind) ps.gesture = ''; }, 3500);
    }
  };
}
