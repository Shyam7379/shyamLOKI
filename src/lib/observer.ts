/**
 * One IntersectionObserver for every scroll-reveal on the page.
 *
 * Creating an observer per element is the usual approach and it is wasteful —
 * with ~40 reveal targets that is 40 observers. This module lazily creates a
 * single instance, keeps a WeakMap of element -> callback, and unobserves each
 * element the moment it has fired, because a reveal should happen exactly once.
 */

type RevealCallback = () => void;

let observer: IntersectionObserver | null = null;
const handlers = new WeakMap<Element, RevealCallback>();

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const handler = handlers.get(entry.target);
        observer?.unobserve(entry.target);
        handlers.delete(entry.target);
        handler?.();
      }
    },
    {
      // Fire slightly before the element is fully on screen so the motion has
      // already settled by the time the reader arrives.
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.1,
    },
  );

  return observer;
}

/**
 * Registers `onReveal` for `el`. Returns a cleanup function suitable for the
 * return value of a `useEffect`.
 */
export function observeReveal(el: Element, onReveal: RevealCallback): () => void {
  const io = ensureObserver();

  // No IntersectionObserver (or it failed): never hide content from the reader.
  if (!io) {
    onReveal();
    return () => {};
  }

  handlers.set(el, onReveal);
  io.observe(el);

  return () => {
    handlers.delete(el);
    io.unobserve(el);
  };
}
