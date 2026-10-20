/**
 * Moteur audio procédural (Web Audio API, aucun fichier) :
 * - musique d'ambiance synthwave douce : nappes désaccordées, arpège avec écho, basse ronde,
 *   progression Am – F – C – G à 84 BPM, le tout passé dans une réverbération générée ;
 * - effet « pop » discret pour les clics.
 * Le contexte audio n'est créé qu'après un geste utilisateur (politique d'autoplay des navigateurs).
 */

const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
/** Accords (notes MIDI) : Am, F, C, G — un accord par mesure. */
const PROGRESSION = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
];
const ARP_PATTERN = [0, 1, 2, 1, 2, 3, 2, 1];
const MUSIC_LEVEL = 0.16;
const SFX_LEVEL = 0.22;

function midiToHz(m: number) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private sfx: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private delay: DelayNode | null = null;
  private nextBarTime = 0;
  private barIndex = 0;
  private muted = false;

  /** Crée le graphe audio et lance la musique. À appeler depuis un gestionnaire de clic. */
  start() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      this.ctx = ctx;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.ratio.value = 3;
      compressor.connect(ctx.destination);

      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(compressor);

      this.reverb = ctx.createConvolver();
      this.reverb.buffer = this.impulse(2.8);
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      this.reverb.connect(wet).connect(this.master);

      this.music = ctx.createGain();
      this.music.gain.value = 0;
      this.music.connect(this.master);
      this.music.connect(this.reverb);
      this.music.gain.linearRampToValueAtTime(MUSIC_LEVEL, ctx.currentTime + 4);

      // Écho rythmique (croche pointée) pour l'arpège.
      this.delay = ctx.createDelay(2);
      this.delay.delayTime.value = BEAT * 0.75;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.32;
      this.delay.connect(feedback).connect(this.delay);
      this.delay.connect(this.music);

      this.sfx = ctx.createGain();
      this.sfx.gain.value = SFX_LEVEL;
      this.sfx.connect(this.master);

      this.nextBarTime = ctx.currentTime + 0.1;
      setInterval(() => this.schedule(), 250);
      this.schedule();
    }
    if (this.muted) void this.ctx.suspend();
    else if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.25);
    // Suspend le contexte une fois le fondu terminé pour économiser le CPU.
    if (muted) setTimeout(() => this.muted && void ctx.suspend(), 300);
    else void ctx.resume();
  }

  /** « Pop » court : sinus à glissando descendant + léger clic filtré. */
  click() {
    const ctx = this.ctx;
    if (!ctx || !this.sfx || this.muted) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.09);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(g).connect(this.sfx);
    osc.start(t);
    osc.stop(t + 0.16);

    const tick = ctx.createOscillator();
    const tg = ctx.createGain();
    tick.type = 'triangle';
    tick.frequency.value = 2400;
    tg.gain.setValueAtTime(0.25, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    tick.connect(tg).connect(this.sfx);
    tick.start(t);
    tick.stop(t + 0.04);
  }

  /* ---------------------------------------------------------------- */

  private impulse(seconds: number): AudioBuffer {
    const ctx = this.ctx as AudioContext;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  /** Planifie les mesures à venir (fenêtre d'anticipation d'une mesure). */
  private schedule() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    // Après une suspension (son coupé), on repart de maintenant au lieu de rattraper les mesures perdues.
    if (this.nextBarTime < ctx.currentTime) this.nextBarTime = ctx.currentTime + 0.05;
    while (this.nextBarTime < ctx.currentTime + BAR) {
      this.playBar(this.nextBarTime, PROGRESSION[this.barIndex % PROGRESSION.length]);
      this.nextBarTime += BAR;
      this.barIndex += 1;
    }
  }

  private playBar(t: number, chord: number[]) {
    this.pad(t, chord);
    this.bass(t, chord[0] - 12);
    // L'arpège entre après 4 mesures, puis joue 3 mesures sur 4 pour respirer.
    if (this.barIndex >= 4 && this.barIndex % 4 !== 3) {
      const tones = [...chord, chord[0] + 12].map((n) => n + 12);
      ARP_PATTERN.forEach((step, i) => this.pluck(t + i * (BEAT / 2), tones[step]));
    }
  }

  private pad(t: number, chord: number[]) {
    const ctx = this.ctx as AudioContext;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(700, t);
    filter.frequency.linearRampToValueAtTime(1300, t + BAR / 2);
    filter.frequency.linearRampToValueAtTime(800, t + BAR);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(0.09, t + 1.4);
    env.gain.setValueAtTime(0.09, t + BAR - 0.6);
    env.gain.linearRampToValueAtTime(0.0001, t + BAR + 1.2);
    filter.connect(env).connect(this.music as GainNode);
    for (const note of chord) {
      for (const detune of [-7, 7]) {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = midiToHz(note);
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(t);
        osc.stop(t + BAR + 1.3);
      }
    }
  }

  private bass(t: number, note: number) {
    const ctx = this.ctx as AudioContext;
    for (const offset of [0, BAR / 2]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = midiToHz(note);
      g.gain.setValueAtTime(0.0001, t + offset);
      g.gain.linearRampToValueAtTime(0.22, t + offset + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + offset + BAR / 2 - 0.05);
      osc.connect(g).connect(this.music as GainNode);
      osc.start(t + offset);
      osc.stop(t + offset + BAR / 2);
    }
  }

  private pluck(t: number, note: number) {
    const ctx = this.ctx as AudioContext;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = midiToHz(note);
    filter.type = 'lowpass';
    filter.frequency.value = 2600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(filter).connect(g);
    g.connect(this.music as GainNode);
    g.connect(this.delay as DelayNode);
    osc.start(t);
    osc.stop(t + 0.4);
  }
}

export const audio = new AudioEngine();
