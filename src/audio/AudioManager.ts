export class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicEnabled = true;
  private isVoiceEnabled = true;
  private isSpeaking = false;
  private loopTimer: number | null = null;
  private stepIndex = 0;

  private readonly BASE_VOLUME = 0.14;
  private readonly DUCKED_VOLUME = 0.025;

  // Calm Indonesian pentatonic / warm ambient chord progression (Hz)
  private readonly CHORDS: number[][] = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0], // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0], // G6
  ];

  private readonly MELODY: number[] = [
    523.25, 587.33, 659.25, 523.25, 783.99, 659.25, 587.33, 440.0,
    523.25, 659.25, 587.33, 523.25, 392.0, 440.0, 523.25, 587.33,
  ];

  public initAudio(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicEnabled ? this.BASE_VOLUME : 0;
      this.musicGain.connect(this.ctx.destination);
      this.startAmbientLoop();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private startAmbientLoop(): void {
    if (this.loopTimer !== null) return;
    const playStep = () => {
      if (!this.ctx || !this.musicGain || !this.isMusicEnabled || this.ctx.state !== 'running') {
        return;
      }

      const now = this.ctx.currentTime;
      const chordIdx = Math.floor(this.stepIndex / 4) % this.CHORDS.length;

      // Soft warm pad on chord change
      if (this.stepIndex % 4 === 0) {
        const chord = this.CHORDS[chordIdx];
        for (const freq of chord) {
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.musicGain);
          osc.start(now);
          osc.stop(now + 4.0);
        }
      }

      // Gentle marimba/kalimba plucks
      const melodyFreq = this.MELODY[this.stepIndex % this.MELODY.length];
      if (this.stepIndex % 2 === 0 || this.stepIndex % 3 === 0) {
        const osc = this.ctx.createOscillator();
        const pluckGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melodyFreq, now);

        pluckGain.gain.setValueAtTime(0.0001, now);
        pluckGain.gain.linearRampToValueAtTime(0.11, now + 0.04);
        pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

        osc.connect(pluckGain);
        pluckGain.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 1.2);
      }

      this.stepIndex++;
    };

    playStep();
    this.loopTimer = window.setInterval(playStep, 950);
  }

  public setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;
    this.initAudio();
    this.updateMusicVolume();
  }

  public setVoiceEnabled(enabled: boolean): void {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  public getVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  private updateMusicVolume(): void {
    if (!this.ctx || !this.musicGain) return;
    const target = !this.isMusicEnabled
      ? 0
      : this.isSpeaking
        ? this.DUCKED_VOLUME
        : this.BASE_VOLUME;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(target, now + 0.35);
  }

  public playSfx(type: 'step' | 'coin' | 'portal' | 'success'): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    if (type === 'coin' || type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'success' ? 523.25 : 659.25, now);
      osc.frequency.setValueAtTime(type === 'success' ? 659.25 : 880, now + 0.08);
      if (type === 'success') {
        osc.frequency.setValueAtTime(783.99, now + 0.16);
      }
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (type === 'portal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.25);
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  }

  public speak(text: string): void {
    if (!this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.initAudio();
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.98;
      utterance.pitch = 1.04;

      const voices = window.speechSynthesis.getVoices();
      const idVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith('id')) ||
        voices.find((v) => v.name.toLowerCase().includes('indonesia'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.updateMusicVolume();
      };

      const finishDucking = () => {
        this.isSpeaking = false;
        this.updateMusicVolume();
      };

      utterance.onend = finishDucking;
      utterance.onerror = finishDucking;

      this.isSpeaking = true;
      this.updateMusicVolume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
      this.isSpeaking = false;
      this.updateMusicVolume();
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.updateMusicVolume();
  }

  public dispose(): void {
    if (this.loopTimer !== null) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.stopSpeaking();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const audioManager = new AudioManager();
