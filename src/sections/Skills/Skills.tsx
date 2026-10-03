import { skillGroups } from '../../data/skills';
import { Reveal } from '../../components/ui/Reveal';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Icon } from '../../components/ui/Icon';
import './skills.css';

export function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="shell shell--wide">
        <SectionHeading
          eyebrow="Developer Toolkit"
          title={
            <span id="skills-title">
              What I build with, and <em>what it’s for</em>
            </span>
          }
          lead="Six areas I work across. Each one lists the tools I have actually used on a project — grouped by the kind of problem they solve rather than by how confident I feel about them, because a percentage next to “React” would tell you nothing useful."
          note="Levels are deliberately omitted: every entry here is something I have shipped with, not a certification."
        />

        <div className="skills__grid">
          {skillGroups.map((group, index) => (
            <Reveal
              as="article"
              className="card card--interactive skills__card"
              key={group.id}
              delay={index * 70}
            >
              <div className="skills__head">
                <span className="skills__glyph" aria-hidden="true">
                  <Icon name={group.glyph} size={22} />
                </span>
                <span className="skills__index">{group.index}</span>
              </div>

              <h3 className="skills__title">{group.title}</h3>
              <p className="skills__promise">{group.promise}</p>

              <ul className="skills__items">
                {group.items.map((item) => (
                  <li className="chip" key={item}>
                    {item}
                  </li>
                ))}
              </ul>

              {/* A hairline that traces the card edge on hover */}
              <span className="skills__trace" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
