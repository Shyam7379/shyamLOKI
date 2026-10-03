/**
 * =============================================================================
 * MEDIA — provenance, and one deliberate licensing decision
 * =============================================================================
 * All media on this site comes from files Shyam supplied, derived by
 * `tools/media/build-media.mjs`. Originals are kept untouched in
 * `assets-source/originals/`.
 *
 * THE TIME-BRANCHES ANIMATION
 * Two candidates existed in the supplied assets:
 *
 *   1. `shyam_loki_face_animated_2x.gif`  (1106x618, 39 frames)
 *      Shyam's own footage — him among the glowing branching timelines.
 *      -> USED. Re-containered as an animated WebP (462 KB instead of 4 MB,
 *         identical frames, timing and infinite loop) with a static WebP
 *         poster for reduced-motion and as a fallback.
 *
 *   2. `download.gif`  (540x450, 10 MB)
 *      A nebula with a glowing tree structure — this is footage of the Marvel
 *      series' own time-tree visual, i.e. third-party promotional material.
 *      -> NOT USED, to respect the brief's instruction to avoid copyrighted
 *         Marvel artwork. It is 10 MB at 540x450 in any case.
 *         To switch to it anyway, swap `branches` below for `alternativeBranches`
 *         (after converting it to WebP for the sake of the page weight).
 * =============================================================================
 */

/**
 * The one breakpoint that decides what counts as a phone here: which hero video
 * file is fetched, and which still frame paints before it. `index.html` mirrors
 * the same number in its two media-qualified poster preloads, because the
 * preload is read from the HTML before any of this code runs.
 *
 * Change it in one place and not the others and the browser downloads a poster
 * it never displays.
 */
export const PHONE_MEDIA_QUERY = '(max-width: 47.999rem)';

export const heroMedia = {
  /** Desktop master. Unsharpened? No — Lanczos 2x + luma unsharp, see build-media.mjs */
  src: '/media/hero/hero-loop.mp4',
  /** Phones never download the desktop master. */
  srcMobile: '/media/hero/hero-loop-mobile.mp4',
  poster: '/media/hero/hero-poster.webp',
  /** 1280x714 — swapped in below `PHONE_MEDIA_QUERY`, never both. */
  posterMobile: '/media/hero/hero-poster-mobile.webp',
  /** Dimensions of the desktop encode, used for width/height + aspect-ratio. */
  width: 1440,
  height: 804,
  alt: 'Shyam V. standing among glowing emerald branches that fan out behind him like the branching timelines.',
} as const;

export const branches = {
  /** Animated — Shyam's own footage, re-encoded from the supplied GIF. */
  animated: '/media/timeline/timeline-branches.webp',
  /** Static first frame: used under prefers-reduced-motion, and as fallback. */
  still: '/media/timeline/timeline-branches-poster.webp',
  width: 1000,
  height: 559,
  alt: 'Animated branching timelines: lines of emerald light that split, curl and reconnect around a figure standing at their centre.',
} as const;

/** Kept for reference / future use. See the note above before enabling it. */
export const alternativeBranches = {
  animated: '/media/timeline/timeline-branches-alternate.webp',
  note: 'Marvel series footage located in the supplied downloads — not shipped.',
} as const;

export const atmosphere = {
  branchesWide: '/media/atmosphere/branches-wide.webp',
  tendrils: '/media/atmosphere/tendrils.webp',
} as const;
