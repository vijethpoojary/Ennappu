/**
 * Tiny Web Audio synth for sound effects, so no audio files are needed.
 * Browsers block audio until a user gesture, so call unlockAudio() inside a tap handler first.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(f0: number, f1: number, dur: number, type: OscillatorType, vol: number, delay = 0) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, freq: number, q: number, vol: number, delay = 0, freqEnd?: number) {
  if (!ctx || !master) return;
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(freq, t);
  if (freqEnd) filter.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
  filter.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.05);
}

export const sfx = {
  pop() {
    noise(0.1, 1600, 0.9, 0.9);
    tone(650, 120, 0.12, "triangle", 0.35);
  },
  chime() {
    [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, f * 0.998, 1.1, "sine", 0.12, i * 0.09));
  },
  sparkle() {
    for (let i = 0; i < 5; i++) {
      const f = 1800 + Math.random() * 1600;
      tone(f, f * 1.02, 0.35, "sine", 0.06, i * 0.05);
    }
  },
  whoosh() {
    noise(0.8, 300, 0.7, 0.5, 0, 3200);
  },
  hug() {
    [392, 523.25, 659.25].forEach((f, i) => tone(f, f, 1.1, "sine", 0.12, i * 0.06));
  },
  kiss() {
    tone(480, 1300, 0.09, "sine", 0.22);
    tone(1250, 650, 0.14, "sine", 0.16, 0.09);
    noise(0.05, 3500, 2, 0.25, 0.07);
  },
};
