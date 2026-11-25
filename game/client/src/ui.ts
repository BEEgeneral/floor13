import { carta } from './card.ts';
import type { FloorInfo } from './net.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
let cardN = 0, toastT: number | undefined;

export interface CardData { name: string; country: string; specialty: string; schoolLetter: string; role: string; stats: { tec: number; pre: number; cre: number; ens: number } | null; rank?: string; level?: number }
export const cardSvg = (d: CardData) => carta({
  name: d.name, esp: d.specialty, pais: d.country, escuela: ['', d.schoolLetter || '?'], stats: d.stats,
  sellos: d.role === 'tribunal' || d.role === 'anfitrion' ? ['verificado'] : [],
}, ++cardN);

const NAMES: Record<string, string> = { visitante: 'Visitante', huesped: 'Huésped', tribunal: 'Tribunal', anfitrion: 'Anfitrión' };

export const ui = {
  toast(msg: string, ms = 3800) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = window.setTimeout(() => { t.hidden = true; }, ms); },
  prompt(msg: string | null) { const p = $('prompt'); if (msg) { p.textContent = msg; p.hidden = false; } else p.hidden = true; },
  hud(floorName: string, number: number, count: number, me: { name: string; rank: string; level: number; role: string }) {
    $('hWhere').innerHTML = `<b>Planta ${number}</b> · ${floorName} · ${count} ${count === 1 ? 'mago' : 'magos'}`;
    $('hMe').innerHTML = `<b>${me.name}</b> · ${me.level >= 0 ? `${me.rank} · nivel ${me.level}` : 'Sin examinar'} · ${NAMES[me.role] ?? me.role}`;
  },
  chat(from: string, text: string) {
    const log = $('chatLog'), d = document.createElement('div'); const b = document.createElement('b'); b.textContent = from + ': '; d.append(b, document.createTextNode(text)); log.append(d);
    while (log.children.length > 6) log.firstElementChild!.remove(); setTimeout(() => d.remove(), 14000);
  },
  chatOpen: () => !$('chatForm').hidden,
  openChat() { $('chatForm').hidden = false; $<HTMLInputElement>('chatInput').focus(); },
  closeChat() { $('chatForm').hidden = true; (document.activeElement as HTMLElement | null)?.blur(); },
  onChatSend(fn: (text: string) => void) { $('chatForm').addEventListener('submit', e => { e.preventDefault(); const i = $<HTMLInputElement>('chatInput'); const t = i.value.trim(); i.value = ''; ui.closeChat(); if (t) fn(t); }); $('chatInput').addEventListener('keydown', e => { if (e.key === 'Escape') ui.closeChat(); }); },

  elevator: (() => {
    let floors: FloorInfo[] = [], sel = 0, pick: (f: FloorInfo) => void = () => {};
    const ul = () => $('floorList'), open = () => !$('elevator').hidden;
    const draw = () => {
      ul().innerHTML = '';
      floors.forEach((f, i) => {
        const li = document.createElement('li'); li.className = (i === sel ? 'sel ' : '') + (f.allowed ? '' : 'locked'); li.setAttribute('role', 'button');
        li.innerHTML = `<span class="num">${f.number}</span><span><div class="nm"></div><div class="sb"></div></span><span class="pl"></span>`;
        (li.querySelector('.nm') as HTMLElement).textContent = f.name; (li.querySelector('.sb') as HTMLElement).textContent = f.allowed ? f.sub : `🔒 ${f.reason ?? 'Cerrada'}`;
        (li.querySelector('.pl') as HTMLElement).textContent = `${f.players} ${f.players === 1 ? 'mago' : 'magos'}`;
        li.onclick = () => { sel = i; draw(); confirm(); }; ul().append(li);
      });
    };
    const confirm = () => { const f = floors[sel]; if (!f) return; if (!f.allowed) { ui.toast(f.reason ?? 'Esa planta está cerrada'); return; } close(); pick(f); };
    const close = () => { $('elevator').hidden = true; };
    return {
      open: (fl: FloorInfo[], current: string, onPick: (f: FloorInfo) => void) => { floors = fl; pick = onPick; sel = Math.max(0, fl.findIndex(f => f.id !== current)); $('elevator').hidden = false; draw(); },
      close, isOpen: open, confirm,
      move: (d: number) => { if (!floors.length) return; sel = (sel + d + floors.length) % floors.length; draw(); },
    };
  })(),

  card: {
    show(d: CardData, extra = '') { $('cardSvg').innerHTML = cardSvg(d); $('cardMeta').textContent = extra || (d.level != null && d.level >= 0 ? `${d.rank} · nivel ${d.level}` : 'Aún no se ha examinado'); $('cardPop').hidden = false; },
    hide() { $('cardPop').hidden = true; }, isOpen: () => !$('cardPop').hidden,
  },

  test: {
    toggle() { const p = $('testPanel'); p.hidden = !p.hidden; }, isOpen: () => !$('testPanel').hidden, hide() { $('testPanel').hidden = true; },
    fill(role: string, keys: string[], stats: { tec: number; pre: number; cre: number; ens: number } | null) {
      $<HTMLSelectElement>('tRole').value = role; $<HTMLInputElement>('tKeyExam').checked = keys.includes('llave_examen'); $<HTMLInputElement>('tKeyInv').checked = keys.includes('invitacion_charla');
      (['Tec', 'Pre', 'Cre', 'Ens'] as const).forEach(k => { $<HTMLInputElement>('t' + k).value = stats ? String(stats[k.toLowerCase() as 'tec']) : ''; });
    },
    read() {
      const num = (id: string) => $<HTMLInputElement>(id).value; const vals = [num('tTec'), num('tPre'), num('tCre'), num('tEns')];
      const stats = vals.every(v => v !== '') ? { tec: +vals[0], pre: +vals[1], cre: +vals[2], ens: +vals[3] } : undefined;
      const keys = [$<HTMLInputElement>('tKeyExam').checked ? 'llave_examen' : '', $<HTMLInputElement>('tKeyInv').checked ? 'invitacion_charla' : ''].filter(Boolean);
      return { role: $<HTMLSelectElement>('tRole').value, keys, stats };
    },
    msg(m: string) { $('tMsg').textContent = m; },
  },
  $,
};
