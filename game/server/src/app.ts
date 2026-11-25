import config, { listen } from '@colyseus/tools';
import { defineRoom, matchMaker } from 'colyseus';
import express from 'express';
import { FLOORS, FLOOR_ORDER, accessFor, type FloorId, type Role, type Key, type Stats } from '@floor13/shared';
import { Store, HttpError } from './store.ts';
import { floorRoom, ctx, publicFields } from './FloorRoom.ts';

export interface AppOptions { port?: number; dataFile?: string | null; testMode?: boolean }

export async function start(opts: AppOptions = {}) {
  const store = new Store(opts.dataFile === undefined ? new URL('../data/profiles.json', import.meta.url).pathname : opts.dataFile);
  ctx.store = store; const testMode = opts.testMode ?? process.env.F13_TEST !== '0';
  const rooms: Record<string, any> = {};
  for (const id of FLOOR_ORDER) rooms[id] = defineRoom(floorRoom(id));

  const cfg = config({
    rooms,
    initializeExpress: (app: express.Application) => {
      app.use(express.json());
      app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); res.header('Access-Control-Allow-Headers', 'content-type, x-token'); res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); if (req.method === 'OPTIONS') return void res.sendStatus(204); next(); });
      const wrap = (fn: (req: express.Request, res: express.Response) => unknown) => async (req: express.Request, res: express.Response) => {
        try { res.json(await fn(req, res)); } catch (e) { const he = e as HttpError; res.status(he.status ?? 500).json({ error: he.message }); }
      };
      const me = (req: express.Request) => { const s = store.byTokenOrNull(String(req.header('x-token') ?? req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? req.body?.token ?? '')); if (!s) throw new HttpError(401, 'Entrada no válida'); return s; };
      const view = (s: { token: string; profile: any }) => ({ token: s.token, profile: s.profile, card: { ...publicFields(s.profile) } });

      app.get('/api/estado', (_q, res) => res.json({ ok: true, testMode }));
      app.post('/api/login', wrap(req => {
        const found = store.byTokenOrNull(req.body?.token); if (found) return view(found);
        return view(store.create(req.body ?? {}));
      }));
      app.post('/api/yo/aspecto', wrap(req => { const s = me(req); store.patch(s.profile.id, { look: req.body?.look }); return view(store.byId(s.profile.id)!); }));
      app.get('/api/yo', wrap(req => view(me(req))));
      app.get('/api/plantas', wrap(async req => {
        const s = me(req); const counts = new Map<string, number>();
        for (const r of await matchMaker.query({})) counts.set(r.name, (counts.get(r.name) ?? 0) + r.clients);
        return FLOOR_ORDER.map(id => { const f = FLOORS[id], a = accessFor(s.profile, id); return { id, number: f.number, name: f.name, sub: f.sub, players: counts.get(id) ?? 0, ...a }; }).filter(f => f.visible);
      }));
      // Modo prueba: cada jugador puede darse rol, notas y llaves. Fuera del modo prueba solo un anfitrión puede cambiar a otro.
      app.post('/api/prueba/perfil', wrap(req => {
        const s = me(req); const b = req.body ?? {}; const targetId = b.profileId ?? s.profile.id;
        const self = targetId === s.profile.id;
        if (!(s.profile.role === 'anfitrion' || (testMode && self))) throw new HttpError(403, 'No tienes permiso para cambiar este perfil');
        const patch: { role?: Role; stats?: Stats | null; keys?: Key[] } = {};
        if (b.role) { if (!['visitante', 'huesped', 'tribunal', 'anfitrion'].includes(b.role)) throw new HttpError(400, 'Rol no válido'); patch.role = b.role; }
        if (b.stats !== undefined) { if (b.stats !== null) for (const k of ['tec', 'pre', 'cre', 'ens']) if (!(b.stats[k] >= 0 && b.stats[k] <= 100)) throw new HttpError(400, 'Las notas van de 0 a 100'); patch.stats = b.stats; }
        if (b.keys) patch.keys = (b.keys as string[]).filter(k => ['llave_examen', 'invitacion_charla'].includes(k)) as Key[];
        store.patch(targetId, patch); return view(store.byId(targetId)!);
      }));
    },
  });
  return listen(cfg, opts.port ?? Number(process.env.PORT ?? 2567));
}
