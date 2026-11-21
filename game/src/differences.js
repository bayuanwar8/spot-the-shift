// differences.js — the 28 differences, 7 per scene.
// Panel-local coords: panel is 600 x 380. x,y = position on the LEFT (original)
// panel; x2,y2 = position on the RIGHT (changed) panel, defaults to x,y.
// Types: removed, recoloured, moved, resized, flipped, added, changed.

export const PANEL_W = 600;
export const PANEL_H = 380;

export const DIFFS = {
  1: [
    { id: 'reef-fish',   name: 'Orange Fish',    x: 150, y: 120, r: 30, type: 'removed' },
    { id: 'reef-star',   name: 'Starfish Color', x: 480, y: 318, r: 28, type: 'recoloured' },
    { id: 'reef-bubble', name: 'Bubble Count',   x: 300, y: 150, r: 24, type: 'removed' },
    { id: 'reef-coral',  name: 'Coral Height',   x:  90, y: 280, r: 32, type: 'resized' },
    { id: 'reef-flag',   name: 'Buoy Flag',      x: 520, y:  82, r: 26, type: 'recoloured' },
    { id: 'reef-shell',  name: 'Shell Shift',    x: 200, y: 340, x2: 335, y2: 345, r: 24, type: 'moved' },
    { id: 'reef-horse',  name: 'Hidden Seahorse', x:  95, y: 220, r: 28, type: 'added' },
  ],
  2: [
    { id: 'boro-sun',    name: 'Sun Drop',       x: 470, y:  82, x2: 470, y2: 125, r: 32, type: 'moved' },
    { id: 'boro-stupa',  name: 'Stupa Count',    x: 180, y: 262, r: 26, type: 'removed' },
    { id: 'boro-birds',  name: 'Bird Flock',     x: 150, y:  92, r: 24, type: 'removed' },
    { id: 'boro-flag',   name: 'Prayer Flag',    x: 420, y: 180, r: 24, type: 'recoloured' },
    { id: 'boro-mist',   name: 'Morning Mist',   x: 300, y: 300, r: 32, type: 'removed' },
    { id: 'boro-tree',   name: 'Temple Tree',    x: 520, y: 282, r: 30, type: 'resized' },
    { id: 'boro-lantern', name: 'Step Lantern',  x: 250, y: 332, r: 24, type: 'added' },
  ],
  3: [
    { id: 'mkt-lantern', name: 'Lantern Color',  x: 140, y: 150, r: 26, type: 'recoloured' },
    { id: 'mkt-cat',     name: 'Market Cat',     x: 420, y: 300, r: 26, type: 'removed' },
    { id: 'mkt-awning',  name: 'Awning Stripes', x: 300, y: 180, r: 28, type: 'recoloured' },
    { id: 'mkt-becak',   name: 'Becak Wheel',    x: 480, y: 300, r: 26, type: 'removed' },
    { id: 'mkt-bulb',    name: 'String Light',   x: 350, y:  70, r: 22, type: 'removed' },
    { id: 'mkt-moon',    name: 'Moon Phase',     x: 540, y:  62, r: 28, type: 'changed' },
    { id: 'mkt-kite',    name: 'Sky Kite',       x: 220, y:  92, r: 26, type: 'added' },
  ],
  4: [
    { id: 'snow-smoke',  name: 'Chimney Smoke',  x: 300, y:  92, r: 26, type: 'removed' },
    { id: 'snow-window', name: 'Window Light',   x: 300, y: 222, r: 24, type: 'recoloured' },
    { id: 'snow-hat',    name: 'Snowman Hat',    x: 480, y: 300, r: 24, type: 'recoloured' },
    { id: 'snow-pine',   name: 'Extra Pine',     x: 120, y: 282, r: 26, type: 'added' },
    { id: 'snow-aurora', name: 'Aurora Band',    x: 300, y:  62, r: 30, type: 'removed' },
    { id: 'snow-deer',   name: 'Wandering Deer', x: 420, y: 330, x2: 525, y2: 338, r: 26, type: 'moved' },
    { id: 'snow-pile',   name: 'Snow Pile',      x: 180, y: 350, r: 28, type: 'resized' },
  ],
};

export function diffsFor(sceneId) {
  return DIFFS[sceneId] || [];
}

export function diffPos(diff, panel) {
  // panel: 0 = left (original), 1 = right (changed)
  if (panel === 1 && diff.x2 !== undefined) return { x: diff.x2, y: diff.y2 };
  return { x: diff.x, y: diff.y };
}
