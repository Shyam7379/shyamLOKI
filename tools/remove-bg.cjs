/**
 * Removes the solid-black background from the Loki cursor JPG and saves it as
 * a transparent PNG in the public directory.
 *
 * Strategy: read every pixel — if R, G, and B are all below a threshold (near
 * black), set alpha to 0.  For pixels just above the threshold, apply a smooth
 * fade to avoid harsh edges.
 */
const sharp = require('sharp');
const path  = require('path');

const INPUT  = path.resolve(__dirname, '../public/media/hero/loki-cursor.png');
const OUTPUT = path.resolve(__dirname, '../public/media/hero/loki-cursor-transparent.png');

// Pixels darker than this (per channel) are fully transparent
const HARD_THRESHOLD = 30;
// Pixels between HARD and SOFT get a gradient alpha
const SOFT_THRESHOLD = 60;

async function main() {
  const image = sharp(INPUT).removeAlpha().ensureAlpha();
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image: ${width}×${height}, ${channels} channels`);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxChannel = Math.max(r, g, b);

    if (maxChannel < HARD_THRESHOLD) {
      // Pure black region → fully transparent
      data[i + 3] = 0;
    } else if (maxChannel < SOFT_THRESHOLD) {
      // Near-black → smooth fade
      const t = (maxChannel - HARD_THRESHOLD) / (SOFT_THRESHOLD - HARD_THRESHOLD);
      data[i + 3] = Math.round(t * 255);
    }
    // else: leave alpha at 255 (fully opaque)
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(OUTPUT);

  console.log(`✔ Transparent cursor saved to ${OUTPUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
