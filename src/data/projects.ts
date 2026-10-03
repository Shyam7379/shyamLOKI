/**
 * =============================================================================
 * PROJECTS — accuracy rules for this file
 * =============================================================================
 * Every description, technology tag and link below is traceable to something in
 * Shyam's own workspace or public GitHub:
 *
 *   · Rani Matrimony  — `build.md` / `setup.md` build spec, the exported
 *                       registration CSV, and the public repo (React + Vite +
 *                       React Router + Firebase Auth/Firestore + Cloudinary).
 *   · DV DreamHome    — the actual project checkout (static multi-page site,
 *                       vanilla JS, JSON content, admin login + dashboard) and
 *                       its public git remote.
 *   · SpaceLink       — his `SpaceLink.jsx` and `spacelink_app.dart` prototypes.
 *   · Copycat         — Shyam's own description. Nothing about models, vector
 *                       stores, embedding providers or accuracy is claimed here,
 *                       because none of that is verifiable.
 *
 * LINKS: `repoUrl` / `liveUrl` are `null` where no link could be verified. The
 * UI renders a quiet "coming soon" marker for those rather than a fake button —
 * to publish a link, just paste the URL and the button appears automatically.
 * =============================================================================
 */

export type ProjectMedia =
  | { kind: 'gallery'; images: readonly { src: string; srcSet?: string; alt: string }[] }
  | { kind: 'mark'; src: string; alt: string }
  | { kind: 'motif'; motif: 'matrimony' | 'rag' };

export type Project = {
  /** Stable slug, used for element ids and the case-notes panel. */
  slug: string;
  /** "BRANCH 01" … used as the timeline coordinate label. */
  branch: string;
  title: string;
  /** e.g. "Rani Thirumana Sevai Maiyam" — the real-world name of the work. */
  client?: string;
  category: string;
  discipline: string;
  description: string;
  /** Plain-language bullets shown in the expandable case notes. */
  notes: readonly string[];
  /** Optional one-liner rendered inside the notes panel, styled as a formula. */
  explainer?: { label: string; steps: readonly string[] };
  stack: readonly string[];
  repoUrl: string | null;
  liveUrl: string | null;
  media: ProjectMedia;
  /** Renders across two grid columns on wide screens. */
  featured?: boolean;
};

export const projects: readonly Project[] = [
  {
    slug: 'rani-matrimony',
    branch: 'Branch 01',
    title: 'Rani Matrimony',
    client: 'Rani Thirumana Sevai Maiyam',
    category: 'Client Project',
    discipline: 'Matrimony Platform',
    description:
      'A matrimonial platform built for a client, turning the service centre’s paper registration workflow into an accessible digital experience. Clear presentation, intuitive navigation and a bilingual Tamil / English interface shaped around an audience that is not necessarily comfortable with English-only forms.',
    notes: [
      'Seven-step registration flow — basic details, family, birth and horoscope, education and career, photo and location, expectations, then a review screen before submitting.',
      'Profile-photo upload handled through Cloudinary, with the registration record written to Firestore and a reference ID returned to the user on a success screen.',
      'A separate admin journey: Firebase Authentication, an authorised-UID check, then a dashboard to search, filter and sort submitted profiles.',
      'Built as a React single-page app — no custom backend server; the browser talks directly to Firebase and Cloudinary, governed by Firestore security rules.',
    ],
    stack: ['React', 'Vite', 'React Router', 'Firebase Auth', 'Firestore', 'Cloudinary'],
    repoUrl: 'https://github.com/Shyam7379/raanimatrimony',
    liveUrl: null,
    media: { kind: 'motif', motif: 'matrimony' },
  },
  {
    slug: 'spacelink',
    branch: 'Branch 02',
    title: 'SpaceLink',
    category: 'Internship Project',
    discipline: 'Application Development',
    description:
      'An application developed during my internship, and the project that taught me the most about turning a product concept into something real. SpaceLink connects owners of idle commercial space — cabins, halls, rooms sitting empty — with professionals who need a workspace for a few days without signing a lease.',
    notes: [
      'Two distinct journeys designed in one product: the space owner listing and tracking occupancy, and the seeker browsing, comparing and booking.',
      'The core insight the product is built around: idle space is lost money, so the value has to be visible immediately rather than three screens deep.',
      'Taken from concept to working interface twice — once prototyped in React, and once as a native mobile build in Flutter — which is where I learned to design the flow before writing the screen.',
      'Practical exposure to interface design, component structure and the gap between how a feature is specified and how it actually behaves.',
    ],
    stack: ['React', 'Flutter (Dart)', 'UI/UX Prototyping', 'Product Concept → Build'],
    repoUrl: null, // ← paste the repository URL here and the button appears
    liveUrl: null, // ← paste a live demo URL here and the button appears
    media: {
      kind: 'mark',
      src: '/media/projects/spacelink-mark.webp',
      alt: 'SpaceLink product mark — a wordmark on a dark rounded panel, reading SpaceLink with Link in blue.',
    },
  },
  {
    slug: 'dv-dreamhome',
    branch: 'Branch 03',
    title: 'DV DreamHome',
    client: 'DV Dream Homes',
    category: 'Client Project',
    discipline: 'Construction & Real Estate Website',
    description:
      'A construction and real-estate website for a Chennai-based builder, presenting developments, completed and ongoing projects, and the company itself through a professional, trustworthy web presence with clear navigation and organised information.',
    notes: [
      'A multi-page static site: home, completed projects, ongoing projects, a page per development — Emerald, Empire and Marina — plus team, why-DV, and contact.',
      'Content for projects and testimonials lives in JSON files rather than being hard-coded into the markup, so the client can update listings without touching the page structure.',
      'A small admin area with its own login screen and a dashboard for reviewing enquiries and managing testimonials.',
      'Hand-written CSS and vanilla JavaScript throughout — no framework — which meant owning every breakpoint, animation and accessibility detail directly.',
    ],
    stack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'JSON Content', 'Admin Dashboard'],
    repoUrl: 'https://github.com/netguy001/dv-dream-homes',
    liveUrl: null,
    media: {
      kind: 'gallery',
      images: [
        {
          src: '/media/projects/dv-enclave-sm.webp',
          srcSet: '/media/projects/dv-enclave-sm.webp 560w, /media/projects/dv-enclave.webp 1100w',
          alt: 'Photograph of a completed DV Dream Homes residential apartment development exterior, with balconies across four floors.',
        },
        {
          src: '/media/projects/dv-authai-sm.webp',
          srcSet: '/media/projects/dv-authai-sm.webp 560w, /media/projects/dv-authai.webp 1100w',
          alt: 'Photograph of a modern four-storey DV Dream Homes building with a projecting balcony facade.',
        },
      ],
    },
  },
  {
    slug: 'copycat',
    branch: 'Branch 04',
    title: 'Copycat',
    category: 'AI Project',
    discipline: 'Retrieval-Augmented Generation',
    description:
      'A document-based question-answering website. Upload a document and the system retrieves the passages that matter from its own contents before generating an answer — so the response is grounded in the document rather than in whatever the model happens to remember.',
    notes: [
      'Focused on document understanding: making a long, unstructured document searchable and answerable without the user reading it end to end.',
      'Built around retrieval, not recall — the answer is assembled from the document’s own text, which is the whole point of RAG.',
      'Practical exploration of information retrieval and AI-powered interaction design, including how to present an answer the user can trust and check.',
    ],
    explainer: {
      label: 'How it works',
      steps: ['Upload a document.', 'Ask a question.', 'Retrieve relevant information.', 'Get an answer based on the document.'],
    },
    stack: ['Retrieval-Augmented Generation', 'Document Q&A', 'Prompt Engineering', 'Full Stack'],
    repoUrl: null, // ← paste the repository URL here and the button appears
    liveUrl: null, // ← paste a live demo URL here and the button appears
    media: { kind: 'motif', motif: 'rag' },
    featured: true,
  },
] as const;
