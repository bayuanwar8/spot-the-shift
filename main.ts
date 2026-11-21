// main.ts — SPOT THE SHIFT entry point for the make.fun grader.
// Packs the game into /output: copies game/ and screenshots/ beside this
// file, then writes /output/dossier.json with the vendored make.fun library.
// Runs on Node 22 with the standard library only; no network, no install.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so stale files never leak in.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// The playable game, exactly as it ships.
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });

// The maker's screenshots (3 or 4 renders of the game itself).
const shotsDir = join(repoRoot, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
} else {
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
}

// The dossier the judge reads: byte for byte what the library writes.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('SPOT THE SHIFT packed: ' + outDir + ' (dossier ' + dossier.length + ' bytes)');
