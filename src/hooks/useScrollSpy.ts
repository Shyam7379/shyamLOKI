import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently under the navigation bar.
 *
 * Deliberately scroll-position based rather than IntersectionObserver based:
 * with six tall sections, IO reports several as intersecting at once and the
 * "active" indicator jitters between them. Reading the last section whose top
 * has passed the nav gives one unambiguous answer.
 *
 * Two details that matter, both learned the hard way:
 *
 *  1. The page is not necessarily at full height when this first measures. Any
 *     moment where <body> is taken out of flow (the mobile menu locks scroll by
 *     fixing the body) collapses the document to one viewport, which makes the
 *     "are we at the bottom?" test below return true and jump the indicator to
 *     the last section. So the bottom test is gated on the page actually being
 *     taller than the viewport, and a ResizeObserver re-measures whenever the
 *     document height changes for any reason.
 *
 *  2. Fonts and lazy media can still change section positions after mount, which
 *     is the other reason to re-measure on resize rather than trusting a single
 *     reading taken during the first commit.
 *
 *  3. Sub-pixel landings. An anchor jump parks the section top on
 *     `scroll-padding-top` (96px), and on a fractional-pixel layout that reads
 *     back as 96.375 — a hair past the line, so the *previous* section stayed
 *     highlighted after the visitor clicked the current one. The tolerance
 *     below absorbs the fraction; at 8px it is far too small to make the
 *     indicator feel early while scrolling.
 */
const ARRIVAL_TOLERANCE = 8;

export function useScrollSpy(ids: readonly string[], navOffset = 96): string {
  const [active, setActive] = useState(() => ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const { scrollY } = window;
      const viewport = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      let current = ids[0] ?? '';

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (top - navOffset - ARRIVAL_TOLERANCE <= scrollY) current = id;
      }

      // Only treat the bottom of the page as "the last section" when the page
      // is genuinely scrollable — otherwise every page load would start there.
      const scrollable = pageHeight - viewport;
      if (scrollable > 8 && scrollY >= scrollable - 4) {
        current = ids[ids.length - 1] ?? current;
      }

      setActive(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Re-measure when the document's height changes (lazy images, font swap,
    // an expanding case-notes panel, the mobile scroll lock being released).
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(document.documentElement);
    if (document.body) ro?.observe(document.body);

    // Web fonts landing after first paint move everything below the fold.
    void document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
    };
  }, [ids, navOffset]);

  return active;
}
