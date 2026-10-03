import { experience } from '../../data/experience';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import './experience.css';

export function Experience() {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="shell shell--wide">
        <SectionHeading
          eyebrow="Journey Through Timelines"
          title={
            <span id="experience-title">
              Where the branches <em>actually happened</em>
            </span>
          }
          lead="Three moments that shaped how I build: the formal internship, the client work that followed it, and the coursework running underneath both."
          note="No dates are shown because none were supplied — the timeline is chronological in order, not dated. Add a `period` to any entry in src/data/experience.ts and it renders here."
        />

        <ol className="xp">
          {experience.map((entry, index) => (
            <Reveal as="li" className="xp__item" key={entry.id} delay={index * 90}>
              <span className="xp__node" aria-hidden="true" />

              <article className="card xp__card">
                <div className="xp__head">
                  <span className="xp__marker" aria-hidden="true">
                    {entry.marker}
                  </span>
                  <span className="chip chip--gold">{entry.kind}</span>
                  {entry.period ? <span className="xp__period">{entry.period}</span> : null}
                </div>

                <h3 className="xp__role">{entry.role}</h3>
                <p className="xp__org">{entry.org}</p>
                <p className="xp__summary">{entry.summary}</p>

                <ul className="xp__highlights">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>

                <ul className="xp__tags">
                  {entry.tags.map((tag) => (
                    <li className="chip" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
