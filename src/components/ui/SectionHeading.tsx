import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  /** Small tracked mono marker above the title. */
  eyebrow: string;
  title: ReactNode;
  /** One short paragraph explaining what the section contains. */
  lead?: ReactNode;
  /** Optional footnote — used to be explicit about what is/isn't verified. */
  note?: ReactNode;
  /** Centre the block (used by Projects). */
  align?: 'start' | 'center';
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  note,
  align = 'start',
}: SectionHeadingProps) {
  return (
    <Reveal as="header" className={`sec-head${align === 'center' ? ' sec-head--center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="sec-head__title">{title}</h2>
      {lead ? <p className="sec-head__lead">{lead}</p> : null}
      {note ? <p className="sec-head__note">{note}</p> : null}
    </Reveal>
  );
}
