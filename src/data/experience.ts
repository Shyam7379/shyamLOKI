/**
 * EXPERIENCE — confirmed history only.
 * No dates, awards, evaluations, metrics or outcomes are asserted here because
 * none of them were supplied or could be verified. If you want the timeline to
 * carry dates, add a `period` string to each entry and it will render next to
 * the marker.
 */

export type ExperienceEntry = {
  id: string;
  marker: string;
  role: string;
  org: string;
  /** Short classification rendered as a chip. */
  kind: string;
  summary: string;
  highlights: readonly string[];
  tags: readonly string[];
  /** Optional — e.g. "2025 — 2026 (final year)". Left unset: not verified. */
  period?: string;
};

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'webbed',
    marker: '01',
    role: 'Full Stack Developer Intern',
    org: 'Webbed',
    kind: 'Internship',
    summary:
      'Completed a foundational internship program at Webbed, developing practical knowledge across software engineering, web development, UI/UX, Firebase hosting, resume building, prompt engineering and AI-assisted workflows. The experience helped me connect technical learning with practical project development.',
    highlights: [
      'Software engineering practice beyond coursework — how work is structured, reviewed and finished.',
      'Web development and UI/UX design, applied to real deliverables rather than exercises.',
      'Firebase hosting and deployment: taking a project from running locally to actually reachable.',
      'Prompt engineering and AI-assisted workflows, learned as a working method rather than a shortcut.',
    ],
    tags: ['Software Engineering', 'Web Development', 'UI/UX', 'Firebase Hosting', 'Prompt Engineering'],
  },
  {
    id: 'client-work',
    marker: '02',
    role: 'Full Stack Developer — Client & Independent Projects',
    org: 'Independent',
    kind: 'Projects',
    summary:
      'Designing and building complete products end to end — from understanding what a business actually needs, through interface design, to a deployed, working result. Client work has ranged from a bilingual matrimonial platform with an admin dashboard to a multi-page real-estate site for a construction company.',
    highlights: [
      'Rani Matrimony — a bilingual Tamil / English registration and profile platform with photo upload, a Firestore-backed record store and an admin dashboard.',
      'DV DreamHome — a multi-page construction and real-estate site with JSON-driven project listings and a small admin area for enquiries and testimonials.',
      'SpaceLink — an application prototype taken from concept to working interface during my internship.',
      'Copycat — a document question-answering project exploring retrieval-augmented generation.',
    ],
    tags: ['React', 'Firebase', 'Cloudinary', 'HTML/CSS/JS', 'RAG'],
  },
  {
    id: 'education',
    marker: '03',
    role: 'Computer Science — Undergraduate',
    org: 'Dwarka Doss Goverdhan Doss Vaishnav College',
    kind: 'Education',
    summary:
      'Studying computer science alongside building software. The coursework gives me the fundamentals; the projects are where they get tested against real requirements, real audiences and real deadlines.',
    highlights: [
      'Computer science fundamentals — programming, data and problem solving.',
      'Where the client and independent projects were scoped, built and iterated on.',
    ],
    tags: ['Computer Science'],
  },
] as const;
