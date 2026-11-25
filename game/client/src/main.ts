import Phaser from 'phaser';
import { W, H, FLOORS, type FloorId } from '@floor13/shared';
import { net, type Session } from './net.ts';
import { ui } from './ui.ts';
import { FloorScene } from './scene.ts';
import { sfx } from './audio.ts';
import './style.css';

const $ = ui.$, KEY = 'f13token';
let session: Session | null = null, room: any = null, floorId: FloorId | null = null, switching = false;
const store = { get: () => { try { return localStorage.getItem(KEY); } catch { return null; } }, set: (v: string | null) => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } } };

const game = new Phaser.Game({
  type: Phaser.AUTO, width: W, height: H, parent: 'game', backgroundColor: '#0b0807', pixelArt: false, antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: [], disableContextMenu: true,
});
game.scene.add('floor', FloorScene, false);
(window as any).__f13 = { game, get floorId() { return floorId; }, get session() { return session; } };

async function enter(id: FloorId): Promise<boolean> {
  if (!session || switching) return false; switching = true;
  try {
    const next = await net.join(id, session.token);          // primero entramos en la nueva; si falla, nos quedamos donde estábamos
    const old = room; room = next; floorId = id;
    game.scene.stop('floor');
    old?.leave?.();
    game.scene.start('floor', { room: next, floorId: id, session, onPick: (f: FloorId) => { if (f !== floorId) go(f); } });
    next.onLeave((code: number) => { if (room === next && code >= 1000 && code !== 1000) ui.toast('Se perdió la conexión con el hotel. Recarga la página.', 8000); });
    return true;
  } catch (e: any) { ui.toast(e.message); return false; }
  finally { switching = false; }
}
async function go(id: FloorId) { const ok = await enter(id); if (ok) ui.toast(`Has llegado a: ${FLOORS[id].name}`, 1800); }

async function start(s: Session) {
  sfx.unlock();
  session = s; store.set(s.token);
  $('login').hidden = true; $('ui').hidden = false; syncTest();
  if (!(await enter('vestibulo'))) { $('ui').hidden = true; $('login').hidden = false; $('loginErr').textContent = 'No se pudo entrar. ¿Está el servidor encendido?'; }
}
function syncTest() { if (!session) return; ui.test.fill(session.profile.role, session.profile.keys, session.profile.stats); }

ui.onChatSend(text => room?.send('chat', { text }));
$('cardClose').onclick = () => ui.card.hide();
$('tClear').onclick = () => { ['tTec', 'tPre', 'tCre', 'tEns'].forEach(i => { ($(i) as HTMLInputElement).value = ''; }); };
$('tApply').onclick = async () => {
  if (!session) return; const r = ui.test.read();
  try {
    session = await net.patch(session.token, { role: r.role, keys: r.keys, stats: r.stats ?? null }); syncTest(); ui.test.msg('Aplicado. Vuelvo a entrar en la planta…');
    const cur = floorId!; const ok = await enter(cur); ui.test.msg(ok ? 'Aplicado.' : 'Aplicado, pero no se pudo volver a entrar.');
  } catch (e: any) { ui.test.msg(e.message); }
};
$('tLogout').onclick = () => { store.set(null); location.reload(); };

// ---- pantalla de entrada ----
async function boot() {
  const tok = store.get();
  if (tok) { try { const s = await net.me(tok); $('resume').hidden = false; $('newMago').hidden = true; $('resumeName').textContent = s.profile.name; $('resumeBtn').onclick = () => start(s); } catch { store.set(null); } }
  $('resumeOther').onclick = () => { $('resume').hidden = true; $('newMago').hidden = false; };
  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault(); $('loginErr').textContent = '';
    const v = (id: string) => ($(id) as HTMLInputElement).value;
    try { await start(await net.login({ name: v('fName'), specialty: v('fSpec'), country: v('fCountry'), schoolName: v('fSchool') })); }
    catch (er: any) { $('loginErr').textContent = er.message; }
  });
}
boot();

addEventListener('keydown', e => {
  const a = document.activeElement as HTMLElement | null; if (a && ['INPUT', 'SELECT', 'TEXTAREA'].includes(a.tagName)) return;
  if (e.code === 'KeyM') ui.toast(sfx.toggleMute() ? 'Sonido apagado (M)' : 'Sonido encendido (M)', 1500);
});
