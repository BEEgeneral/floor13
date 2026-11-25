import Phaser from 'phaser';
import { FLOORS, step, dist, SPEED, W, H, type FloorId } from '@floor13/shared';
import { bakeRoom } from './art/bake.ts';
import { bolt } from './art/draw.ts';
import { avatarTexture, FW, FH, FEET_Y, FRAMES } from './art/avatar.ts';
import { poll } from './input.ts';
import { ui, type CardData } from './ui.ts';
import { net, type Session } from './net.ts';

export interface SceneData { room: any; floorId: FloorId; session: Session; onPick: (id: FloorId) => void }
type Av = { sprite: Phaser.GameObjects.Sprite; name: Phaser.GameObjects.Text; bubble: Phaser.GameObjects.Text; icon: Phaser.GameObjects.Text; tx: number; ty: number; bubbleUntil: number };

const baked = new Map<string, ReturnType<typeof bakeRoom>>();
const layers = new Map<string, HTMLCanvasElement>();
const layer = (scene: Phaser.Scene, key: string) => {
  let c = layers.get(key);
  if (!c || !scene.textures.exists(key)) { c = document.createElement('canvas'); c.width = W; c.height = H; layers.set(key, c); if (scene.textures.exists(key)) scene.textures.remove(key); scene.textures.addCanvas(key, c); }
  return c;
};
const LABEL = { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#fff3c4', backgroundColor: 'rgba(10,8,12,.72)', padding: { x: 5, y: 2 } };

export class FloorScene extends Phaser.Scene {
  d!: SceneData; art: any; avs = new Map<string, Av>();
  me = { x: 0, y: 0, face: 1, moving: false }; sendT = 0; lastReal = 0; hudT = 0; lightT = 0; ended = false;
  constructor() { super('floor'); }
  init(d: SceneData) { this.d = d; this.avs = new Map(); this.ended = false; }

  create() {
    const { room, floorId } = this.d, def = FLOORS[floorId];
    if (!baked.has(floorId)) baked.set(floorId, bakeRoom(this, floorId));
    const { art, items } = baked.get(floorId)!; this.art = art;
    this.add.image(0, 0, `bg_${floorId}`).setOrigin(0).setDepth(-10);
    for (const it of items) this.add.image(it.x, it.y, it.key).setOrigin(0).setDepth(it.depth);

    // luz y rayos: tres lienzos que se redibujan ~30 veces por segundo
    layer(this, 'dark'); layer(this, 'glow'); layer(this, 'arcs');
    this.add.image(0, 0, 'dark').setOrigin(0).setDepth(5000);
    this.add.image(0, 0, 'glow').setOrigin(0).setDepth(5001).setBlendMode(Phaser.BlendModes.ADD);
    this.add.image(0, 0, 'arcs').setOrigin(0).setDepth(5002).setBlendMode(Phaser.BlendModes.ADD);
    this.drawLight(0);

    this.me.x = def.spawn[0]; this.me.y = def.spawn[1];
    room.onMessage('corregir', (m: { x: number; y: number }) => { this.me.x = m.x; this.me.y = m.y; });
    room.onMessage('chat', (m: { from: string; text: string; sid: string }) => {
      ui.chat(m.from, m.text); const a = this.avs.get(m.sid);
      if (a) { a.bubble.setText(m.text).setVisible(true); a.bubbleUntil = this.time.now + 5000; }
    });
    this.cameras.main.fadeIn(350, 5, 4, 7);
    this.events.once('shutdown', () => { this.ended = true; room.removeAllListeners?.(); });
    this.hudRefresh(true);
  }

  drawLight(t: number) {
    const dark = layers.get('dark')!.getContext('2d')!, glow = layers.get('glow')!.getContext('2d')!, arc = layers.get('arcs')!.getContext('2d')!;
    const lights = this.art.lights(t) as { x: number; y: number; r: number; a: number; c: string }[];
    dark.globalCompositeOperation = 'source-over'; dark.clearRect(0, 0, W, H);
    dark.fillStyle = 'rgba(7,5,12,.62)'; dark.fillRect(0, 0, W, H);
    const v = dark.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * .95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); dark.fillStyle = v; dark.fillRect(0, 0, W, H);
    dark.globalCompositeOperation = 'destination-out';
    glow.clearRect(0, 0, W, H);
    for (const l of lights) {
      const g = dark.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); g.addColorStop(0, `rgba(0,0,0,${Math.min(1, l.a)})`); g.addColorStop(1, 'rgba(0,0,0,0)'); dark.fillStyle = g; dark.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      const h = glow.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * .8); h.addColorStop(0, `rgba(${l.c},${(l.a * .22).toFixed(3)})`); h.addColorStop(1, `rgba(${l.c},0)`); glow.fillStyle = h; glow.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
    }
    arc.clearRect(0, 0, W, H);
    for (const a of (this.art.arcs ?? []) as { from: number[]; to: number[] }[]) {
      if (Math.sin(t * 7 + a.from[0]) < -0.1) continue;                  // los rayos parpadean
      bolt(arc, a.from[0], a.from[1], a.to[0], a.to[1], Math.floor(t * 14) + a.from[0], 2);
    }
    for (const k of ['dark', 'glow', 'arcs']) (this.textures.get(k) as Phaser.Textures.CanvasTexture).refresh();
  }

  avatar(sid: string, p: any): Av {
    let a = this.avs.get(sid); if (a) return a;
    const mine = sid === this.d.room.sessionId, key = avatarTexture(this, p.pid, mine);
    const sprite = this.add.sprite(p.x, p.y, key, 0).setOrigin(.5, FEET_Y / FH);
    sprite.setInteractive({ useHandCursor: true });
    sprite.on('pointerdown', () => { const s = this.d.room.state?.players?.get(sid); if (s) ui.card.show(cardOf(s)); });
    const name = this.add.text(p.x, p.y, mine ? `${p.name} (tú)` : p.name, LABEL).setOrigin(.5, 1).setResolution(2).setDepth(4000);
    const bubble = this.add.text(p.x, p.y, '', { ...LABEL, color: '#1a1208', backgroundColor: '#fff3c4', wordWrap: { width: 190 } }).setOrigin(.5, 1).setResolution(2).setDepth(4001).setVisible(false);
    const icon = this.add.text(p.x, p.y, '', { fontSize: '26px' }).setOrigin(.5, 1).setResolution(2).setDepth(4001);
    a = { sprite, name, bubble, icon, tx: p.x, ty: p.y, bubbleUntil: 0 }; this.avs.set(sid, a); return a;
  }

  hudRefresh(force = false) {
    const { room, floorId } = this.d, p = room.state?.players?.get(room.sessionId); if (!p) return;
    ui.hud(FLOORS[floorId].name, FLOORS[floorId].number, room.state.players.size, { name: p.name, rank: p.rank, level: p.level, role: p.role });
    if (force) ui.prompt(null);
  }

  update(time: number, dtms: number) {
    if (this.ended || !this.d.room.state?.players) return;
    const real = performance.now(), dt = Math.min(real - (this.lastReal || real), 100) / 1000; this.lastReal = real;   // Phaser suaviza delta; medimos el tiempo real
    const { room, floorId } = this.d, def = FLOORS[floorId], act = poll();
    const modal = ui.elevator.isOpen() || ui.card.isOpen() || ui.chatOpen();

    // menús y acciones
    if (ui.elevator.isOpen()) { if (act.up) ui.elevator.move(-1); if (act.down) ui.elevator.move(1); if (act.act) ui.elevator.confirm(); if (act.back) ui.elevator.close(); }
    else if (ui.card.isOpen()) { if (act.back || act.act) ui.card.hide(); }
    else if (ui.test.isOpen() && act.back) ui.test.hide();
    else if (!ui.chatOpen()) {
      const near = dist(this.me, { x: def.lift[0], y: def.lift[1] }) < 80;
      if (act.act && near) this.openElevator();
      if (act.chat) ui.openChat();
      if (act.clap) room.send('gesto', { kind: 'aplauso' });
      if (act.hand) room.send('gesto', { kind: 'mano' });
      if (act.card) { const s = room.state.players.get(room.sessionId); if (s) ui.card.show(cardOf(s)); }
      if (act.panel) ui.test.toggle();
    }

    // movimiento local con la misma regla que el servidor
    const mx = modal ? 0 : act.x, my = modal ? 0 : act.y, moving = mx !== 0 || my !== 0;
    if (moving) {
      const r = step(this.me.x, this.me.y, mx * SPEED * dt, my * SPEED * dt, def.colliders); this.me.x = r.x; this.me.y = r.y;
      if (mx) this.me.face = mx > 0 ? 1 : -1;
    }
    if (time - this.sendT > 66 && (moving || this.me.moving)) { this.sendT = time; room.send('pos', { x: this.me.x, y: this.me.y, face: this.me.face, moving }); }
    this.me.moving = moving;
    ui.prompt(!modal && dist(this.me, { x: def.lift[0], y: def.lift[1] }) < 80 ? 'E · Ascensor' : null);

    // jugadores (estado del servidor; el propio va por predicción)
    const seen = new Set<string>();
    room.state.players.forEach((p: any, sid: string) => {
      seen.add(sid); const a = this.avatar(sid, p), mine = sid === room.sessionId;
      let x: number, y: number, face: number, mv: boolean;
      if (mine) { x = this.me.x; y = this.me.y; face = this.me.face; mv = this.me.moving; }
      else { a.tx = p.x; a.ty = p.y; x = Phaser.Math.Linear(a.sprite.x, a.tx, Math.min(1, dt * 12)); y = Phaser.Math.Linear(a.sprite.y, a.ty, Math.min(1, dt * 12)); face = p.face; mv = p.moving || Math.hypot(a.tx - x, a.ty - y) > 1.5; }
      a.sprite.setPosition(x, y).setDepth(y).setFlipX(face < 0).setFrame(mv ? 1 + (Math.floor(time / 90) % (FRAMES - 1)) : 0);
      a.name.setPosition(x, y - FH + FEET_Y - 4);
      const top = y - FH + FEET_Y - 22;
      a.icon.setPosition(x, top).setText(p.gesture === 'aplauso' ? '👏' : p.gesture === 'mano' ? '✋' : '');
      if (a.bubbleUntil < time) a.bubble.setVisible(false); else a.bubble.setPosition(x, top - (p.gesture ? 26 : 0));
    });
    for (const [sid, a] of this.avs) if (!seen.has(sid)) { a.sprite.destroy(); a.name.destroy(); a.bubble.destroy(); a.icon.destroy(); this.avs.delete(sid); }

    if (time - this.lightT > 33) { this.lightT = time; this.drawLight(time / 1000); }
    if (time - this.hudT > 500) { this.hudT = time; this.hudRefresh(); }
  }

  async openElevator() {
    try { const f = await net.floors(this.d.session.token); ui.elevator.open(f, this.d.floorId, fl => this.d.onPick(fl.id)); }
    catch (e: any) { ui.toast(e.message); }
  }
}

export function cardOf(s: any): CardData {
  const has = s.tec >= 0;
  return { name: s.name, country: s.country, specialty: s.specialty, schoolLetter: s.schoolLetter, role: s.role, stats: has ? { tec: s.tec, pre: s.pre, cre: s.cre, ens: s.ens } : null, rank: s.rank, level: s.level };
}
