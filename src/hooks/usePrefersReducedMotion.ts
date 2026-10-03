import { useMediaQuery } from './useMediaQuery';

/**
 * True when the visitor has asked their OS to reduce motion.
 *
 * CSS already neutralises every transition and animation under this setting,
 * but a few components animate *content* rather than decoration — the branching
 * timelines swap to a still frame, the hero stops drifting, the marquee stops.
 * Those are JS decisions, so they need the hook.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
