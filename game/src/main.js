// main.js — bootstrap + wiring: HUD, overlays, game loop, clicks, keys.
import { GameState } from './state.js';
import { SceneTimer } from './timer.js';
import { HintSystem } from './hints.js';
import { Renderer, LAYOUT } from './render.js';
import { Input } from './input.js';
import { sounds, setMuted, isMuted } from './audio.js';
import { diffPos } from './differences.js';
import { SCENES } from './scenes.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game-canvas');
const state = new GameState();
const timer = new SceneTimer();
const hints = new HintSystem();
const renderer = new Renderer(canvas);

let lastTs = 0;
let flashUntil = 0;

function fmtScore(n) { return String(n); }

function updateHud() {
  $('hud-scene').textContent = state.scene.name;
  $('hud-scene-num').textContent = 'Scene ' + state.sceneId + ' of 4';
  $('hud-tofind').textContent = state.remaining + ' to find';
  $('hud-timer-text').textContent = timer.text;
  $('hud-timer-bar').style.width = (timer.fraction * 100).toFixed(1) + '%';
  $('hud-timer-bar').classList.toggle('urgent', timer.urgent);
  $('hud-score').textContent = fmtScore(state.score);
  $('hud-streak').textContent = 'Streak x' + state.multiplier.toFixed(2).replace(/\.?0+$/, '');
  $('hud-hint-count').textContent = 'Hint (' + hints.left + ')';
  $('btn-sound').textContent = isMuted() ? 'Sound: Off' : 'Sound: On';
  $('hud-strikes').textContent = '✕'.repeat(state.strikes) || '—';
  // Found list + dots
  const list = $('found-list');
  list.innerHTML = '';
  for (const d of state.diffs) {
    const span = document.createElement('span');
    span.className = 'found-item' + (state.found.has(d.id) ? ' found' : '');
    span.textContent = (state.found.has(d.id) ? '✓ ' : '○ ') + d.name;
    list.appendChild(span);
  }
  const dots = $('found-dots');
  dots.innerHTML = '';
  for (const d of state.diffs) {
    const s = document.createElement('span');
    s.className = 'dot' + (state.found.has(d.id) ? ' on' : '');
    dots.appendChild(s);
  }
}

function showOverlay(which) {
  for (const id of ['overlay-menu', 'overlay-pause', 'overlay-complete', 'overlay-final', 'overlay-timeout']) {
    $(id).classList.toggle('hidden', id !== which);
  }
  if (!which) {
    for (const id of ['overlay-menu', 'overlay-pause', 'overlay-complete', 'overlay-final', 'overlay-timeout']) {
      $(id).classList.add('hidden');
    }
  }
}

function startScene(id) {
  state.startScene(id);
  hints.reset();
  timer.onTimeout = onTimeUp;
  timer.start(state.scene.par);
  showOverlay(null);
  updateHud();
}

function onTimeUp() {
  if (state.screen !== 'play') return;
  sounds.wrong();
  $('timeout-scene').textContent = state.scene.name;
  showOverlay('overlay-timeout');
  updateHud();
}

function onSceneComplete(bonus) {
  timer.stop();
  sounds.complete();
  $('complete-title').textContent = state.scene.name + ' complete!';
  $('complete-score').textContent = 'Score ' + state.score + '  ·  Time bonus +' + bonus;
  $('complete-found').textContent = 'All 7 differences found';
  $('btn-next').textContent = state.sceneId < 4 ? 'Next Scene →' : 'See Final Score →';
  showOverlay('overlay-complete');
}

function onFinal() {
  timer.stop();
  sounds.win();
  $('final-score').textContent = state.score;
  $('final-best').textContent = 'Best: ' + state.best;
  showOverlay('overlay-final');
}

function handleClick(x, y) {
  if (state.screen !== 'play' || state.paused) return;
  const diff = input.pickDiff(x, y, state.diffs, state.found);
  if (diff) {
    const pts = state.registerFind(diff);
    sounds.find();
    const now = performance.now();
    renderer.addRing(diff, now);
    // particle bursts on both panels
    for (const [px, panel] of [[LAYOUT.leftX, 0], [LAYOUT.rightX, 1]]) {
      const p = diffPos(diff, panel);
      renderer.spawnBurst(px, LAYOUT.panelY, p.x, p.y);
    }
    updateHud();
    if (state.sceneDone) {
      const bonus = state.completeScene(timer.left);
      setTimeout(() => onSceneComplete(bonus), 650);
    }
  } else {
    const hit = input.panelHit(x, y);
    if (!hit) return; // clicked outside the panels: ignore
    state.registerWrong();
    timer.penalize(3);
    sounds.wrong();
    flashUntil = performance.now() + 250;
    updateHud();
  }
}

function useHint() {
  if (state.screen !== 'play' || state.paused) return;
  const d = hints.use(state.found, state.diffs, performance.now());
  if (d) { sounds.hint(); updateHud(); }
  else { sounds.wrong(); }
}

function togglePause() {
  if (state.screen !== 'play') return;
  state.paused = !state.paused;
  if (state.paused) { timer.pause(); showOverlay('overlay-pause'); }
  else { timer.resume(); showOverlay(null); }
  updateHud();
}

function toggleSound() {
  setMuted(!isMuted());
  updateHud();
}

function handleKey(key) {
  if (key === 'Escape') {
    if (state.screen === 'play') { state.toMenu(); timer.stop(); showOverlay('overlay-menu'); updateHud(); }
    return;
  }
  if (state.screen === 'menu') {
    if (key >= '1' && key <= '4') startScene(Number(key));
    else if (key === 'Enter') state.startGame(), startScene(1);
    return;
  }
  if (state.screen === 'sceneComplete' && (key === 'Enter' || key === ' ')) {
    if (state.sceneId < 4) startScene(state.sceneId + 1);
    else { state.finishGame(); onFinal(); }
    return;
  }
  if (state.screen === 'final' && (key === 'Enter' || key === ' ')) {
    state.startGame(); startScene(1);
    return;
  }
  if (state.screen !== 'play') return;
  if (key === 'h' || key === 'H') useHint();
  else if (key === 'p' || key === 'P') togglePause();
  else if (key === 'm' || key === 'M') toggleSound();
  else if (key === 'r' || key === 'R') { state.retryScene(); startScene(state.sceneId); }
  else if (key >= '1' && key <= '4') startScene(Number(key));
}

const input = new Input(canvas, renderer, {
  onClick: handleClick,
  onKey: handleKey,
});

// Buttons
$('btn-hint').addEventListener('click', useHint);
$('btn-pause').addEventListener('click', togglePause);
$('btn-sound').addEventListener('click', toggleSound);
$('btn-next').addEventListener('click', () => {
  if (state.sceneId < 4) startScene(state.sceneId + 1);
  else { state.finishGame(); onFinal(); }
});
$('btn-again').addEventListener('click', () => { state.startGame(); startScene(1); });
$('btn-menu-final').addEventListener('click', () => { state.toMenu(); showOverlay('overlay-menu'); updateHud(); });
$('btn-retry').addEventListener('click', () => { state.retryScene(); startScene(state.sceneId); });
$('btn-menu-timeout').addEventListener('click', () => { state.toMenu(); showOverlay('overlay-menu'); updateHud(); });
$('btn-resume').addEventListener('click', togglePause);
$('btn-restart-pause').addEventListener('click', () => { state.retryScene(); startScene(state.sceneId); });
$('btn-quit-pause').addEventListener('click', () => { state.toMenu(); timer.stop(); showOverlay('overlay-menu'); updateHud(); });
$('btn-play').addEventListener('click', () => { state.startGame(); startScene(1); });
document.querySelectorAll('.scene-pick').forEach((b) => {
  b.addEventListener('click', () => startScene(Number(b.dataset.scene)));
});

// Menu best score
$('menu-best').textContent = 'Best score: ' + state.best;

// Game loop
function loop(ts) {
  const dt = Math.min(0.1, (ts - lastTs) / 1000 || 0);
  lastTs = ts;
  if (state.screen === 'play' && !state.paused) timer.tick(dt);
  renderer.update(ts);
  if (state.screen !== 'menu') {
    renderer.draw(state, hints, ts);
    if (flashUntil && ts < flashUntil) {
      const c = renderer.ctx;
      c.fillStyle = 'rgba(230, 57, 70, 0.18)';
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    const c = renderer.ctx;
    c.fillStyle = '#0e1424';
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
updateHud();

// Test + screenshot hooks (used by shots.js and playtests)
window.__game = {
  state, timer, hints, renderer, input,
  startScene, updateHud, showOverlay,
  LAYOUT,
};
