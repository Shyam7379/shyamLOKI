import { useEffect } from 'react';

/**
 * Freezes the page behind the mobile navigation drawer.
 *
 * Uses `position: fixed` on <body> plus a compensating top offset rather than
 * `overflow: hidden`, because `overflow: hidden` alone still allows the page to
 * scroll on iOS Safari. The scroll position is restored on unlock.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      // Restore without animating the jump back.
      window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
    };
  }, [locked]);
}
