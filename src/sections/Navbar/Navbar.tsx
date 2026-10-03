import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { navItems, profile } from '../../data/profile';
import { Wordmark } from '../../components/brand/Monogram';
import { Icon } from '../../components/ui/Icon';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './navbar.css';

const SECTION_IDS: readonly string[] = navItems.map((item) => item.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [progress, setProgress] = useState(0);

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const active = useScrollSpy(SECTION_IDS);
  const reduceMotion = usePrefersReducedMotion();

  useBodyScrollLock(open);

  /* ── Condense on scroll, and track reading progress ────────────────────── */
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setCondensed(y > 24);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const goTo = useCallback(
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      setOpen(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    },
    [reduceMotion],
  );

  /* ── Drawer: trap focus, close on Escape, restore focus to the toggle ──── */
  useEffect(() => {
    if (!open) return;
    const node = drawerRef.current;
    if (!node) return;

    const focusable = node.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <header className={`nav${condensed ? ' is-condensed' : ''}`}>
      <div className="nav__bar shell shell--wide">
        <a className="nav__brand" href="#home" onClick={goTo('home')} aria-label={`${profile.name} — home`}>
          <Wordmark size={32} />
        </a>

        <nav className="nav__links" aria-label="Sections">
          <ul className="nav__list">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    className={`nav__link${isActive ? ' is-active' : ''}`}
                    href={`#${item.id}`}
                    onClick={goTo(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav__tail">
          <a className="btn btn--ghost nav__cta" href="#contact" onClick={goTo('contact')}>
            Let&rsquo;s Connect
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Reading progress: the timeline being traversed. */}
      <div className="nav__progress" aria-hidden="true">
        <span className="nav__progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      <div
        className={`nav__scrim${open ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        id="nav-drawer"
        ref={drawerRef}
        className={`nav__drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        inert={open ? undefined : true}
      >
        {/* The bar's own toggle is behind the drawer on phones, so the drawer
            carries its own close control. Escape and the scrim also close it. */}
        <div className="nav__drawer-head">
          <p className="nav__drawer-label eyebrow eyebrow--plain">Navigate</p>
          <button
            type="button"
            className="nav__drawer-close"
            onClick={close}
            aria-label="Close navigation menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <ul className="nav__drawer-list">
          {navItems.map((item, index) => (
            <li key={item.id} style={{ '--i': index } as React.CSSProperties}>
              <a
                className={`nav__drawer-link${active === item.id ? ' is-active' : ''}`}
                href={`#${item.id}`}
                onClick={goTo(item.id)}
              >
                <span className="nav__drawer-index">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__drawer-foot">
          <a className="btn btn--primary" href="#contact" onClick={goTo('contact')}>
            Let&rsquo;s Connect
            <Icon name="arrowRight" size={17} className="btn__icon" />
          </a>
          <a className="nav__drawer-mail" href={`mailto:${profile.email}`}>
            <Icon name="mail" size={16} />
            {profile.email}
          </a>
        </div>
      </div>
    </header>
  );
}
