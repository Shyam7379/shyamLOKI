/**
 * Decorative motifs for the two projects that have no screenshot in the
 * workspace.
 *
 * These are explicitly NOT screenshots and are never presented as such — they
 * are original, abstract vectors drawn in the site's palette, marked
 * aria-hidden, and the card's real description carries the meaning. When Shyam
 * has a real capture, swap the project's `media` in src/data/projects.ts.
 */

export function MatrimonyMotif() {
  return (
    <svg viewBox="0 0 400 250" fill="none" aria-hidden="true" className="motif">
      <defs>
        <linearGradient id="mm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1f1a" />
          <stop offset="55%" stopColor="#08161a" />
          <stop offset="100%" stopColor="#060d10" />
        </linearGradient>
        <linearGradient id="mm-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#13222a" />
          <stop offset="100%" stopColor="#0c1519" />
        </linearGradient>
        <linearGradient id="mm-link" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--c-emerald-core)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--c-emerald-bright)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--c-gold)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect width="400" height="250" fill="url(#mm-bg)" />

      {/* Faint registration grid — the paper form, abstracted */}
      <g stroke="var(--c-emerald-core)" strokeOpacity="0.08">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 28} x2="400" y2={i * 28} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 32} y1="0" x2={i * 32} y2="250" />
        ))}
      </g>

      {/* The link between two profiles */}
      <path
        d="M148 118C176 92 224 92 252 118"
        stroke="url(#mm-link)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="200" cy="98" r="4" fill="var(--c-emerald-bright)" />
      <circle cx="200" cy="98" r="10" stroke="var(--c-emerald-core)" strokeOpacity="0.45" />

      {/* Profile card — back */}
      <g opacity="0.72" transform="translate(58 74)">
        <rect width="112" height="132" rx="10" fill="url(#mm-card)" stroke="var(--c-gold)" strokeOpacity="0.22" />
        <circle cx="30" cy="34" r="15" fill="var(--c-emerald-core)" fillOpacity="0.22" />
        <rect x="54" y="24" width="44" height="5" rx="2.5" fill="var(--c-ivory)" fillOpacity="0.4" />
        <rect x="54" y="36" width="30" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.2" />
        <rect x="16" y="64" width="80" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.14" />
        <rect x="16" y="78" width="64" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.14" />
        <rect x="16" y="92" width="72" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.14" />
        <rect x="16" y="110" width="34" height="10" rx="5" fill="var(--c-emerald)" fillOpacity="0.35" />
      </g>

      {/* Profile card — front */}
      <g transform="translate(230 74)">
        <rect width="112" height="132" rx="10" fill="url(#mm-card)" stroke="var(--c-emerald-core)" strokeOpacity="0.34" />
        <circle cx="30" cy="34" r="15" fill="var(--c-emerald-core)" fillOpacity="0.34" />
        <rect x="54" y="24" width="44" height="5" rx="2.5" fill="var(--c-ivory)" fillOpacity="0.55" />
        <rect x="54" y="36" width="34" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.24" />
        <rect x="16" y="64" width="80" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.2" />
        <rect x="16" y="78" width="58" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.2" />
        <rect x="16" y="92" width="70" height="4" rx="2" fill="var(--c-ivory)" fillOpacity="0.2" />
        <rect x="16" y="110" width="34" height="10" rx="5" fill="var(--c-gold)" fillOpacity="0.4" />
      </g>

      {/* Registration tick */}
      <circle cx="312" cy="214" r="7" stroke="var(--c-emerald-core)" strokeOpacity="0.5" />
      <path d="M308.5 214l2.6 2.7 5-5.6" stroke="var(--c-emerald-bright)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function RagMotif() {
  return (
    <svg viewBox="0 0 400 250" fill="none" aria-hidden="true" className="motif">
      <defs>
        <linearGradient id="rg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#08181c" />
          <stop offset="60%" stopColor="#071113" />
          <stop offset="100%" stopColor="#050a0c" />
        </linearGradient>
        <linearGradient id="rg-flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--c-gold)" stopOpacity="0.25" />
          <stop offset="60%" stopColor="var(--c-emerald-bright)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--c-emerald-core)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="400" height="250" fill="url(#rg-bg)" />

      {/* The document */}
      <g transform="translate(34 48)">
        <path
          d="M0 4a4 4 0 0 1 4-4h62l24 24v122a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z"
          fill="#0d1a1e"
          stroke="var(--c-gold)"
          strokeOpacity="0.3"
        />
        <path d="M66 0v24h24" stroke="var(--c-gold)" strokeOpacity="0.3" fill="none" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect
            key={i}
            x="14"
            y={44 + i * 15}
            width={i === 6 ? 34 : 62 - i * 4}
            height="4"
            rx="2"
            fill="var(--c-ivory)"
            fillOpacity={0.24 - i * 0.02}
          />
        ))}
      </g>

      {/* Retrieved fragments flowing toward the answer */}
      <g stroke="url(#rg-flow)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M132 96C176 96 196 70 236 66" />
        <path d="M132 132C180 132 200 126 240 122" />
        <path d="M132 168C176 168 196 176 236 180" />
      </g>
      <g fill="var(--c-emerald-bright)">
        <circle cx="200" cy="79" r="2.6" opacity="0.6" />
        <circle cx="214" cy="128" r="2.2" opacity="0.5" />
        <circle cx="198" cy="163" r="2.4" opacity="0.55" />
      </g>

      {/* Fragment cards */}
      <g transform="translate(122 88)">
        <rect width="30" height="16" rx="4" fill="#101f22" stroke="var(--c-emerald-core)" strokeOpacity="0.35" />
        <rect x="6" y="6" width="18" height="2.4" rx="1.2" fill="var(--c-ivory)" fillOpacity="0.3" />
      </g>
      <g transform="translate(122 124)">
        <rect width="30" height="16" rx="4" fill="#101f22" stroke="var(--c-emerald-core)" strokeOpacity="0.35" />
        <rect x="6" y="6" width="14" height="2.4" rx="1.2" fill="var(--c-ivory)" fillOpacity="0.3" />
      </g>
      <g transform="translate(122 160)">
        <rect width="30" height="16" rx="4" fill="#101f22" stroke="var(--c-emerald-core)" strokeOpacity="0.35" />
        <rect x="6" y="6" width="20" height="2.4" rx="1.2" fill="var(--c-ivory)" fillOpacity="0.3" />
      </g>

      {/* The grounded answer: connected nodes, one illuminated */}
      <g stroke="var(--c-emerald-core)" strokeOpacity="0.34" strokeWidth="1.2">
        <path d="M290 66 336 100M336 100 302 148M302 148 268 118M268 118 290 66M336 100 290 66" />
      </g>
      <g fill="var(--c-emerald-core)" fillOpacity="0.55">
        <circle cx="290" cy="66" r="6" />
        <circle cx="302" cy="148" r="5" />
        <circle cx="268" cy="118" r="5" />
      </g>
      <circle cx="336" cy="100" r="9" fill="var(--c-emerald-bright)" />
      <circle cx="336" cy="100" r="17" stroke="var(--c-emerald-bright)" strokeOpacity="0.32" />
      <circle cx="336" cy="100" r="25" stroke="var(--c-emerald-core)" strokeOpacity="0.16" />
    </svg>
  );
}
