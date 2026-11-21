// scenes.js — scene definitions: palettes, par times, and the canvas vector
// art for each scene. draw(ctx, variant) paints one panel (600 x 380).
// variant 0 = original (left), variant 1 = changed (right).

export const SCENES = [
  { id: 1, name: 'Coral Reef',        par: 90,  tag: 'Scene 1 of 4' },
  { id: 2, name: 'Borobudur Sunrise', par: 120, tag: 'Scene 2 of 4' },
  { id: 3, name: 'Night Market',      par: 120, tag: 'Scene 3 of 4' },
  { id: 4, name: 'Snowy Cabin',       par: 150, tag: 'Scene 4 of 4' },
];

export function sceneById(id) { return SCENES.find((s) => s.id === id); }

// ---- small drawing helpers ----
function grad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [o, c] of stops) g.addColorStop(o, c);
  return g;
}
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
}
function poly(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); ctx.fill();
}
function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}
function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2d2a4a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s, y); ctx.quadraticCurveTo(x - s / 2, y - s * 0.8, x, y);
  ctx.quadraticCurveTo(x + s / 2, y - s * 0.8, x + s, y);
  ctx.stroke();
}
function fish(ctx, x, y, s, body, flip) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  ellipse(ctx, 0, 0, s, s * 0.55, body);
  poly(ctx, [[-s * 0.8, 0], [-s * 1.5, -s * 0.6], [-s * 1.5, s * 0.6]], body);
  circle(ctx, s * 0.45, -s * 0.12, s * 0.12, '#ffffff');
  circle(ctx, s * 0.48, -s * 0.12, s * 0.06, '#1a1a2e');
  ctx.restore();
}

// ---- Scene 1: Coral Reef Day ----
function drawReef(ctx, v) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, 380, [[0, '#2ec4b6'], [0.55, '#0b7a9e'], [1, '#075a7d']]);
  ctx.fillRect(0, 0, 600, 380);
  // light rays
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  poly(ctx, [[120, 0], [180, 0], [260, 380], [180, 380]], 'rgba(255,255,255,0.08)');
  poly(ctx, [[340, 0], [380, 0], [470, 380], [410, 380]], 'rgba(255,255,255,0.07)');
  // sand
  ctx.fillStyle = '#e8d5a3'; ctx.beginPath();
  ctx.moveTo(0, 310); ctx.quadraticCurveTo(150, 295, 300, 308);
  ctx.quadraticCurveTo(450, 320, 600, 305); ctx.lineTo(600, 380); ctx.lineTo(0, 380);
  ctx.closePath(); ctx.fill();
  ellipse(ctx, 120, 350, 40, 8, '#d9c48d');
  ellipse(ctx, 420, 360, 55, 9, '#d9c48d');
  // pink coral (tall in v0, short in v1)
  const coralTop = v === 0 ? 195 : 245;
  ctx.strokeStyle = '#ff6b9d'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(90, 305); ctx.quadraticCurveTo(80, 260, 88, coralTop); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(90, 300); ctx.quadraticCurveTo(105, 265, 118, 235); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(88, 290); ctx.quadraticCurveTo(70, 255, 60, 230); ctx.stroke();
  circle(ctx, 88, coralTop, 7, '#ff8fb3');
  circle(ctx, 118, 235, 6, '#ff8fb3');
  circle(ctx, 60, 230, 6, '#ff8fb3');
  // purple coral right
  ctx.strokeStyle = '#9b5de5'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(560, 308); ctx.quadraticCurveTo(555, 270, 565, 240); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(558, 295); ctx.quadraticCurveTo(575, 265, 585, 245); ctx.stroke();
  circle(ctx, 565, 240, 6, '#b983ff');
  // seaweed
  ctx.strokeStyle = '#2a9d6b'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(30, 320); ctx.quadraticCurveTo(20, 280, 32, 245); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(45, 320); ctx.quadraticCurveTo(55, 285, 48, 255); ctx.stroke();
  // orange fish — removed in v1
  if (v === 0) fish(ctx, 150, 120, 22, '#ff8c42', false);
  // always-present blue fish
  fish(ctx, 400, 180, 16, '#4cc9f0', true);
  fish(ctx, 250, 88, 13, '#90e0ef', false);
  fish(ctx, 430, 90, 12, '#ffd166', true);
  // bubbles: 3 in v0, 2 in v1 (the one at 300,150 is gone in v1)
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2;
  for (const [bx, by, br] of [[288, 138, 7], [312, 168, 9], [296, 195, 6]]) {
    ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.stroke();
  }
  if (v === 0) { ctx.beginPath(); ctx.arc(300, 150, 8, 0, Math.PI * 2); ctx.stroke(); }
  // starfish — orange v0, purple v1
  star(ctx, 480, 318, 22, v === 0 ? '#ff7b00' : '#9b5de5');
  circle(ctx, 480, 318, 4, '#ffffff');
  // diver buoy + flag — red v0, yellow v1
  ellipse(ctx, 520, 108, 20, 10, '#ff595e');
  rect(ctx, 518, 62, 3, 40, '#5a3d2b');
  poly(ctx, [[521, 62], [548, 70], [521, 78]], v === 0 ? '#e63946' : '#ffd60a');
  // shell — moved: (200,340) in v0, (335,345) in v1
  const sh = v === 0 ? [200, 340] : [335, 345];
  ctx.fillStyle = '#f4a7c3';
  ctx.beginPath(); ctx.arc(sh[0], sh[1], 16, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d97b9e'; ctx.lineWidth = 2;
  for (const dx of [-8, 0, 8]) {
    ctx.beginPath(); ctx.moveTo(sh[0] + dx, sh[1] - 2); ctx.lineTo(sh[0] + dx * 0.5, sh[1] - 14); ctx.stroke();
  }
  // seahorse — added in v1 only
  if (v === 1) {
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(95, 245); ctx.quadraticCurveTo(78, 230, 88, 212);
    ctx.quadraticCurveTo(98, 198, 88, 190); ctx.stroke();
    circle(ctx, 86, 186, 9, '#ffb703');
    poly(ctx, [[78, 182], [70, 176], [82, 174]], '#ffb703');
    circle(ctx, 84, 184, 2, '#1a1a2e');
  }
  // pebbles
  circle(ctx, 260, 355, 6, '#b8a888');
  circle(ctx, 520, 350, 5, '#b8a888');
}

// ---- Scene 2: Borobudur Sunrise (hero) ----
function drawBorobudur(ctx, v) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, 380, [[0, '#3b1f5e'], [0.45, '#8e3a7d'], [0.8, '#e8833a'], [1, '#f7b733']]);
  ctx.fillRect(0, 0, 600, 380);
  // sun — lower in v1, soft radial glow (no hard halo disc)
  const sunY = v === 0 ? 82 : 125;
  const glow = ctx.createRadialGradient(470, sunY, 8, 470, sunY, 95);
  glow.addColorStop(0, 'rgba(255, 214, 90, 0.55)');
  glow.addColorStop(1, 'rgba(255, 214, 90, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(470, sunY, 95, 0, Math.PI * 2); ctx.fill();
  circle(ctx, 470, sunY, 27, '#ffd65a');
  ctx.strokeStyle = 'rgba(255, 214, 90, 0.9)'; ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(470 + Math.cos(a) * 33, sunY + Math.sin(a) * 33);
    ctx.lineTo(470 + Math.cos(a) * 42, sunY + Math.sin(a) * 42);
    ctx.stroke();
  }
  // birds — 3 in v0, 2 in v1
  bird(ctx, 128, 92, 12); bird(ctx, 156, 82, 11);
  if (v === 0) bird(ctx, 180, 96, 12);
  // distant hills, two layers
  ctx.fillStyle = '#5a3377';
  ctx.beginPath(); ctx.moveTo(0, 240); ctx.quadraticCurveTo(140, 195, 300, 235);
  ctx.quadraticCurveTo(450, 270, 600, 220); ctx.lineTo(600, 380); ctx.lineTo(0, 380); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a2b6b';
  ctx.beginPath(); ctx.moveTo(0, 275); ctx.quadraticCurveTo(180, 240, 360, 272);
  ctx.quadraticCurveTo(500, 295, 600, 262); ctx.lineTo(600, 380); ctx.lineTo(0, 380); ctx.closePath(); ctx.fill();
  // prayer flag pole — reaches down to the temple steps
  rect(ctx, 416, 140, 4, 115, '#5a3d2b');
  poly(ctx, [[420, 152], [455, 164], [420, 176]], v === 0 ? '#e63946' : '#4361ee');
  poly(ctx, [[420, 178], [450, 188], [420, 198]], v === 0 ? '#f4a261' : '#4cc9f0');
  // temple: three stepped terraces of stone
  rect(ctx, 60, 300, 480, 80, '#6b4a2f');
  rect(ctx, 60, 300, 480, 6, '#8a6d4b');
  rect(ctx, 110, 272, 380, 28, '#7d5a3a');
  rect(ctx, 110, 272, 380, 5, '#96794f');
  rect(ctx, 170, 248, 260, 24, '#8a6d4b');
  rect(ctx, 170, 248, 260, 5, '#a98a63');
  // morning mist hugging the temple base — gone in v1
  if (v === 0) {
    ellipse(ctx, 300, 302, 150, 13, 'rgba(255, 240, 220, 0.4)');
    ellipse(ctx, 180, 310, 90, 10, 'rgba(255, 240, 220, 0.3)');
    ellipse(ctx, 430, 308, 80, 9, 'rgba(255, 240, 220, 0.3)');
  }
  // arched niches on the front terrace wall
  ctx.fillStyle = '#4a3220';
  for (const nx of [100, 160, 440, 500]) {
    ctx.beginPath(); ctx.arc(nx, 330, 12, Math.PI, 0); ctx.fill();
    ctx.fillRect(nx - 12, 330, 24, 22);
  }
  // small bell stupas on the middle terrace — (180,262) gone in v1
  const bellStupa = (x, y, s) => {
    ellipse(ctx, x, y, 20 * s, 14 * s, '#a98a63');
    rect(ctx, x - 3, y - 22 * s, 6, 10 * s, '#a98a63');
    circle(ctx, x, y - 24 * s, 5 * s, '#d9b380');
  };
  if (v === 0) bellStupa(180, 262, 1);
  bellStupa(420, 262, 1);
  bellStupa(120, 296, 0.7);
  bellStupa(480, 296, 0.7);
  // main stupa: big bell dome + spire on the top terrace
  ellipse(ctx, 300, 240, 46, 30, '#a98a63');
  rect(ctx, 254, 238, 92, 10, '#8a6d4b');
  ellipse(ctx, 300, 236, 34, 20, '#b89a6e');
  rect(ctx, 296, 196, 8, 26, '#a98a63');
  ellipse(ctx, 300, 196, 12, 5, '#d9b380');
  rect(ctx, 298, 182, 4, 14, '#a98a63');
  circle(ctx, 300, 180, 6, '#ffd65a');
  // temple tree — tall v0, short v1
  const treeTop = v === 0 ? 205 : 248;
  ctx.strokeStyle = '#4a3220'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(520, 300); ctx.lineTo(520, treeTop + 25); ctx.stroke();
  circle(ctx, 520, treeTop, 26, '#2f7d4f');
  circle(ctx, 500, treeTop + 16, 18, '#3a9d63');
  circle(ctx, 540, treeTop + 16, 18, '#2f7d4f');
  circle(ctx, 520, treeTop + 34, 20, '#3a9d63');
  // step lantern — added in v1, glowing on the front terrace
  if (v === 1) {
    rect(ctx, 247, 318, 6, 16, '#3a2a1a');
    circle(ctx, 250, 314, 11, '#ffd65a');
    circle(ctx, 250, 314, 5, '#fff3b0');
    ctx.fillStyle = 'rgba(255, 214, 90, 0.2)';
    circle(ctx, 250, 314, 20, 'rgba(255, 214, 90, 0.2)');
  }
  // stone path to the temple
  ctx.fillStyle = '#c9b18a';
  poly(ctx, [[268, 380], [332, 380], [314, 336], [286, 336]], '#c9b18a');
  ctx.strokeStyle = '#a98a63'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(280, 352); ctx.lineTo(320, 352); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(286, 366); ctx.lineTo(314, 366); ctx.stroke();
  // grass tufts + flowers
  ctx.strokeStyle = '#3a9d63'; ctx.lineWidth = 3;
  for (const gx of [40, 570, 350]) {
    ctx.beginPath(); ctx.moveTo(gx, 380); ctx.lineTo(gx - 5, 362); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, 380); ctx.lineTo(gx + 5, 360); ctx.stroke();
  }
  circle(ctx, 90, 372, 4, '#ff5964');
  circle(ctx, 540, 368, 4, '#ffd166');
  circle(ctx, 370, 374, 4, '#ff8fb3');
}

// ---- Scene 3: Night Market ----
function drawMarket(ctx, v) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, 380, [[0, '#0f1b3d'], [0.6, '#1d2f5e'], [1, '#2c4a7c']]);
  ctx.fillRect(0, 0, 600, 380);
  // stars
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr] of [[40, 40, 2], [90, 90, 1.5], [300, 30, 2], [380, 110, 1.5], [500, 130, 2], [180, 40, 1.5], [560, 180, 1.5]]) {
    circle(ctx, sx, sy, sr, '#ffffff');
  }
  // moon — crescent v0, full v1
  circle(ctx, 540, 62, 24, '#ffeeb0');
  if (v === 0) circle(ctx, 530, 58, 20, '#1d2f5e');
  // kite — added in v1
  if (v === 1) {
    poly(ctx, [[220, 78], [238, 96], [220, 114], [202, 96]], '#ff5964');
    ctx.strokeStyle = '#ffe66d'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(220, 114); ctx.quadraticCurveTo(214, 130, 222, 142); ctx.stroke();
    poly(ctx, [[220, 126], [214, 132], [226, 132]], '#ffe66d');
  }
  // string lights — one bulb at (350,70) gone in v1
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(20, 55); ctx.quadraticCurveTo(300, 95, 580, 50); ctx.stroke();
  const bulbs = [[80, 62, '#ffd166'], [160, 70, '#ff5964'], [240, 76, '#06d6a0'], [350, 70, '#ffd166'], [440, 66, '#ff5964'], [520, 58, '#06d6a0']];
  for (const [bx, by, bc] of bulbs) {
    if (v === 1 && bx === 350) continue;
    circle(ctx, bx, by + 8, 7, bc);
    circle(ctx, bx, by + 8, 3, '#fff3b0');
  }
  // second, lower string of lights
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(60, 118); ctx.quadraticCurveTo(300, 140, 560, 112); ctx.stroke();
  for (const [bx, by, bc] of [[120, 124, '#06d6a0'], [260, 132, '#ffd166'], [420, 130, '#ff5964'], [540, 118, '#ffd166']]) {
    circle(ctx, bx, by + 7, 6, bc);
    circle(ctx, bx, by + 7, 2.5, '#fff3b0');
  }
  // paper lantern — red v0, green v1
  ellipse(ctx, 140, 150, 20, 26, v === 0 ? '#e63946' : '#06d6a0');
  ctx.strokeStyle = v === 0 ? '#b0232f' : '#04966f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(122, 142); ctx.lineTo(158, 142); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(122, 158); ctx.lineTo(158, 158); ctx.stroke();
  rect(ctx, 136, 122, 8, 6, '#ffd166');
  // left stall — awning red-white v0, blue-white v1
  const awn = v === 0 ? '#e63946' : '#4361ee';
  for (let i = 0; i < 5; i++) {
    rect(ctx, 230 + i * 28, 150, 28, 26, i % 2 === 0 ? awn : '#f8f4e8');
  }
  rect(ctx, 228, 176, 144, 8, '#5a3d2b');
  rect(ctx, 232, 184, 8, 130, '#5a3d2b');
  rect(ctx, 356, 184, 8, 130, '#5a3d2b');
  // stall signs
  ctx.fillStyle = '#2c1f14';
  rect(ctx, 252, 192, 96, 26, '#2c1f14');
  ctx.fillStyle = '#ffd166'; ctx.font = '700 15px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('SATE AYAM', 300, 210);
  rect(ctx, 452, 198, 84, 24, '#2c1f14');
  ctx.fillStyle = '#90e0ef';
  ctx.fillText('ES TEH', 494, 215);
  ctx.textAlign = 'left';
  // stall goods: fruit baskets
  ellipse(ctx, 270, 300, 30, 12, '#8a6d4b');
  circle(ctx, 255, 290, 7, '#ff5964'); circle(ctx, 270, 286, 7, '#ff8c42'); circle(ctx, 285, 290, 7, '#ffd166');
  ellipse(ctx, 330, 300, 30, 12, '#8a6d4b');
  circle(ctx, 318, 290, 6, '#06d6a0'); circle(ctx, 332, 287, 6, '#90e0ef');
  // jars and baskets on the ground between stalls
  ellipse(ctx, 385, 322, 14, 10, '#a9803e');
  rect(ctx, 378, 306, 14, 12, '#c98f4e');
  circle(ctx, 60, 330, 12, '#8a6d4b');
  circle(ctx, 80, 332, 9, '#a9803e');
  // right stall — green-yellow awning
  for (let i = 0; i < 4; i++) {
    rect(ctx, 440 + i * 26, 160, 26, 24, i % 2 === 0 ? '#2a9d6b' : '#ffd166');
  }
  rect(ctx, 438, 184, 108, 8, '#5a3d2b');
  rect(ctx, 442, 192, 8, 122, '#5a3d2b');
  rect(ctx, 538, 192, 8, 122, '#5a3d2b');
  ellipse(ctx, 492, 300, 32, 12, '#8a6d4b');
  circle(ctx, 480, 290, 6, '#ff5964'); circle(ctx, 495, 287, 6, '#ffd166'); circle(ctx, 508, 291, 6, '#e63946');
  // crates + orange cat — gone in v1
  rect(ctx, 400, 300, 34, 22, '#a9803e');
  rect(ctx, 400, 300, 34, 4, '#8a6d4b');
  if (v === 0) {
    ellipse(ctx, 417, 292, 16, 10, '#ff8c42');
    circle(ctx, 430, 282, 9, '#ff8c42');
    poly(ctx, [[424, 276], [428, 268], [432, 276]], '#ff8c42');
    circle(ctx, 433, 281, 1.5, '#1a1a2e');
    ctx.strokeStyle = '#ff8c42'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(402, 292); ctx.quadraticCurveTo(392, 288, 394, 278); ctx.stroke();
  }
  // becak — 3 wheels v0, 2 wheels v1 (extra wheel at 458,306 in v0)
  ctx.fillStyle = '#2a9d6b';
  ellipse(ctx, 494, 298, 30, 18, '#2a9d6b');
  poly(ctx, [[468, 298], [520, 298], [508, 264], [480, 264]], '#ef476f');
  rect(ctx, 484, 250, 26, 8, '#ef476f');
  ctx.strokeStyle = '#5a3d2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(520, 298); ctx.lineTo(534, 282); ctx.stroke();
  circle(ctx, 478, 320, 12, '#1a1a2e');
  circle(ctx, 512, 320, 12, '#1a1a2e');
  if (v === 0) circle(ctx, 458, 306, 10, '#1a1a2e');
  ctx.strokeStyle = '#5a3d2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(494, 316); ctx.lineTo(494, 330); ctx.stroke();
  // street
  ctx.fillStyle = '#1a2440'; ctx.fillRect(0, 330, 600, 50);
  ctx.fillStyle = 'rgba(255, 209, 102, 0.15)';
  ellipse(ctx, 300, 352, 180, 10, 'rgba(255, 209, 102, 0.15)');
}

// ---- Scene 4: Snowy Cabin Night ----
function drawSnow(ctx, v) {
  ctx.fillStyle = grad(ctx, 0, 0, 0, 380, [[0, '#0a1230'], [0.6, '#1c3a6e'], [1, '#2c5a8e']]);
  ctx.fillRect(0, 0, 600, 380);
  // stars
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr] of [[50, 50, 2], [120, 30, 1.5], [220, 70, 2], [420, 40, 1.5], [520, 90, 2], [580, 40, 1.5], [180, 120, 1.5]]) {
    circle(ctx, sx, sy, sr, '#ffffff');
  }
  // aurora — gone in v1
  if (v === 0) {
    ctx.fillStyle = 'rgba(110, 231, 183, 0.45)';
    ctx.beginPath(); ctx.moveTo(60, 80);
    ctx.quadraticCurveTo(200, 30, 340, 70); ctx.quadraticCurveTo(460, 100, 560, 55);
    ctx.lineTo(560, 85); ctx.quadraticCurveTo(440, 125, 320, 95); ctx.quadraticCurveTo(200, 65, 60, 105);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(150, 240, 220, 0.35)';
    ctx.beginPath(); ctx.moveTo(120, 110);
    ctx.quadraticCurveTo(280, 75, 460, 105); ctx.lineTo(460, 125);
    ctx.quadraticCurveTo(280, 95, 120, 128); ctx.closePath(); ctx.fill();
  }
  // moon
  circle(ctx, 540, 55, 20, '#f8f4e8');
  circle(ctx, 532, 50, 4, '#d9d2b8');
  circle(ctx, 546, 62, 3, '#d9d2b8');
  // snowy ground
  ctx.fillStyle = '#eaf2fb'; ctx.beginPath();
  ctx.moveTo(0, 320); ctx.quadraticCurveTo(200, 305, 400, 318);
  ctx.quadraticCurveTo(520, 328, 600, 315); ctx.lineTo(600, 380); ctx.lineTo(0, 380);
  ctx.closePath(); ctx.fill();
  // snow pile — big v0, small v1
  ellipse(ctx, 180, 350, v === 0 ? 55 : 28, v === 0 ? 20 : 11, '#ffffff');
  // pines — extra one at (120,282) in v1 only
  const pines = [[80, 300, 1], [560, 292, 1.1]];
  if (v === 1) pines.push([120, 282, 0.85]);
  for (const [px, py, ps] of pines) {
    ctx.fillStyle = '#1d5c3a';
    poly(ctx, [[px, py - 70 * ps], [px - 26 * ps, py], [px + 26 * ps, py]], '#1d5c3a');
    poly(ctx, [[px, py - 95 * ps], [px - 20 * ps, py - 30 * ps], [px + 20 * ps, py - 30 * ps]], '#267349');
    rect(ctx, px - 4, py, 8, 12, '#5a3d2b');
    circle(ctx, px - 10, py - 40 * ps, 3, '#ffffff');
    circle(ctx, px + 12, py - 20 * ps, 3, '#ffffff');
  }
  // cabin
  rect(ctx, 240, 200, 120, 100, '#7d4e2d');
  poly(ctx, [[225, 205], [375, 205], [300, 165]], '#ffffff');
  poly(ctx, [[232, 205], [368, 205], [300, 172]], '#c9d6e8');
  rect(ctx, 262, 168, 12, 40, '#5a3d2b');
  // chimney smoke — gone in v1
  if (v === 0) {
    ctx.fillStyle = 'rgba(230, 235, 245, 0.85)';
    circle(ctx, 288, 148, 9, 'rgba(230, 235, 245, 0.85)');
    circle(ctx, 296, 128, 12, 'rgba(230, 235, 245, 0.75)');
    circle(ctx, 306, 106, 15, 'rgba(230, 235, 245, 0.6)');
    circle(ctx, 300, 92, 10, 'rgba(230, 235, 245, 0.5)');
  }
  // door
  rect(ctx, 288, 252, 26, 48, '#4a3220');
  circle(ctx, 308, 278, 3, '#ffd166');
  // window — lit yellow v0, dark v1
  rect(ctx, 250, 222, 30, 26, '#2c1f14');
  rect(ctx, 252, 224, 26, 22, v === 0 ? '#ffd65a' : '#1d2f4e');
  ctx.strokeStyle = '#2c1f14'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(265, 224); ctx.lineTo(265, 246); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(252, 235); ctx.lineTo(278, 235); ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = 'rgba(255, 214, 90, 0.25)';
    ellipse(ctx, 265, 235, 40, 30, 'rgba(255, 214, 90, 0.25)');
  }
  // snowman — hat red v0, green v1
  circle(ctx, 480, 322, 22, '#ffffff');
  circle(ctx, 480, 296, 16, '#ffffff');
  circle(ctx, 480, 276, 12, '#ffffff');
  circle(ctx, 476, 274, 2, '#1a1a2e'); circle(ctx, 484, 274, 2, '#1a1a2e');
  poly(ctx, [[480, 278], [492, 280], [480, 282]], '#ff8c42');
  rect(ctx, 470, 258, 20, 8, v === 0 ? '#e63946' : '#06d6a0');
  rect(ctx, 474, 250, 12, 9, v === 0 ? '#e63946' : '#06d6a0');
  ctx.strokeStyle = '#5a3d2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(464, 296); ctx.lineTo(448, 286); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(496, 296); ctx.lineTo(512, 286); ctx.stroke();
  // deer — moved: (420,330) v0, (525,338) v1
  const d = v === 0 ? [420, 330] : [525, 338];
  ctx.fillStyle = '#8a6d4b';
  ellipse(ctx, d[0], d[1], 18, 11, '#8a6d4b');
  circle(ctx, d[0] + 18, d[1] - 12, 8, '#8a6d4b');
  poly(ctx, [[d[0] + 22, d[1] - 18], [d[0] + 26, d[1] - 26], [d[0] + 18, d[1] - 20]], '#8a6d4b');
  ctx.strokeStyle = '#8a6d4b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(d[0] - 12, d[1] + 8); ctx.lineTo(d[0] - 12, d[1] + 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(d[0] + 12, d[1] + 8); ctx.lineTo(d[0] + 12, d[1] + 20); ctx.stroke();
  ctx.strokeStyle = '#5a3d2b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(d[0] + 14, d[1] - 18); ctx.lineTo(d[0] + 10, d[1] - 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(d[0] + 20, d[1] - 18); ctx.lineTo(d[0] + 22, d[1] - 30); ctx.stroke();
  // falling snow dots
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (const [fx, fy] of [[70, 140], [150, 90], [250, 160], [380, 110], [460, 150], [540, 200], [100, 220], [330, 60]]) {
    circle(ctx, fx, fy, 2.5, 'rgba(255,255,255,0.8)');
  }
}

// ---- dispatcher ----
export function drawScene(ctx, sceneId, variant) {
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, 600, 380); ctx.clip();
  if (sceneId === 1) drawReef(ctx, variant);
  else if (sceneId === 2) drawBorobudur(ctx, variant);
  else if (sceneId === 3) drawMarket(ctx, variant);
  else if (sceneId === 4) drawSnow(ctx, variant);
  ctx.restore();
}
