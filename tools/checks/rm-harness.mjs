/**
 * tools/checks/rm-harness.mjs
 * =============================================================================
 * Reduced-motion harness.
 *
 *   npm run build && npm run check:rm
 *
 * WHY THIS EXISTS
 * `prefers-reduced-motion` is an OS-level setting. Chrome exposes
 * `--force-prefers-reduced-motion` at launch, but a headless/remote browser
 * cannot always be restarted with new flags — so this copies the built page and
 * patches `window.matchMedia` from JS so that the reduce query always answers
 * true. Every JS decision the site makes about motion then takes the reduced
 * branch, in a real browser, against the real production bundle.
 *
 * WHAT IT CANNOT TEST
 * The patch is JavaScript only. It does not change how the *CSS* engine
 * evaluates `@media (prefers-reduced-motion: reduce)`, so the CSS-side
 * kill-switch in `src/styles/base.css` is not exercised here — which is exactly
 * why the reveal components also reveal themselves from JS when the hook
 * reports reduced motion. Two independent paths; this proves one of them and the
 * stylesheet rule is verified by inspecting the emitted CSS for the
 * `[data-reveal]{opacity:1!important}` declaration.
 *
 * The generated file is disposable — it lives in `dist/` and the next build
 * wipes it.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const BUILT = 'dist/index.html';
const OUT = 'dist/rm-test.html';

if (!existsSync(BUILT)) {
  console.error(`✗ ${BUILT} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const PATCH = `    <script>
      // Injected by tools/checks/rm-harness.mjs — forces every JS motion check
      // on the page to take its reduced branch. Must run before the app bundle,
      // which is why it is the first script in <head>.
      (function () {
        var QUERY = '(prefers-reduced-motion: reduce)';
        var native = window.matchMedia.bind(window);
        window.matchMedia = function (q) {
          var mql = native(q);
          if (q === QUERY) {
            Object.defineProperty(mql, 'matches', { get: function () { return true; } });
          }
          return mql;
        };
      })();
    </script>
`;

const html = readFileSync(BUILT, 'utf8');
const anchor = '<title>';
const at = html.indexOf(anchor);
if (at === -1) {
  console.error('✗ Could not find an injection point in the built HTML.');
  process.exit(1);
}

writeFileSync(OUT, html.slice(0, at) + PATCH + html.slice(at));
console.log(`▸ wrote ${OUT}`);
console.log('  serve dist/ (npm run preview) and open /rm-test.html');
console.log('  expected: hero still, no dust motes, no intro, motion button "Resume motion",');
console.log('            branch map replaced by its still frame, all [data-reveal] visible.');
