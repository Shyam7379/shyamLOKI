import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { heroMedia, PHONE_MEDIA_QUERY } from '../../data/media';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { TimelineVeins } from '../../components/ui/Timeline';
import './hero.css';

/** Minimal shape of the Network Information API — not in lib.dom yet. */
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function shouldLoadVideo(): boolean {
  if (typeof navigator === 'undefined') return true;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!conn) return true;
  if (conn.saveData) return false; // the visitor asked us not to spend their data
  if (conn.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
  return true;
}

/** Hand-placed rather than randomised, so the composition stays balanced. */
const MOTES = [
  { x: 11, y: 70, size: 2, duration: 17, delay: 0, drift: -34 },
  { x: 18, y: 36, size: 1.5, duration: 21, delay: 3, drift: 26 },
  { x: 25, y: 84, size: 2.5, duration: 19, delay: 6, drift: -18 },
  { x: 33, y: 24, size: 1.5, duration: 24, delay: 1.5, drift: 40 },
  { x: 40, y: 60, size: 2, duration: 18, delay: 8, drift: -28 },
  { x: 47, y: 32, size: 1.5, duration: 22, delay: 4.5, drift: 22 },
  { x: 55, y: 76, size: 2, duration: 20, delay: 10, drift: -30 },
  { x: 63, y: 48, size: 1.5, duration: 26, delay: 2, drift: 34 },
  { x: 71, y: 88, size: 2.5, duration: 19, delay: 7, drift: -24 },
  { x: 78, y: 28, size: 1.5, duration: 23, delay: 5, drift: 30 },
  { x: 86, y: 64, size: 2, duration: 21, delay: 9, drift: -20 },
  { x: 93, y: 42, size: 1.5, duration: 18, delay: 11, drift: 26 },
] as const;

type VideoStatus = 'idle' | 'playing' | 'blocked';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduceMotion = usePrefersReducedMotion();

  /** Chosen once, at mount — swapping the file later would re-download it. */
  const [source] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(PHONE_MEDIA_QUERY).matches
      ? heroMedia.srcMobile
      : heroMedia.src,
  );
  const [videoAllowed] = useState(shouldLoadVideo);

  const [userPaused, setUserPaused] = useState(false);
  const [status, setStatus] = useState<VideoStatus>('idle');

  // Either the visitor asked their OS for less motion, or they pressed pause.
  const motionPaused = userPaused || reduceMotion;

  /* ── Start / stop playback ─────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoAllowed) return;

    if (motionPaused) {
      video.pause();
      return;
    }

    // A rejected promise means autoplay was blocked (iOS Low Power Mode, strict
    // data savers, a policy-tightened browser). The poster stays exactly where
    // it is and nothing looks broken — only the pause control changes state.
    video.play()?.then(
      () => setStatus('playing'),
      () => setStatus('blocked'),
    );
  }, [motionPaused, videoAllowed]);

  /* ── Only decode while the hero is actually on screen ───────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero || !videoAllowed) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!motionPaused && status === 'playing') void video.play().catch(() => { });
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.04 },
    );
    io.observe(hero);

    // A background tab should never keep decoding a video loop.
    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (!motionPaused && status === 'playing') {
        void video.play().catch(() => { });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [motionPaused, status, videoAllowed]);

  const jumpTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
    // Move focus so keyboard and screen-reader users land where the view went.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className={`hero${motionPaused ? ' is-still' : ''}${status === 'blocked' ? ' is-video-blocked' : ''}`}
      aria-labelledby="hero-name"
    >
      {/* ── Media ───────────────────────────────────────────────────────────── */}
      <div className="hero__media">
        {/*
          The still is not only a fallback: it is the largest contentful paint.
          Prioritised, and painted underneath the video. Because it was extracted
          from frame 0 of the same encode, the moment the video fades in over it
          nothing visibly changes.

          <picture> with an explicit media query rather than a `sizes`-driven
          srcset: the file is then chosen by the same breakpoint that picks the
          video and the same one index.html preloads against, so the still that
          paints first is always the still that was already in flight. Left to
          srcset heuristics instead, the browser's pick and the preload
          scanner's pick can disagree — and the loser is a wasted download.
        */}
        <picture>
          <source media={PHONE_MEDIA_QUERY} srcSet={heroMedia.posterMobile} />
          <img
            className="hero__still"
            src={heroMedia.poster}
            width={heroMedia.width}
            height={heroMedia.height}
            alt={heroMedia.alt}
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {videoAllowed ? (
          <video
            ref={videoRef}
            className="hero__video"
            poster={heroMedia.poster}
            width={heroMedia.width}
            height={heroMedia.height}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            controlsList="nodownload noplaybackrate nofullscreen"
            tabIndex={-1}
            aria-hidden="true"
          >
            {/*
              The supplied boomerang master, re-encoded frame-for-frame (see
              tools/media/build-media.mjs). Nothing is retimed, so the loop seam
              is the source's own — SSIM 0.87 between the first and last frame.
            */}
            <source src={source} type="video/mp4" />
          </video>
        ) : null}

        {/* Colour grade: emerald lift from below, warm gold through the top. */}
        <div className="hero__grade" />
        <div className="hero__vignette" />
        {/* Legibility veil — dark where the type sits, open where it does not. */}
        <div className="hero__scrim" />
        <TimelineVeins />
        <div className="hero__grain" />
        {!motionPaused ? (
          <div className="hero__motes" aria-hidden="true">
            {MOTES.map((mote) => (
              <span
                key={`${mote.x}-${mote.y}`}
                className="hero__mote"
                style={
                  {
                    '--x': `${mote.x}%`,
                    '--y': `${mote.y}%`,
                    '--d': `${mote.duration}s`,
                    '--delay': `${mote.delay}s`,
                    '--size': `${mote.size}px`,
                    '--drift': `${mote.drift}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Copy ────────────────────────────────────────────────────────────── */}
      <div className="hero__inner shell shell--wide">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="sr-only">Shyam — Full Stack Developer</span>
            <div className="hero__logo-wrapper">
              <img
                src="/media/hero/shyam-loki-logo.png"
                alt="SHYAM"
                className="hero__loki-logo"
                width={1024}
                height={372}
                fetchPriority="high"
                decoding="sync"
              />
            </div>
          </h1>
        </div>
      </div>

      {/* ── Chrome: scroll cue + motion control ─────────────────────────────── */}
      <div className="hero__chrome shell shell--wide">
        <a className="hero__cue" href="#about" onClick={jumpTo('about')}>
          <span className="hero__cue-label">Enter the timeline</span>
          <span className="hero__cue-line" aria-hidden="true" />
        </a>

        <div className="hero__aside">
          {/* WCAG 2.2.2: auto-playing motion must be pausable by the visitor. */}
          <button
            type="button"
            className="hero__motion"
            onClick={() => setUserPaused((value) => !value)}
            aria-pressed={motionPaused}
            title={motionPaused ? 'Resume atmospheric motion' : 'Pause atmospheric motion'}
          >
            <span className="hero__motion-bar" aria-hidden="true" />
            <span>{motionPaused ? 'Resume motion' : 'Pause motion'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
