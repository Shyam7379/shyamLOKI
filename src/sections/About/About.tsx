import { Reveal } from '../../components/ui/Reveal';
import './about.css';

/**
 * About — Swiss editorial / cinematic dark brutalist design.
 *
 * Uses the custom stylized green monochrome portrait as a full-bleed
 * atmospheric background with precision dark overlays, paired with
 * oversized Swiss editorial typography, clear education credentials,
 * and an editorial metadata panel.
 */
export function About() {
  return (
    <section
      id="about"
      className="about-editorial"
      aria-labelledby="about-title"
    >
      <div className="about-editorial__bg-wrap" aria-hidden="true">
        <img
          src="/media/about/shyam-bg-new.jpg"
          alt=""
          className="about-editorial__bg-img"
          loading="lazy"
          decoding="async"
        />
        <div className="about-editorial__scrim" />
        <div className="about-editorial__ambient-glow" />
        <div className="about-editorial__edge-top" />
        <div className="about-editorial__edge-bottom" />
      </div>

      <div className="about-editorial__shell">
        {/* ── Top section label ─────────────────────────────────────── */}
        <Reveal as="div" className="about-editorial__header">
          <span className="about-editorial__label">About / 01</span>
        </Reveal>

        {/* ── Main Editorial Grid ───────────────────────────────────── */}
        <div className="about-editorial__grid">
          {/* ── Primary Column: Typography & Narrative ──────────────── */}
          <div className="about-editorial__content">
            <Reveal as="div">
              <h2 id="about-title" className="about-editorial__heading">
                I build digital experiences that turn ideas into useful,
                real&#8209;world products.
              </h2>
            </Reveal>

            <Reveal as="p" className="about-editorial__heading-secondary" delay={60}>
              From web platforms and interactive interfaces to
              cloud&#8209;connected applications.
            </Reveal>

            <Reveal as="p" className="about-editorial__description" delay={120}>
              I&rsquo;m a Computer Science student and software developer
              focused on building clean, practical web experiences. I work
              across React, JavaScript, Python, Firebase and cloud&#8209;based
              tools, with a strong interest in product design and modern web
              development. I enjoy taking an idea from an initial concept to a
              polished, working product.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
