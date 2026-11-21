// hints.js — 3 hints per scene. A hint pulses the next unfound
// difference's area on both panels for 2 seconds.
import { diffPos } from './differences.js';

export class HintSystem {
  constructor() {
    this.left = 3;
    this.active = null; // { diff, until }
  }
  reset() {
    this.left = 3;
    this.active = null;
  }
  // Returns the diff to highlight, or null when no hints remain.
  use(foundIds, diffs, now) {
    if (this.left <= 0) return null;
    const next = diffs.find((d) => !foundIds.has(d.id));
    if (!next) return null;
    this.left -= 1;
    this.active = { diff: next, until: now + 2000 };
    return next;
  }
  // Returns the currently pulsing diff, or null when the pulse expired.
  current(now) {
    if (!this.active) return null;
    if (now > this.active.until) { this.active = null; return null; }
    return this.active.diff;
  }
  // Pulse radius breathes between r+4 and r+14.
  pulseRadius(diff, now) {
    const phase = (now % 600) / 600;
    return diff.r + 4 + Math.sin(phase * Math.PI * 2) * 5 + 5;
  }
  hintPositions(diff) {
    return [diffPos(diff, 0), diffPos(diff, 1)];
  }
}
