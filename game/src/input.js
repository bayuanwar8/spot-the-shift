// input.js — mouse + keyboard. Crosshair cursor over panels, click a
// difference on either panel, magnifier tracking.
import { diffPos } from './differences.js';
import { LAYOUT } from './render.js';

export class Input {
  constructor(canvas, renderer, callbacks) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.cb = callbacks; // { onFind(diff), onWrong(), onKey(key) }
    this.bind();
  }
  bind() {
    this.canvas.addEventListener('mousemove', (e) => {
      const p = this.toCanvas(e);
      this.renderer.mouse.x = p.x;
      this.renderer.mouse.y = p.y;
      this.renderer.mouse.inside = true;
      this.canvas.style.cursor = this.overPanel(p) ? 'crosshair' : 'default';
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.renderer.mouse.inside = false;
    });
    this.canvas.addEventListener('click', (e) => {
      const p = this.toCanvas(e);
      this.cb.onClick(p.x, p.y);
    });
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.cb.onKey(e.key);
    });
  }
  toCanvas(e) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (this.canvas.width / r.width),
      y: (e.clientY - r.top) * (this.canvas.height / r.height),
    };
  }
  overPanel(p) {
    const { leftX, rightX, panelY, panelW, panelH } = LAYOUT;
    const inY = p.y >= panelY && p.y <= panelY + panelH;
    return inY && ((p.x >= leftX && p.x <= leftX + panelW) || (p.x >= rightX && p.x <= rightX + panelW));
  }
  // Which panel (0/1) and panel-local point, or null when off-panel.
  panelHit(x, y) {
    const { leftX, rightX, panelY, panelW, panelH } = LAYOUT;
    if (y < panelY || y > panelY + panelH) return null;
    if (x >= leftX && x <= leftX + panelW) return { panel: 0, px: x - leftX, py: y - panelY };
    if (x >= rightX && x <= rightX + panelW) return { panel: 1, px: x - rightX, py: y - panelY };
    return null;
  }
  // Find the unfound diff under a click, or null.
  pickDiff(x, y, diffs, foundIds) {
    const hit = this.panelHit(x, y);
    if (!hit) return null;
    for (const d of diffs) {
      if (foundIds.has(d.id)) continue;
      const pos = diffPos(d, hit.panel);
      const dx = hit.px - pos.x, dy = hit.py - pos.y;
      if (dx * dx + dy * dy <= d.r * d.r) return d;
    }
    return null;
  }
}
