// Audio & Haptic utility for Tasbih click, Adhan preview, and Quran recitation

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private adhanAudio: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Realistic wooden / crystal tasbih bead click sound
  playTasbihClick(pitchFactor = 1.0) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520 * pitchFactor, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140 * pitchFactor, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted yet
    }
  }

  // Target reached celebratory chime
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    } catch {
      // Audio error
    }
  }

  // Harmonic chime when compass locks onto Kaaba direction
  playQiblaLockChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14); // A5

      osc2.frequency.setValueAtTime(1318.5, ctx.currentTime); // E6
      osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.14); // A6

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio error
    }
  }

  // Play gentle notification chime
  playAdhanBeep() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // error
    }
  }

  // Play online adhan sample
  playAdhanStream(url = 'https://media.sd.ma/assabile/adhan_3742387428/adhan_abdul_basit.mp3') {
    if (this.adhanAudio) {
      this.adhanAudio.pause();
      this.adhanAudio = null;
    }
    this.adhanAudio = new Audio(url);
    this.adhanAudio.play().catch(() => {
      this.playAdhanBeep();
    });
  }

  stopAdhan() {
    if (this.adhanAudio) {
      this.adhanAudio.pause();
      this.adhanAudio = null;
    }
  }

  // Haptic feedback
  triggerVibration(duration: number | number[] = 25) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignored if vibration not supported or permissions
      }
    }
  }

  // Quiz: Correct answer sound (bright ascending two-tone)
  playQuizCorrect() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Arpeggiated upbeat chime: G5 -> C6
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
      osc1.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.08);

      osc2.frequency.setValueAtTime(392.0, ctx.currentTime);
      osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);

      this.triggerVibration([30, 40, 40]);
    } catch {
      // Audio error
    }
  }

  // Quiz: Wrong answer sound (gentle buzz)
  playQuizWrong() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.28);

      this.triggerVibration(80);
    } catch {
      // Audio error
    }
  }

  // Quiz: Countdown tick sound
  playQuizTick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio error
    }
  }

  // Quiz: Quiz completed fanfare
  playQuizComplete() {
    this.playSuccessChime();
    this.triggerVibration([50, 50, 100]);
  }
}

export const soundManager = new SoundManager();
