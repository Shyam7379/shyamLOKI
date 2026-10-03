import { useEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { observeReveal } from '../../lib/observer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Tags this wrapper is allowed to render. Restricting it keeps the semantics of
 * the content intact — a list item stays an <li>, a heading block stays a
 * <header> — while giving the compiler a closed set to reason about.
 */
type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'li'
  | 'figure'
  | 'span'
  | 'p'
  | 'dl';

type RevealProps = {
  as?: RevealTag;
  children: ReactNode;
  className?: string;
  /** Stagger in ms, applied as a CSS custom property. */
  delay?: number;
  id?: string;
};

/**
 * Declarative scroll reveal.
 *
 * The hidden state lives under `.js-reveal [data-reveal]` in CSS, and
 * `main.tsx` only adds `js-reveal` once React has mounted. If JavaScript fails
 * the class never appears and every section renders fully visible — content is
 * never hidden behind an animation that might not run.
 *
 * Reduced motion is handled twice over, on purpose. CSS forces
 * `[data-reveal]` visible inside `@media (prefers-reduced-motion: reduce)`, and
 * this component additionally marks itself revealed immediately without ever
 * observing. One of the two is enough; having both means a visitor who asked
 * for less motion can never end up staring at an empty section because a
 * media query and a JS listener disagreed.
 */
export function Reveal({ as = 'div', children, className, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.add('is-revealed');
      return;
    }

    return observeReveal(el, () => el.classList.add('is-revealed'));
  }, [reducedMotion]);

  // Every permitted tag is an HTMLElement, so one ref type covers them all;
  // rendering through `Tag` keeps this a plain DOM element for React and lint.
  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      id={id}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      data-reveal=""
    >
      {children}
    </Tag>
  );
}
