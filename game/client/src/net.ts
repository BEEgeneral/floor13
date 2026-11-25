import { Client, type Room } from '@colyseus/sdk';
import type { Profile, FloorId } from '@floor13/shared';

const HOST = (import.meta as any).env?.VITE_HOST ?? ((import.meta as any).env?.PROD ? location.host : `${location.hostname}:2567`);
const HTTP = `${location.protocol === 'https:' ? 'https' : 'http'}://${HOST}`, WS = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${HOST}`;
export interface Card { level: number; tier: string; rank: string; tec: number; pre: number; cre: number; ens: number }
export interface Session { token: string; profile: Profile; card: Card }
export interface FloorInfo { id: FloorId; number: number; name: string; sub: string; players: number; allowed: boolean; visible: boolean; reason?: string }

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(HTTP + '/api' + path, init); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as any).error ?? `Error ${r.status}`); return j as T;
}
const json = (body: unknown, token?: string): RequestInit => ({ method: 'POST', headers: { 'content-type': 'application/json', ...(token ? { 'authorization': 'Bearer ' + token } : {}) }, body: JSON.stringify(body) });

export const net = {
  login: (body: object) => call<Session>('/login', json(body)),
  me: (token: string) => call<Session>('/yo', { headers: { 'authorization': 'Bearer ' + token } }),
  floors: (token: string) => call<FloorInfo[]>('/plantas', { headers: { 'authorization': 'Bearer ' + token } }),
  look: (token: string, look: number[]) => call<Session>('/yo/aspecto', json({ look }, token)),
  patch: (token: string, body: object) => call<Session>('/prueba/perfil', json(body, token)),
  client: new Client(WS),
  async join(floor: FloorId, token: string): Promise<Room<any>> {
    try { return await net.client.joinOrCreate(floor, { token }); }
    catch (e: any) { throw new Error(e?.message?.replace(/^.*?:\s*/, '') || 'No se pudo entrar'); }
  },
};
