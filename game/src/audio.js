// audio.js — WebAudio oscillator sounds only. No audio files, no network.
let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when = 0) {
  if (muted) return;
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

export const sounds = {
  find() { tone(880, 0.14, 'sine', 0.14); tone(1318, 0.2, 'sine', 0.12, 0.07); },
  wrong() { tone(160, 0.22, 'sawtooth', 0.08); tone(110, 0.25, 'sawtooth', 0.07, 0.05); },
  hint() { tone(660, 0.12, 'triangle', 0.1); tone(990, 0.14, 'triangle', 0.09, 0.08); },
  click() { tone(520, 0.06, 'triangle', 0.06); },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'sine', 0.13, i * 0.11));
  },
  complete() {
    [784, 988, 1175].forEach((f, i) => tone(f, 0.2, 'triangle', 0.11, i * 0.09));
  },
};

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }
