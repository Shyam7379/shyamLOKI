/**
 * =============================================================================
 * SKILLS — what is actually in the list, and why
 * =============================================================================
 * Deliberately NO percentage bars and NO "expert" claims. There is no defensible
 * measurement behind a number like "95% React", so the section describes the
 * kinds of problems each capability solves instead.
 *
 * Every entry is evidenced by one of Shyam's real artefacts:
 *   React · Vite · React Router · Firebase Auth/Firestore · Cloudinary
 *        -> `build.md`, `setup.md`, `firestore.rules` in raanimatrimony
 *   HTML/CSS/vanilla JS · JSON-driven content · admin dashboard
 *        -> the dv-dream-homes checkout
 *   Flutter (Dart) · React prototyping
 *        -> SpaceLink.jsx and spacelink_app.dart
 *   TypeScript, REST-style API integration
 *        -> the `techstack` repository
 *   RAG · document Q&A · prompt engineering
 *        -> Copycat, and the AI-assisted workflow across all of the above
 *
 * NOT listed, because nothing verifies it: Node/Express, SQL databases, Docker,
 * CI/CD, testing frameworks, cloud providers other than Firebase/Cloudinary.
 * If you have real experience with any of those, add them — the layout is
 * data-driven, so one array entry is all it takes.
 * =============================================================================
 */

export type SkillGroup = {
  id: string;
  /** Roman-numeral marker, echoing the TVA's folder labels. */
  index: string;
  title: string;
  glyph: 'layers' | 'server' | 'database' | 'spark' | 'terminal' | 'cursor';
  /** One sentence: what this cluster of skills is actually for. */
  promise: string;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'frontend',
    index: 'I',
    title: 'Frontend Development',
    glyph: 'layers',
    promise:
      'Interfaces that stay readable and usable down to the smallest phone, and that a non-technical visitor can work out without being taught.',
    items: [
      'HTML5',
      'CSS3',
      'JavaScript (ES6+)',
      'React',
      'Vite',
      'React Router',
      'Flutter (Dart)',
      'Responsive, mobile-first UI',
    ],
  },
  {
    id: 'backend',
    index: 'II',
    title: 'Backend & Cloud Services',
    glyph: 'server',
    promise:
      'Application logic and data handling delivered without a custom server — services wired together properly, with the rules enforced where they belong.',
    items: [
      'Firebase Authentication',
      'Firebase Firestore',
      'Firebase Hosting',
      'Cloudinary media pipeline',
      'REST-style API integration',
      'Form & data handling',
    ],
  },
  {
    id: 'data',
    index: 'III',
    title: 'Databases & Data',
    glyph: 'database',
    promise:
      'Structuring content so it can be searched, filtered and updated by someone who is not a developer — including the access rules that protect it.',
    items: [
      'Firestore collections & documents',
      'Firestore security rules',
      'JSON-driven site content',
      'Data modelling for admin search & filter',
      'Export & reporting from stored records',
    ],
  },
  {
    id: 'ai',
    index: 'IV',
    title: 'AI & Retrieval (RAG)',
    glyph: 'spark',
    promise:
      'Getting answers out of documents that were never written to be queried — and using AI agents deliberately rather than as a novelty.',
    items: [
      'Retrieval-Augmented Generation',
      'Document Q&A',
      'Prompt engineering',
      'AI-assisted development workflows',
      'Shipping with coding agents',
    ],
  },
  {
    id: 'tools',
    index: 'V',
    title: 'Development Tools',
    glyph: 'terminal',
    promise:
      'The day-to-day kit: versioning work properly, finding out why something broke, and getting a build out the door.',
    items: [
      'Git & GitHub',
      'VS Code',
      'Chrome DevTools',
      'npm',
      'Vite build tooling',
      'Firebase console',
    ],
  },
  {
    id: 'ux',
    index: 'VI',
    title: 'UI/UX & Product',
    glyph: 'cursor',
    promise:
      'Deciding what to build and how it should feel before writing the code — especially for audiences who are not early adopters.',
    items: [
      'Interface & interaction design',
      'Wireframing & user flows',
      'Design systems & tokens',
      'Accessibility fundamentals',
      'Bilingual (Tamil / English) interfaces',
      'Client requirement discovery',
    ],
  },
] as const;
