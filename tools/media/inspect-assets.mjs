/**
 * tools/media/inspect-assets.mjs
 *
 * Builds a contact sheet of candidate source assets so a human (or the agent) can
 * visually verify what each downloaded file actually contains before it is used on
 * the site. Nothing here ships to production — it only writes to public/_staging/.
 *
 * Usage:  FFMPEG=/path/to/ffmpeg.exe node tools/media/inspect-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const FFMPEG = process.env.FFMPEG;
if (!FFMPEG) throw new Error('Set FFMPEG=/path/to/ffmpeg binary');

const SRC = 'C:/Users/shyam/Downloads';
const OUT = 'public/_staging';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/** Files worth eyeballing, grouped by the role they might play. */
const CANDIDATES = [
  // — supplied hero footage —
  ['hero-first', 'hero-loop-boomerang.mp4', 0.05],
  ['hero-mid', 'hero-loop-boomerang.mp4', 2.5],
  ['hero-last', 'hero-loop-boomerang.mp4', 10.1],
  ['hero-crossfade-mid', 'hero-loop-crossfade.mp4', 2.5],
  ['loki-emerald-loop', 'loki_emerald_loop.mp4', 2.0],
  ['loki-branch-mp4', 'loki  branch.mp4', 2.0],
  ['loki-infinity', 'loki_time_branch_infinity_stones.mp4', 2.0],
  // — candidate "time tree / branches" GIFs —
  ['gif-download', 'download.gif', 1.0],
  ['gif-shyam-loki', 'shyam_loki_animated.gif', 1.0],
  ['gif-shyam-loki-2x', 'shyam_loki_face_animated_2x.gif', 1.0],
  ['gif-emerald-throne', 'Loki’s Emerald Throne_ Nine Enchanted Moments.gif', 1.0],
  // — candidate project / brand imagery —
  ['dv-empire', 'dv empire.png', 0],
  ['dv-enclave', 'dv enclave.jpg', 0],
  ['dv-authai', 'dv authai.jpg', 0],
  ['thai-complex', 'thai complex.jpg', 0],
  ['emerald-floor', 'emerald-floor-drawing2.jpg', 0],
  ['construction-template', 'simply-construction-website-template_65882-original.webp', 0],
  ['spacelink-logo', 'SpaceLink logo demo.png', 0],
  ['loki-tendrils', 'Emerald Loki Among Mystical Tendrils.png', 0],
  ['triptych', 'Three-View Portrait Triptych.png', 0],
  ['chatgpt-oct2', 'ChatGPT Image Oct 2, 2026, 02_10_28 PM.png', 0],
  ['screenshot-desktop', 'Screenshot 2026-10-02 140732.png', 0],
  ['whatsapp-oct1', 'WhatsApp Image 2026-10-01 at 4.10.17 PM.jpeg', 0],
  ['wa-portrait', 'WhatsApp Image 2026-10-01 at 3.34.28 PM.jpeg', 0],
];

const results = [];
for (const [name, file, at] of CANDIDATES) {
  const input = path.join(SRC, file);
  if (!existsSync(input)) {
    results.push(`<figure class="missing"><div class="ph">MISSING</div><figcaption>${name}<br>${file}</figcaption></figure>`);
    continue;
  }
  const out = path.join(OUT, `${name}.jpg`);
  try {
    execFileSync(
      FFMPEG,
      [
        '-hide_banner', '-loglevel', 'error', '-y',
        ...(at ? ['-ss', String(at)] : []),
        '-i', input,
        '-frames:v', '1',
        '-vf', 'scale=400:-2:flags=lanczos',
        '-q:v', '4',
        out,
      ],
      { stdio: 'pipe' },
    );
    results.push(`<figure><img src="/_staging/${name}.jpg" alt="${name}" loading="lazy"><figcaption>${name}<br><span>${file}</span></figcaption></figure>`);
  } catch (err) {
    results.push(`<figure class="missing"><div class="ph">FAILED</div><figcaption>${name}<br>${String(err).slice(0, 120)}</figcaption></figure>`);
  }
}

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Asset contact sheet</title>
<style>
  body{background:#0b0d0e;color:#e8e6df;font:13px/1.4 system-ui;margin:0;padding:20px}
  h2{font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#c9a961;margin:0 0 14px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px}
  figure{margin:0;background:#12171a;border:1px solid #26312f;border-radius:8px;overflow:hidden}
  img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#000}
  figcaption{padding:6px 8px;font-weight:600;color:#8ff0c4;font-size:11px}
  figcaption span{color:#7d8a86;font-weight:400}
  .ph{aspect-ratio:4/3;display:grid;place-items:center;color:#ff7b7b}
</style></head>
<body><h2>Asset contact sheet — ${CANDIDATES.length} candidates</h2>
<div class="grid">${results.join('\n')}</div></body></html>`;

writeFileSync(path.join(OUT, 'contact-sheet.html'), html);
console.log(`contact sheet: ${OUT}/contact-sheet.html (${results.length} entries)`);
