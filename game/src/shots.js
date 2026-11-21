// shots.js — deterministic ?shot= states for the 4 screenshots.
// Loaded after main.js; reads ?shot= and sets up a mid-game state.
//   cover    — scene 2 Borobudur, 3 found, 4 to find, timer 1:47, score 350
//   reef     — scene 1 Coral Reef, 2 found, 5 to find
//   market   — scene 3 Night Market, 4 found, 3 to find
//   complete — scene 4 Snowy Cabin, all 7 found, complete overlay
const q = new URLSearchParams(location.search);
const shot = q.get('shot');
if (shot) {
  const wait = () => {
    if (!window.__game) { setTimeout(wait, 50); return; }
    apply();
  };
  const apply = () => {
    const g = window.__game;
    const { state, timer, hints, renderer, startScene, updateHud, showOverlay } = g;
    const markFound = (ids) => {
      for (const id of ids) {
        const d = state.diffs.find((x) => x.id === id);
        if (!d) continue;
        state.found.add(d.id);
        renderer.addRing(d, performance.now());
      }
    };
    if (shot === 'cover') {
      startScene(2);
      state.score = 350;
      timer.left = 107; // 1:47
      markFound(['boro-sun', 'boro-birds', 'boro-mist']);
    } else if (shot === 'reef') {
      startScene(1);
      state.score = 225;
      timer.left = 64;
      markFound(['reef-fish', 'reef-bubble']);
    } else if (shot === 'market') {
      startScene(3);
      state.score = 480;
      timer.left = 81;
      markFound(['mkt-lantern', 'mkt-cat', 'mkt-bulb', 'mkt-moon']);
    } else if (shot === 'complete') {
      startScene(4);
      state.score = 1240;
      timer.left = 48; // 0:48 — matches the +96 time bonus (48s x 2)
      timer.stop();
      for (const d of state.diffs) {
        state.found.add(d.id);
        renderer.addRing(d, performance.now());
      }
      state.screen = 'sceneComplete';
      document.getElementById('complete-title').textContent = 'Snowy Cabin complete!';
      document.getElementById('complete-score').textContent = 'Score 1240  ·  Time bonus +96';
      document.getElementById('complete-found').textContent = 'All 7 differences found';
      document.getElementById('btn-next').textContent = 'See Final Score →';
      showOverlay('overlay-complete');
    }
    hints.reset();
    updateHud();
  };
  wait();
}
