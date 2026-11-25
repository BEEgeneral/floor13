/** Sonido procedural (Web Audio): sin archivos. Se activa tras el primer gesto del usuario. M silencia. */
let ac: AudioContext | null = null, master: GainNode | null = null, amb: GainNode | null = null, muted = false, noiseBuf: AudioBuffer | null = null;
try { muted = localStorage.getItem('f13mute') === '1'; } catch { /* sin almacenamiento */ }

function ctx() {
  if (!ac) {
    try { ac = new AudioContext(); } catch { return null; }
    master = ac.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === 'suspended') void ac.resume();
  return ac;
}
const noise = (c: AudioContext, dur: number, type: BiquadFilterType, f: number, q: number, vol: number, when = 0, fEnd?: number) => {
  const s = c.createBufferSource(); s.buffer = noiseBuf; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
  if (fEnd) fl.frequency.exponentialRampToValueAtTime(fEnd, c.currentTime + when + dur);
  const g = c.createGain(), t = c.currentTime + when; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(fl).connect(g).connect(master!); s.start(t, Math.random() * 0.5, dur + 0.05);
};
const tone = (c: AudioContext, f: number, dur: number, vol: number, when = 0, type: OscillatorType = 'sine') => {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + when; o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(master!); o.start(t); o.stop(t + dur + 0.05);
};

export const sfx = {
  unlock() { ctx(); },
  step(alt: boolean) { const c = ctx(); if (!c || muted) return; noise(c, 0.07, 'lowpass', alt ? 520 : 430, 0.8, 0.22); tone(c, alt ? 95 : 82, 0.06, 0.12); },
  ding() { const c = ctx(); if (!c || muted) return; tone(c, 1318, 1.1, 0.16); tone(c, 1760, 0.9, 0.08, 0.02); tone(c, 2637, 0.5, 0.04, 0.02); },
  lift() { const c = ctx(); if (!c || muted) return; noise(c, 0.9, 'bandpass', 180, 1.2, 0.18, 0, 520); tone(c, 55, 0.9, 0.1, 0, 'sawtooth'); },
  denied() { const c = ctx(); if (!c || muted) return; tone(c, 180, 0.16, 0.14, 0, 'square'); tone(c, 140, 0.22, 0.14, 0.12, 'square'); },
  pop() { const c = ctx(); if (!c || muted) return; tone(c, 620, 0.09, 0.1); tone(c, 930, 0.1, 0.07, 0.04); },
  clap() { const c = ctx(); if (!c || muted) return; for (let i = 0; i < 5; i++) noise(c, 0.06, 'highpass', 1800, 0.7, 0.16, i * 0.11 + Math.random() * 0.03); },
  hand() { const c = ctx(); if (!c || muted) return; tone(c, 520, 0.12, 0.08); tone(c, 780, 0.18, 0.08, 0.09); },
  spark() { const c = ctx(); if (!c || muted) return; noise(c, 0.05, 'highpass', 3500, 0.6, 0.05); },
  /** Ambiente: murmullo grave y zumbido eléctrico muy bajo. */
  ambience(on: boolean) {
    const c = ctx(); if (!c) return;
    if (!amb) {
      amb = c.createGain(); amb.gain.value = 0; amb.connect(master!);
      const hum = c.createOscillator(); hum.type = 'sine'; hum.frequency.value = 50; const hg = c.createGain(); hg.gain.value = 0.05; hum.connect(hg).connect(amb); hum.start();
      const hum2 = c.createOscillator(); hum2.type = 'triangle'; hum2.frequency.value = 100.5; const h2 = c.createGain(); h2.gain.value = 0.012; hum2.connect(h2).connect(amb); hum2.start();
      const n = c.createBufferSource(); n.buffer = noiseBuf; n.loop = true; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260; const ng = c.createGain(); ng.gain.value = 0.05; n.connect(f).connect(ng).connect(amb); n.start();
    }
    amb.gain.cancelScheduledValues(c.currentTime); amb.gain.linearRampToValueAtTime(on ? 1 : 0, c.currentTime + 1.2);
  },
  toggleMute() { muted = !muted; try { localStorage.setItem('f13mute', muted ? '1' : '0'); } catch { /* sin almacenamiento */ } if (master && ac) master.gain.setTargetAtTime(muted ? 0 : 0.5, ac.currentTime, 0.05); return muted; },
  isMuted: () => muted,
};
