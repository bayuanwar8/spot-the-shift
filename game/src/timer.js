// timer.js — per-scene countdown, par times, wrong-click penalties.
export class SceneTimer {
  constructor() {
    this.par = 90;
    this.left = 90;
    this.running = false;
    this.onTimeout = null;
  }
  start(parSeconds) {
    this.par = parSeconds;
    this.left = parSeconds;
    this.running = true;
  }
  stop() { this.running = false; }
  pause() { this.running = false; }
  resume() { this.running = true; }
  // dt in seconds; returns true when the timer just hit zero.
  tick(dt) {
    if (!this.running) return false;
    this.left -= dt;
    if (this.left <= 0) {
      this.left = 0;
      this.running = false;
      if (this.onTimeout) this.onTimeout();
      return true;
    }
    return false;
  }
  penalize(seconds) {
    this.left = Math.max(0, this.left - seconds);
    if (this.left <= 0) {
      this.running = false;
      if (this.onTimeout) this.onTimeout();
    }
  }
  get remaining() { return Math.ceil(this.left); }
  get fraction() { return Math.max(0, this.left / this.par); }
  get text() {
    const s = Math.max(0, Math.ceil(this.left));
    return String(Math.floor(s / 60)).padStart(1, '0') + ':' + String(s % 60).padStart(2, '0');
  }
  get urgent() { return this.left <= 15; }
}
