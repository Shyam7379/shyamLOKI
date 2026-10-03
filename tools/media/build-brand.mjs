/**
 * tools/media/build-brand.mjs
 * =============================================================================
 * Brand icons: one vector source, every raster size derived from it.
 *
 *   npm run brand
 *
 * INPUT
 *   tools/media/brand/glyph.svg   — the mark, tuned for small sizes
 *
 * OUTPUT
 *   public/favicon.svg            — rounded tile, for the browser tab
 *   public/apple-touch-icon.png   — 180x180, full-bleed square (iOS masks it)
 *   public/icon-192.png           — manifest icon
 *   public/icon-512.png           — manifest icon, also declared maskable
 *
 * WHY TWO TILES
 *   A tab favicon looks best with rounded corners, but a maskable/receipt icon
 *   is not allowed to have transparent corners — the OS crops it to its own
 *   shape and any transparency shows as a notch. So the same glyph is composed
 *   onto a rounded tile for the SVG, and onto a full-bleed square for the PNGs.
 *   The glyph itself is already inset to 74%, which keeps it inside the
 *   maskable safe zone, so it never touches the crop.
 *
 * WHY A CHECK
 *   The mark exists twice: as React in `src/components/brand/Monogram.tsx` and
 *   as vector art here. That duplication is deliberate — the React version
 *   inherits `currentColor`, the icon version is fixed-colour and heavier — but
 *   the *shapes* must not drift apart. The assertion below compares the path
 *   data of both files and fails the build if someone edits one and not the
 *   other.
 *
 * Rasterisation is done by @resvg/resvg-js, i.e. the real SVG spec rather than
 * a home-made path flattener: strokes, opacity and gradients all render the way
 * a browser would render them.
 */

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const GLYPH = 'tools/media/brand/glyph.svg';
const MONOGRAM = 'src/components/brand/Monogram.tsx';
const OUT = 'public';

const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} KB`;

/* ── 1. read the glyph ─────────────────────────────────────────────────────── */

/* Comments are stripped first: the file's own documentation quotes the marker
 * tag, and an indexOf that lands inside a comment would slice out an
 * unterminated document. Dropping them also keeps the composed SVGs smaller. */
const glyphFile = readFileSync(GLYPH, 'utf8');
const glyphBody = glyphFile.replace(/<!--[\s\S]*?-->/g, '');

// Everything from the marked group up to the closing </svg>. The mark group
// contains nested <g> elements, so this slices on the SVG terminator rather than
// pattern-matching balanced tags — no parsing library needed for one file.
// Prefix only (the tag carries a transform attribute), so the slice keeps it.
const start = glyphBody.indexOf('<g id="mark"');
const end = glyphBody.lastIndexOf('</svg>');
if (start === -1 || end === -1 || end < start) {
  console.error(`✗ Could not find <g id="mark"> in ${GLYPH}`);
  process.exit(1);
}
const mark = glyphBody
  .slice(start, end)
  .trim()
  // Stripping comments leaves their blank lines behind — collapse them, since
  // this text is pasted verbatim into a shipped icon file.
  .replace(/[ \t]*\n([ \t]*\n)+/g, '\n');

/* ── 2. integrity check against the React monogram ────────────────────────── */

const pathData = (text) => [...text.matchAll(/\sd="(M[^"]+)"/g)].map((m) => m[1]).sort();
const fromReact = pathData(readFileSync(MONOGRAM, 'utf8'));
const fromSvg = pathData(glyphBody);

if (fromReact.length !== fromSvg.length || fromReact.some((d, i) => d !== fromSvg[i])) {
  console.error(
    `✗ The mark has drifted: ${fromReact.length} path(s) in ${MONOGRAM}, ${fromSvg.length} in ${GLYPH}.\n` +
      '  Update both files together — the site mark and the icon must be the same drawing.',
  );
  process.exit(1);
}
console.log(`▸ mark geometry verified — ${fromSvg.length} paths match ${MONOGRAM}`);

/* ── 3. tiles ──────────────────────────────────────────────────────────────── */

const defs = `  <defs>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07231d" />
      <stop offset="100%" stop-color="#04070a" />
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.46" r="0.55">
      <stop offset="0%" stop-color="#2fa87a" stop-opacity="0.34" />
      <stop offset="100%" stop-color="#2fa87a" stop-opacity="0" />
    </radialGradient>
  </defs>`;

/** Rounded tile — a tab favicon, sitting on a light or dark tab bar. */
const roundedTile = `  <rect width="40" height="40" rx="8.5" fill="url(#tile)" />
  <rect width="40" height="40" rx="8.5" fill="url(#glow)" />
  <rect x="0.5" y="0.5" width="39" height="39" rx="8" fill="none" stroke="#2fa87a" stroke-opacity="0.32" />`;

/** Full-bleed square — for anything the OS will mask itself. */
const squareTile = `  <rect width="40" height="40" fill="url(#tile)" />
  <rect width="40" height="40" fill="url(#glow)" />`;

/** `head` is inserted directly after the opening tag — used for <title>. */
const compose = (tile, { attrs = '', head = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"${attrs}>\n${head}${defs}\n${tile}\n${mark}\n</svg>\n`;

/* ── 4. favicon.svg (rounded, hand-readable) ──────────────────────────────── */

const faviconPath = `${OUT}/favicon.svg`;
const favicon = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!--',
  '  GENERATED FILE — do not edit by hand.',
  '  Source: tools/media/brand/glyph.svg   Regenerate: npm run brand',
  '',
  '  The mark from src/components/brand/Monogram.tsx on a dark rounded tile, so',
  '  it stays legible in a light or dark tab bar. Strokes and nodes are heavier',
  '  than the in-app mark because the spine has to survive 16 device pixels.',
  '-->',
  compose(roundedTile, {
    attrs: ' width="40" height="40" role="img" aria-labelledby="favicon-title"',
    head: '  <title id="favicon-title">Shyam V.</title>\n',
  }),
].join('\n');

writeFileSync(faviconPath, favicon);

// Parse what was just written. A malformed favicon fails silently in a browser —
// the tab just shows a blank page icon — so the build asserts it here instead.
new Resvg(favicon, { fitTo: { mode: 'width', value: 40 } }).render();
console.log(`  ✓ ${faviconPath}  ${kb(faviconPath)}  (parses clean)`);

/* ── 5. PNG icons (full-bleed square) ─────────────────────────────────────── */

const squareSvg = compose(squareTile);

const pngs = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const png of pngs) {
  const resvg = new Resvg(squareSvg, {
    fitTo: { mode: 'width', value: png.size },
    // Belt and braces: even though the tile covers the whole viewBox, declare an
    // opaque background so the output can never carry an alpha channel that a
    // platform might composite onto white.
    background: '#04070a',
  });
  const out = `${OUT}/${png.name}`;
  writeFileSync(out, resvg.render().asPng());
  console.log(`  ✓ ${out}  ${png.size}x${png.size}  ${kb(out)}`);
}

console.log('\n▸ brand icons done\n');
