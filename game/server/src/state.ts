import { schema, t, type SchemaType } from '@colyseus/schema';

export const PlayerState = schema({
  pid: t.string(), name: t.string(), country: t.string(), specialty: t.string(), schoolLetter: t.string(),
  role: t.string(), look: t.string(), level: t.int16(), tier: t.string(), rank: t.string(),
  tec: t.int16(), pre: t.int16(), cre: t.int16(), ens: t.int16(),
  x: t.float32(), y: t.float32(), face: t.int8(), moving: t.boolean(), gesture: t.string(),
}, 'PlayerState');
export type PlayerState = SchemaType<typeof PlayerState>;

export const FloorState = schema({ players: t.map(PlayerState) }, 'FloorState');
export type FloorState = SchemaType<typeof FloorState>;
