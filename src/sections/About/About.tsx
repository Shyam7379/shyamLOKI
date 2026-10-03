import { profile } from '../../data/profile';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Icon } from '../../components/ui/Icon';
import './about.css';

/**
 * Everything below is drawn from what Shyam supplied: no invented degrees,
 * dates, years of experience, metrics or client outcomes.
 */
const FACTS = [
  { key: 'Role', value: 'Full Stack Developer' },
  { key: 'Studying', value: 'Computer Science' },
  { key: 'College', value: 'DDGD Vaishnav College' },
  { key: 'Based in', value: profile.based },
] as const;

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="shell shell--wide about__grid">
        <div className="about__copy">
          <SectionHeading
            eyebrow="The Person Behind the Timeline"
            title={
              <span id="about-title">
                Finding the story <em>inside</em> the requirements
              </span>
            }
          />

          <Reveal as="div" className="about__prose" delay={80}>
            <p>
              I&rsquo;m Shyam V., a Full Stack Developer and computer science student at{' '}
              <strong>Dwarka Doss Goverdhan Doss Vaishnav College</strong>. I enjoy turning ideas
              into practical, intuitive and visually engaging digital experiences — building client
              websites, developing applications, and experimenting with AI-powered solutions to see
              how technology can solve real-world problems.
            </p>
            <p>
              During my internship as a Full Stack Developer at <strong>Webbed</strong>, I
              strengthened my understanding of software engineering, web development, UI/UX design,
              Firebase hosting and prompt engineering. That experience also led to independent
              client work and collaborations, and taught me to design for usability and
              functionality first — the interface is only right when someone can use it without
              being taught.
            </p>
            <p>
              I approach every project as a new timeline: a chance to learn, experiment, solve a
              problem, and create something meaningful.
            </p>
          </Reveal>

          <Reveal as="dl" className="about__facts" delay={160}>
            {FACTS.map((fact) => (
              <div className="about__fact" key={fact.key}>
                <dt>{fact.key}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ── The branch: portrait, then the two moments that shaped it ────
            The trunk is a CSS gradient line on the column (`.about__branch::before`)
            and each `slot` carries a node dot. Slots exist so the dot sits outside
            the card's own box — `.card` clips its overflow, so a dot drawn as a
            child or pseudo-element of the card would simply be cut off. */}
        <div className="about__branch">
          <div className="about__slot">
            <span className="about__dot about__dot--emerald" aria-hidden="true" />
            <Reveal as="figure" className="about__portrait frame">
              <img
                src="/media/about/shyam-portrait.webp"
                srcSet="/media/about/shyam-portrait.webp 720w, /media/about/shyam-portrait@2x.webp 1440w"
                sizes="(max-width: 64rem) 88vw, 34rem"
                width={720}
                height={960}
                alt="Portrait of Shyam V. smiling, in a dark t-shirt, photographed indoors."
                loading="lazy"
                decoding="async"
              />
              <figcaption className="about__portrait-cap">
                <span className="about__portrait-name">Shyam V.</span>
                <span className="about__portrait-role">Full Stack Developer</span>
              </figcaption>
            </Reveal>
          </div>

          <div className="about__slot">
            <span className="about__dot" aria-hidden="true" />
            <Reveal as="article" className="card about__node" delay={120}>
              <p className="eyebrow eyebrow--plain about__node-label">
                <Icon name="branch" size={14} />
                Education
              </p>
              <h3 className="about__node-title">{profile.college}</h3>
              <p className="about__node-meta">Computer Science — undergraduate</p>
              <p className="about__node-body">
                The fundamentals — programming, data and problem solving — studied alongside
                building software rather than after it.
              </p>
            </Reveal>
          </div>

          <div className="about__slot">
            <span className="about__dot" aria-hidden="true" />
            <Reveal as="article" className="card about__node" delay={200}>
              <p className="eyebrow eyebrow--plain about__node-label">
                <Icon name="branch" size={14} />
                Internship
              </p>
              <h3 className="about__node-title">{profile.internship}</h3>
              <p className="about__node-meta">{profile.internshipRole}</p>
              <p className="about__node-body">
                Software engineering practice, web development, UI/UX, Firebase hosting, and
                AI-assisted workflows — the point where coursework turned into shipped work.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
