import { useState } from 'react';
import { projects, type Project } from '../../data/projects';
import { branches } from '../../data/media';
import { profile } from '../../data/profile';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Icon } from '../../components/ui/Icon';
import { MatrimonyMotif, RagMotif } from '../../components/projects/ProjectMotif';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './projects.css';

export function Projects() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="shell shell--wide">
        <SectionHeading
          eyebrow="Branching Timelines"
          title={
            <span id="projects-title">
              Every project is a branch <em>I chose to take</em>
            </span>
          }
          lead="Four projects, each one a different kind of problem: a client platform where real people register, a bilingual product for an audience that doesn’t live in English, an internship build, and an experiment in getting answers out of documents."
          note="Links are shown only where they resolve to something real. Two repositories are still private — those cards say so instead of pretending otherwise."
          align="center"
        />

        {/* ── The branch map: the supplied time-branches animation ─────────── */}
        <Reveal as="figure" className="branches">
          <div className="branches__frame">
            {reduceMotion ? (
              // Reduced motion: ship only the 66 KB still, never the animation.
              <img
                className="branches__media"
                src={branches.still}
                width={branches.width}
                height={branches.height}
                alt={branches.alt}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <picture>
                {/*
                  The supplied GIF (1106x618, 4 MB) re-containered as an animated
                  WebP: identical frames and timing, 462 KB. The <img> is a real
                  fallback for the rare engine without animated WebP support.
                */}
                <source srcSet={branches.animated} type="image/webp" />
                <img
                  className="branches__media"
                  src={branches.still}
                  width={branches.width}
                  height={branches.height}
                  alt={branches.alt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            )}

            <div className="branches__veil" aria-hidden="true" />

            {/* TVA-ish framing ticks */}
            <span className="branches__tick branches__tick--tl" aria-hidden="true" />
            <span className="branches__tick branches__tick--tr" aria-hidden="true" />
            <span className="branches__tick branches__tick--bl" aria-hidden="true" />
            <span className="branches__tick branches__tick--br" aria-hidden="true" />

            <div className="branches__hud" aria-hidden="true">
              <span className="branches__hud-key">Sacred timeline</span>
              <span className="branches__hud-val">Branch map</span>
            </div>

            <div className="branches__count" aria-hidden="true">
              <span className="branches__count-num">{String(projects.length).padStart(2, '0')}</span>
              <span className="branches__count-key">branches recorded</span>
            </div>
          </div>

          {/* Trunk fanning out to the four cards below */}
          <svg className="branches__fan" viewBox="0 0 1200 140" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="fan-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--c-emerald-bright)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--c-gold)" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            {/* A trunk that splits into one branch per card. Control points share
                the same y so the curves leave the trunk smoothly instead of
                bulging into an arch. */}
            <path d="M600 0v34" stroke="url(#fan-grad)" strokeWidth="1.4" />
            <path d="M600 34C600 96 150 78 150 140" stroke="url(#fan-grad)" strokeWidth="1.1" />
            <path d="M600 34C600 96 450 78 450 140" stroke="url(#fan-grad)" strokeWidth="1.1" />
            <path d="M600 34C600 96 750 78 750 140" stroke="url(#fan-grad)" strokeWidth="1.1" />
            <path d="M600 34C600 96 1050 78 1050 140" stroke="url(#fan-grad)" strokeWidth="1.1" />
            <circle cx="600" cy="34" r="3.4" fill="var(--c-emerald-bright)" />
            <circle cx="600" cy="34" r="9" stroke="var(--c-emerald-core)" strokeOpacity="0.4" />
          </svg>

          <figcaption className="branches__caption">
            The time branches, as supplied — every fork here maps to a decision made in one of the
            four projects below.
          </figcaption>
        </Reveal>

        {/* ── The branches themselves ─────────────────────────────────────── */}
        <div className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <Reveal as="div" className="projects__outro">
          <p>
            More work, including the projects still in progress, lives on GitHub — repository links
            appear on these cards as soon as each one is public.
          </p>
          <a
            className="btn btn--ghost"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" size={17} />
            View my GitHub
            <Icon name="arrowUpRight" size={15} className="btn__icon" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const notesId = `${project.slug}-notes`;

  return (
    <Reveal
      as="article"
      className={`card card--interactive project${project.featured ? ' project--featured' : ''}`}
      delay={Math.min(index, 3) * 80}
    >
      <div className="project__media">
        <ProjectMedia project={project} />
        <span className="project__branch">{project.branch}</span>
      </div>

      <div className="project__body">
        <div className="project__meta">
          <span className="chip chip--gold">{project.category}</span>
          <span className="project__discipline">{project.discipline}</span>
        </div>

        <h3 className="project__title">{project.title}</h3>
        {project.client ? <p className="project__client">Built for {project.client}</p> : null}

        <p className="project__desc">{project.description}</p>

        <ul className="project__stack" aria-label={`${project.title} technologies`}>
          {project.stack.map((tech) => (
            <li className="chip chip--emerald" key={tech}>
              {tech}
            </li>
          ))}
        </ul>

        <div className="project__actions">
          {project.liveUrl ? (
            <a
              className="btn btn--primary project__btn"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live site
              <Icon name="arrowUpRight" size={15} className="btn__icon" />
            </a>
          ) : null}

          {project.repoUrl ? (
            <a
              className="btn btn--ghost project__btn"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size={15} />
              Repository
              <Icon name="arrowUpRight" size={14} className="btn__icon" />
            </a>
          ) : null}

          {/* Honest placeholder rather than a dead button */}
          {!project.liveUrl && !project.repoUrl ? (
            <p className="project__pending">
              <Icon name="plus" size={13} />
              Live link &amp; repository coming soon
            </p>
          ) : null}

          <button
            type="button"
            className="project__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={notesId}
          >
            {open ? 'Hide case notes' : 'Read case notes'}
            <Icon name={open ? 'close' : 'plus'} size={15} />
          </button>
        </div>

        <div className="project__notes-wrap" id={notesId}>
          {open ? (
            <div className="project__notes">
              <h4 className="project__notes-title">What I built</h4>
              <ul className="project__notes-list">
                {project.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>

              {project.explainer ? (
                <div className="project__explainer">
                  <p className="project__explainer-label">{project.explainer.label}</p>
                  <ol className="project__flow">
                    {project.explainer.steps.map((step, stepIndex) => (
                      <li key={step}>
                        <span className="project__flow-num">
                          {String(stepIndex + 1).padStart(2, '0')}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="project__explainer-foot">
                    Retrieval first, generation second — the answer is assembled from the
                    document&rsquo;s own text rather than from the model&rsquo;s memory.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

/** Picks the right visual for the project: real capture, mark, or motif. */
function ProjectMedia({ project }: { project: Project }) {
  if (project.media.kind === 'gallery') {
    return (
      <div className="project__gallery">
        {project.media.images.map((image, index) => (
          <figure className="project__shot" key={image.src}>
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes="(max-width: 48rem) 92vw, 30rem"
              width={1100}
              height={1185}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: index === 0 ? 'center 62%' : 'center 46%' }}
            />
          </figure>
        ))}
      </div>
    );
  }

  if (project.media.kind === 'mark') {
    return (
      <div className="project__mark">
        <img
          src={project.media.src}
          width={720}
          height={393}
          alt={project.media.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return project.media.motif === 'rag' ? <RagMotif /> : <MatrimonyMotif />;
}
