// state.js — game state, score, streak, scene flow.
import { diffsFor } from './differences.js';
import { sceneById } from './scenes.js';

export const SCREENS = ['menu', 'play', 'sceneComplete', 'final'];

export class GameState {
  constructor() {
    this.screen = 'menu';
    this.sceneId = 2;
    this.found = new Set(); // diff ids found in the current scene
    this.score = 0;
    this.streak = 0;
    this.multiplier = 1;
    this.strikes = 0;
    this.paused = false;
    this.best = 0;
    this.sceneStartScore = 0;
    try {
      this.best = Number(localStorage.getItem('spot-the-shift-best') || 0) || 0;
    } catch { this.best = 0; }
  }
  get scene() { return sceneById(this.sceneId); }
  get diffs() { return diffsFor(this.sceneId); }
  get remaining() { return this.diffs.length - this.found.size; }
  get foundList() { return this.diffs.filter((d) => this.found.has(d.id)); }
  get sceneDone() { return this.found.size >= this.diffs.length; }

  startScene(sceneId) {
    this.sceneId = sceneId;
    this.found = new Set();
    this.streak = 0;
    this.multiplier = 1;
    this.strikes = 0;
    this.paused = false;
    this.sceneStartScore = this.score;
    this.screen = 'play';
  }
  startGame() {
    this.score = 0;
    this.startScene(1);
  }
  // Returns the points awarded for a find.
  registerFind(diff) {
    this.found.add(diff.id);
    this.streak += 1;
    this.multiplier = Math.min(3, 1 + (this.streak - 1) * 0.25);
    const pts = Math.round(100 * this.multiplier);
    this.score += pts;
    return pts;
  }
  registerWrong() {
    this.streak = 0;
    this.multiplier = 1;
    this.strikes = Math.min(3, this.strikes + 1);
  }
  // Time bonus on scene complete: remaining seconds x 2.
  completeScene(timerLeftSeconds) {
    const bonus = Math.max(0, Math.round(timerLeftSeconds)) * 2;
    this.score += bonus;
    this.screen = 'sceneComplete';
    return bonus;
  }
  nextScene() {
    if (this.sceneId < 4) this.startScene(this.sceneId + 1);
    else this.finishGame();
  }
  finishGame() {
    this.screen = 'final';
    if (this.score > this.best) {
      this.best = this.score;
      try { localStorage.setItem('spot-the-shift-best', String(this.best)); } catch { /* ignore */ }
    }
  }
  retryScene() {
    // Score earned in this scene is rolled back on retry.
    this.score = this.sceneStartScore;
    this.startScene(this.sceneId);
  }
  toMenu() {
    this.screen = 'menu';
    this.paused = false;
  }
}
