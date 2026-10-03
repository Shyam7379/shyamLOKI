import { useCallback, useEffect, useState } from 'react';
import { profile } from '../../data/profile';
import { Monogram } from '../../components/brand/Monogram';
import './preloader.css';

const SESSION_KEY = 'sv-intro-seen';
const HOLD_MS = 1150;
const EXIT_MS = 420;

/**
 * A short opening beat: the monogram draws itself, the name resolves, and the
 * overlay lifts.
 *
 * Design constraints it has to satisfy, all of which are why it behaves the way
 * it does:
 *   · It must not gate the portfolio. It is a veil over an already-rendered
 *     page, not a loading screen — the hero video and poster are loading behind
 *     it the whole time, so nothing is delayed.
 *   · It must be skippable. Click, tap, any key or a wheel movement dismisses it
 *     immediately, and it says so on screen.
 *   · It must not repeat within a session, and it must never appear at all for a
 *     visitor who has asked for reduced motion.
 */
export function Preloader() {
  const [dismissed, setDismissed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Decided once, before first paint, so reduced-motion visitors never see it.
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return false;
    } catch {
      // Private mode with storage blocked: showing it once is harmless.
    }
    return true;
  });

  /*
   * Deliberately no scroll lock here. It looks like it should have one, but
   * fixing <body> takes it out of flow, which collapses the document height for
   * as long as it lasts — and anything measuring the page during that window
   * (the scroll-spy, for one) gets a wrong answer. The intro dismisses itself on
   * a wheel or touch event anyway, so the page never scrolls behind it.
   */

  const dismiss = useCallback(() => {
    setLeaving(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable — the intro simply shows again on reload */
    }
    window.setTimeout(() => setDismissed(true), EXIT_MS);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const timer = window.setTimeout(dismiss, HOLD_MS);
    const skip = () => dismiss();

    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [shouldShow, dismiss]);

  if (!shouldShow || dismissed) return null;

  return (
    <div
      className={`intro${leaving ? ' is-leaving' : ''}`}
      // Decorative: the page underneath is already real content, and this must
      // never trap a screen reader or steal focus.
      role="presentation"
      aria-hidden="true"
      onTransitionEnd={() => setShouldShow(false)}
    >
      <div className="intro__core">
        <Monogram size={62} className="intro__mark" />

        <p className="intro__name">{profile.name}</p>
        <p className="intro__role">{profile.role}</p>

        <span className="intro__rule">
          <span className="intro__rule-fill" />
        </span>
      </div>

      <p className="intro__skip">Tap or press any key to skip</p>
    </div>
  );
}
