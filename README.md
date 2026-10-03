# Shyam V. — portfolio

A cinematic single-page portfolio for **Shyam V., Full Stack Developer**, built around a
"God of Stories / Sacred Timeline" visual idea: the hero is a video of Shyam standing
among glowing branches, and every project is treated as a branch he chose to take.

Everything on the page is real — real college, real internship, real repositories, real
contact details. There is no lorem ipsum, no invented metric, no dead link, and no
placeholder screenshot. Where something could not be verified, the page says so instead
of inventing it (see [Honest limits](#honest-limits)).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5180
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 5180 |
| `npm run build` | Typecheck (`tsc -b`) then production build into `dist/` |
| `npm run preview` | Serve the built `dist/` (used at port 5190 during verification) |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint over the source |
| `npm run media` | Rebuild every derived image and video (needs ffmpeg, see below) |
| `npm run brand` | Regenerate favicon + PNG icons from one vector source |
| `npm run check:rm` | Write `dist/rm-test.html`, a copy of the build with reduced motion forced |

Stack: **React 19 + TypeScript 5.9 + Vite 8**, no UI or animation library. Fonts are
self-hosted through `@fontsource` (Cinzel for display, Inter for body, JetBrains Mono for
labels and readouts) so the page makes no third-party request at runtime.

---

## Layout

```
index.html                  SEO/OG metadata, JSON-LD, two media-qualified poster preloads,
                            a <noscript> fallback with the real contact details
public/                     favicon, PNG icons, manifest, og-image, and /media (all derived)
src/
  styles/                   tokens.css (design system) · base.css · components.css
  data/                     profile.ts · projects.ts · skills.ts · experience.ts · media.ts
  hooks/                    useMediaQuery · usePrefersReducedMotion · useScrollSpy ·
                            useBodyScrollLock · useCopyToClipboard
  lib/observer.ts           one shared IntersectionObserver for every scroll reveal
  components/                ui/, brand/, projects/ — the reusable pieces
  sections/                 Hero · Navbar · About · Skills · Projects · Experience ·
                            Contact · Footer · Preloader
tools/
  media/build-media.mjs     the video/image pipeline
  media/build-brand.mjs     icon generation (+ a drift check against the React mark)
  media/brand/glyph.svg     the single vector source for the mark
  checks/rm-harness.mjs     the reduced-motion harness
assets-source/originals/    pristine supplied media — never written to by any script
```

---

## The media pipeline

All supplied media was processed by `tools/media/build-media.mjs`, which never modifies its
inputs. Run it with:

```bash
FFMPEG=/path/to/ffmpeg npm run media
```

ffmpeg is not vendored: the script uses `$FFMPEG` (or `ffmpeg` on `PATH`). The originals it
reads come from `$SRC` (default `assets-source/originals`, i.e. the hero video) and `$RAW`
(default `C:/Users/shyam/Downloads`, i.e. the supplied GIF and stills) — point those
environment variables at wherever the files live if you re-run it elsewhere.

What it produces, and the decisions behind it:

**Hero video.** The supplied master (`hero-loop-boomerang.mp4`, 832×464, 24 fps) is a
boomerang — the forward pass played back in reverse and concatenated — so the loop seam is
continuous by construction (measured: SSIM 0.869 / PSNR 29.1 dB between the first and last
frame). It is therefore re-encoded **frame for frame, in order**: nothing is retimed,
reversed, cross-faded or duplicated.

At 832 pixels wide the master is softer than any modern display, so a **2× Lanczos resample
plus a luma-only unsharp pass** is baked into the file
(`scale=…:flags=lanczos,unsharp=5:5:0.7:5:5:0.0`), A/B tested against a bilinear control and
a denoise variant that was rejected for making skin look waxy. This is classical resampling
and sharpening — **not AI super-resolution**. No detail is generated and the subject is not
altered; 832×464 remains the honest ceiling of what the footage contains.

Two encodes ship so phones never download the desktop master (1440-wide CRF 26 and
1280-wide CRF 26, both `yuv420p`, `+faststart`, silent, and never overlapping).

**Posters.** Extracted from `t=0`, so the poster is pixel-identical to the first video frame
and the poster→video handover is invisible.

**The time-branches animation.** The supplied `shyam_loki_face_animated_2x.gif` (1106×618,
39 frames, 3.9 MB) is re-containered as an animated WebP — same frames, same timing, same
infinite loop, 462 KB — with a static poster WebP for reduced-motion and as a fallback.

**Stills.** Project photography, the About portrait (1× and 2×) and the atmospheric
backdrops are converted to WebP at sensible display widths with metadata stripped.

---

## The brand mark

`tools/media/brand/glyph.svg` is the one place the mark is drawn as vector art: an "S" spine
with three branches forking off it into nodes, inset to 74% so it survives being masked.
`npm run brand` composes it onto a rounded tile for `public/favicon.svg` and onto a
full-bleed square for `apple-touch-icon.png`, `icon-192.png` and `icon-512.png` (rasterised
with `@resvg/resvg-js`, which implements the real SVG spec rather than a hand-rolled path
flattener).

The same drawing also exists as React in `src/components/brand/Monogram.tsx`, where it
inherits `currentColor` so it can be gold in the nav and emerald in the timeline.
`npm run brand` **compares the path data of the two files and fails** if they have drifted
apart, so the site mark and the tab icon can never become different drawings.

---

## The contact form

There is no backend, and the form does not pretend there is. It ships with:

```ts
const FORM_ENDPOINT = '';   // src/sections/Contact/Contact.tsx
```

- **Empty (what ships):** submitting builds a fully formatted, correctly percent-encoded
  `mailto:` draft to `shyamhere2077@gmail.com` and hands it to the visitor's mail client.
  Nothing is transmitted by the page, and the UI says exactly that.
- **Set it to a URL** and the form POSTs JSON to it instead, reporting real success and
  failure states. Any endpoint accepting a JSON `POST` works — Formspree, Web3Forms, Basin,
  or your own worker. Nothing else needs changing: validation, states and accessibility are
  already wired.

---

## Content you may want to edit

| Where | What |
| --- | --- |
| `src/data/projects.ts` | `repoUrl` / `liveUrl` are `null` for SpaceLink and Copycat, and `liveUrl` is `null` for all four. Paste a URL and the corresponding button appears — until then the card says the link is not public rather than showing a dead one. |
| `src/data/experience.ts` | Entries carry no dates. The `period?: string` field exists: add one to a `TIMELINE` entry and it renders next to the title. |
| `src/data/media.ts` | `PHONE_MEDIA_QUERY` is the single breakpoint that decides which hero video and which poster a phone gets. `index.html` mirrors it in its two preloads — change one without the others and a poster gets downloaded twice. |
| `index.html` | `og:image` is relative. Point it at an absolute deployed URL (and add `<link rel="canonical">`) once the domain exists — social crawlers generally require absolute URLs. |

---

## Verification

Run before shipping:

```bash
npm run typecheck && npm run lint && npm run build
```

**What was actually checked in a browser**, against the production build:

- Hero on desktop 1440×820, laptop 1280×800, tablet 768×1024 and phone 390×844 — the video
  autoplays muted, loops and pauses when scrolled away or backgrounded, no horizontal
  overflow at any width, and exactly one poster is fetched per width.
- **Reduced motion**: `npm run check:rm` forces every JS motion check onto its reduced
  branch. Verified there: hero held on the still frame, no dust motes, no intro overlay, the
  motion control reads "Resume motion" / `aria-pressed="true"`, the branch map falls back to
  its static frame, and **all 31 scroll-reveal targets are visible** rather than stuck at
  `opacity: 0`.
- **Keyboard**: first Tab reaches the skip link, then the nav in visual order; the mobile
  drawer traps focus, closes on Escape and returns focus to its toggle.
- **The form**: submitting empty reports three errors, sets `aria-invalid`, links each
  message with `aria-describedby` and moves focus to the first offending field; typing
  clears the error; an invalid address is rejected with its own message.
- **Deep links**: `#projects` (and the other five) open on their section, clear of the fixed
  nav, with the matching nav item highlighted.
- No console errors and no failed requests on a clean load; every asset referenced by
  `index.html` and `site.webmanifest` is present in `dist/`.

### Honest limits

- **The reduced-motion harness patches `matchMedia` in JavaScript only.** It cannot change
  how the CSS engine evaluates `@media (prefers-reduced-motion: reduce)`. That path is
  covered separately: the shipped CSS contains `[data-reveal]{opacity:1!important;
  transform:none!important}` inside the reduce block, which no non-important rule can
  override — and the reveal components *also* reveal themselves from JS when the hook reports
  reduced motion, so neither path is a single point of failure.
- **The valid submit of the contact form was not clicked** during verification, because on a
  machine with a mail client registered that opens the visitor's email app. Its `mailto:`
  construction was reviewed by reading the code; the invalid paths were exercised live.
- **Tablet portrait (768×1024) is the hero's weakest shape.** A 16:9 asset in a 3:4
  viewport keeps full frame height and crops horizontally to its middle ~42%, which reads as
  a close-up. It is intentional and legible, but it is a crop, not a composition.
- **No AI upscaling anywhere.** The hero enhancement is Lanczos + unsharp, described above.
- **One supplied asset was deliberately excluded**: the nebula/"time tree" GIF in the
  downloads is the Marvel series' own promotional footage, and the emerald-throne GIF is
  likewise copyrighted footage. Neither ships. The animation that is used is Shyam's own.
- **No live demo URLs could be verified** (the GitHub Pages path for the matrimony project
  404s), so none are shown.
