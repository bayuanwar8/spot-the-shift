# SPOT THE SHIFT

[![Bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bayuanwar8/spot-the-shift/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bayuanwar8/spot-the-shift/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

**4 worlds, 28 differences.** A spot-the-difference game that runs offline in a
desktop browser from static files. Two near-identical pictures side by side —
click a difference on either picture to ring it. Find all 7 before the timer
runs out.

## The worlds

1. **Coral Reef** — day, 90s, easy
2. **Borobudur Sunrise** — morning, 120s
3. **Night Market** — night, 120s
4. **Snowy Cabin** — night, 150s, tricky

## How it plays

- 7 named differences per scene: removed, recoloured, moved, resized, flipped, added
- Score: 100 per find, streak multiplier up to x3, time bonus on scene complete
- Wrong clicks cost 3 seconds and reset the streak
- 3 hints per scene (H), hover magnifier, crosshair cursor, pause (P), mute (M),
  restart scene (R), scene keys 1–4, Esc for the menu
- All art is code-drawn canvas vector — no images, no network, system fonts only

## Run it

```sh
node serve.ts   # http://127.0.0.1:8085/
```

Entry for the make.fun bounty
[best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
