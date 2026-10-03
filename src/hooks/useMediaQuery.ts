import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` rather than useState + useEffect: it reads the current
 * value during render (so there is no wrong-value first paint and no cascading
 * re-render from an effect), and it is the API React actually documents for
 * subscribing to an external system like matchMedia.
 */
export function useMediaQuery(query: string): boolean {
  const mql = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return null;
    return window.matchMedia(query);
  }, [query]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!mql) return () => {};
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [mql],
  );

  const getSnapshot = useCallback(() => mql?.matches ?? false, [mql]);

  // Nothing is rendered on a server here, but keep the third argument honest.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
