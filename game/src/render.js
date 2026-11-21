// render.js — draws both panels, found rings, particles, hint pulse
// and the magnifier lens onto the game canvas.
import { drawScene } from './scenes.js';
import { diffPos, PANEL_W, PANEL_H } from './differences.js';

export const LAYOUT = {
  leftX: 20, rightX: 660, panelY: 30, panelW: PANEL_W, panelH: PANEL_H,
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = []; // {x, y, vx, vy, life, color}
    this.ringAnims = []; // {diff, panel, born}
    this.mouse = { x: -1, y: -1, inside: false };
  }
  spawnBurst(panelX, panelY, x, y) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const sp = 1.2 + Math.random() * 2.2;
      this.particles.push({
        x: panelX + x, y: panelY + y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.6,
        life: 1, color: i % 3 === 0 ? '#ffd166' : (i % 3 === 1 ? '#06d6a0' : '#ff5964'),
      });
    }
  }
  addRing(diff, now) {
    this.ringAnims.push({ diff, born: now });
  }
  update(now) {
    const dt = 1 / 60;
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= dt * 1.6;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    this.ringAnims = this.ringAnims.filter((r) => now - r.born < 700);
  }
  draw(state, hints, now) {
    const { ctx, canvas } = this;
    const { leftX, rightX, panelY } = LAYOUT;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0e1424';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panel frames
    for (const px of [leftX, rightX]) {
      ctx.fillStyle = '#1b2440';
      ctx.fillRect(px - 6, panelY - 6, PANEL_W + 12, PANEL_H + 12);
    }
    // Scenes
    ctx.save(); ctx.translate(leftX, panelY); drawScene(ctx, state.sceneId, 0); ctx.restore();
    ctx.save(); ctx.translate(rightX, panelY); drawScene(ctx, state.sceneId, 1); ctx.restore();

    // Panel labels
    ctx.fillStyle = '#e8eaf2'; ctx.font = '600 15px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('LEFT — original', leftX, panelY - 12);
    ctx.fillText('RIGHT — spot the changes', rightX, panelY - 12);
    ctx.fillStyle = '#ffd166'; ctx.font = '700 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VS', 640, panelY + PANEL_H / 2);

    // Found rings on both panels
    for (const diff of state.foundList) {
      for (const [px, panel] of [[leftX, 0], [rightX, 1]]) {
        const pos = diffPos(diff, panel);
        const anim = this.ringAnims.find((r) => r.diff.id === diff.id);
        const grow = anim ? Math.min(1, (now - anim.born) / 350) : 1;
        const r = diff.r * (0.6 + 0.4 * grow);
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(px + pos.x, panelY + pos.y, r, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#06d6a0'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(px + pos.x, panelY + pos.y, r + 5, 0, Math.PI * 2); ctx.stroke();
        // green check
        ctx.strokeStyle = '#06d6a0'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px + pos.x - 9, panelY + pos.y);
        ctx.lineTo(px + pos.x - 2, panelY + pos.y + 7);
        ctx.lineTo(px + pos.x + 10, panelY + pos.y - 7);
        ctx.stroke();
      }
    }

    // Hint pulse
    const hintDiff = hints.current(now);
    if (hintDiff) {
      const pr = hints.pulseRadius(hintDiff, now);
      for (const [px, panel] of [[leftX, 0], [rightX, 1]]) {
        const pos = diffPos(hintDiff, panel);
        ctx.strokeStyle = 'rgba(255, 209, 102, 0.9)'; ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath(); ctx.arc(px + pos.x, panelY + pos.y, pr, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Scene progress strip below the panels
    const stripY = 440;
    ctx.fillStyle = '#141c33';
    ctx.fillRect(20, stripY, 1240, 56);
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    const names = ['1 · Coral Reef', '2 · Borobudur Sunrise', '3 · Night Market', '4 · Snowy Cabin'];
    names.forEach((n, i) => {
      const x = 48 + i * 310;
      const done = state.sceneId > i + 1;
      const current = state.sceneId === i + 1;
      ctx.fillStyle = done ? '#06d6a0' : current ? '#ffd166' : '#5a6b8a';
      ctx.beginPath(); ctx.arc(x, stripY + 28, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0e1424'; ctx.font = '700 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(done ? '✓' : String(i + 1), x, stripY + 32);
      ctx.fillStyle = current ? '#e8eaf2' : '#8a97b5'; ctx.font = '600 13px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(n, x + 18, stripY + 32);
    });

    // Magnifier lens (follows the mouse over either panel)
    if (this.mouse.inside && state.screen === 'play' && !state.paused) {
      this.drawLens();
    }
  }
  drawLens() {
    const { ctx } = this;
    const { leftX, rightX, panelY } = LAYOUT;
    const m = this.mouse;
    const panel = (m.x >= leftX && m.x <= leftX + PANEL_W) ? 0
      : (m.x >= rightX && m.x <= rightX + PANEL_W) ? 1 : -1;
    if (panel < 0 || m.y < panelY || m.y > panelY + PANEL_H) return;
    const R = 62, ZOOM = 1.8;
    const sx = (m.x - (panel === 0 ? leftX : rightX)) - R / ZOOM;
    const sy = (m.y - panelY) - R / ZOOM;
    ctx.save();
    ctx.beginPath(); ctx.arc(m.x, m.y, R, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(this.canvas, (panel === 0 ? leftX : rightX) + sx, panelY + sy, (R * 2) / ZOOM, (R * 2) / ZOOM,
      m.x - R, m.y - R, R * 2, R * 2);
    ctx.restore();
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(m.x, m.y, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(m.x - 8, m.y); ctx.lineTo(m.x + 8, m.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m.x, m.y - 8); ctx.lineTo(m.x, m.y + 8); ctx.stroke();
  }
}
