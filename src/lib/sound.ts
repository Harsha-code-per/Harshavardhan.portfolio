"use client";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private crtHumOsc: OscillatorNode | null = null;
  private crtHumGain: GainNode | null = null;
  private isMuted: boolean = true;

  constructor() {
    // Audio is muted by default to satisfy browser autoplay policies.
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sys_audio_muted");
      this.isMuted = saved !== null ? saved === "true" : true;
    }
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 0.2, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("sys_audio_muted", String(muted));
    }
    
    this.init();
    if (this.ctx && this.masterVolume) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      // Smooth fade-in/fade-out to avoid pop clicks
      this.masterVolume.gain.setValueAtTime(this.masterVolume.gain.value, this.ctx.currentTime);
      this.masterVolume.gain.exponentialRampToValueAtTime(
        muted ? 0.0001 : 0.2,
        this.ctx.currentTime + 0.1
      );

      if (muted) {
        this.stopCrtHum();
      } else {
        this.startCrtHum();
      }
    }
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  public playClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterVolume!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playStaticHover() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    // Create custom noise buffer for a retro static crackle
    const bufferSize = this.ctx.sampleRate * 0.03; // 30ms burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make the static sound more vintage/muffled
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume!);

    noise.start();
  }

  public playBeep() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 note

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterVolume!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playCRTBoot() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(15625, this.ctx.currentTime + 0.8); // 15.6kHz analog monitor whine

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

    // Apply highpass to keep the high frequency whine but lose the low sawtooth rumbling
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 800;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume!);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);

    // After boot whine finishes, start the background humming
    setTimeout(() => this.startCrtHum(), 800);
  }

  public startCrtHum() {
    this.init();
    if (!this.ctx || this.isMuted || this.crtHumOsc) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Very subtle low frequency hum (60Hz grid noise)
    osc.type = "triangle";
    osc.frequency.value = 60;

    // Filter to keep it deep and soft
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 120;

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.masterVolume!);

    osc.start();
    
    this.crtHumOsc = osc;
    this.crtHumGain = gain;
  }

  public stopCrtHum() {
    if (this.crtHumOsc && this.ctx) {
      try {
        this.crtHumOsc.stop();
        this.crtHumOsc.disconnect();
      } catch {}
      this.crtHumOsc = null;
    }
    if (this.crtHumGain) {
      try {
        this.crtHumGain.disconnect();
      } catch {}
      this.crtHumGain = null;
    }
  }
}

// Export singleton instance
export const sound = new SoundEngine();
