/**
 * The branching-timeline decoration set.
 *
 * All three pieces are original vector work built from the same vocabulary:
 * a straight trunk that forks, curving tips, and small nodes at the split
 * points. They are decorative only — every one is aria-hidden and they carry no
 * information that is not also in the markup.
 */

/** Section divider: a trunk that splits into three and rejoins. */
export function BranchDivider({ className }: { className?: string }) {
  return (
    <div className={`divider ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 640 64" fill="none">
        <defs>
          <linearGradient id="bd-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--c-gold)" stopOpacity="0" />
            <stop offset="18%" stopColor="var(--c-gold)" stopOpacity="0.55" />
            <stop offset="50%" stopColor="var(--c-emerald-core)" stopOpacity="0.8" />
            <stop offset="82%" stopColor="var(--c-gold)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--c-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* trunk */}
        <path d="M0 32h196M444 32h196" stroke="url(#bd-line)" strokeWidth="1" />

        {/* the split */}
        <path
          d="M196 32C244 32 250 6 300 6h40c50 0 56 26 104 26"
          stroke="url(#bd-line)"
          strokeWidth="1"
        />
        <path
          d="M196 32C244 32 250 58 300 58h40c50 0 56-26 104-26"
          stroke="url(#bd-line)"
          strokeWidth="1"
        />
        <path
          d="M196 32c72 0 88-32 152-32h72"
          stroke="var(--c-emerald-core)"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* nodes */}
        <circle cx="320" cy="32" r="3.2" fill="var(--c-emerald-bright)" />
        <circle cx="320" cy="32" r="7.5" stroke="var(--c-emerald-core)" strokeOpacity="0.45" />
        <circle cx="196" cy="32" r="2" fill="var(--c-gold)" fillOpacity="0.8" />
        <circle cx="444" cy="32" r="2" fill="var(--c-gold)" fillOpacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Hero overlay: a wide fan of timeline veins that drift very slowly.
 * Pointer-events none, low opacity, transforms only (composited, no repaint).
 */
export function TimelineVeins({ className }: { className?: string }) {
  return (
    <svg
      className={`veins ${className ?? ''}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vein-a" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--c-emerald-core)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--c-emerald-bright)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--c-gold)" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="vein-b" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--c-emerald-core)" stopOpacity="0" />
          <stop offset="55%" stopColor="var(--c-emerald-core)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--c-gold)" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <g className="veins__group veins__group--a" stroke="url(#vein-a)" strokeWidth="1.1">
        <path d="M-40 980C180 880 300 700 420 520c110-165 150-330 130-520" />
        <path d="M180 980c150-130 250-290 300-470 40-148 30-300-30-460" />
        <path d="M420 980c110-180 150-360 150-540 0-140-30-270-90-380" />
      </g>

      <g className="veins__group veins__group--b" stroke="url(#vein-b)" strokeWidth="1">
        <path d="M1480 980c-180-110-320-260-420-440-90-160-130-320-120-500" />
        <path d="M1240 980c-130-170-210-350-240-540-20-140 10-280 70-400" />
        <path d="M1010 980c-60-190-80-380-60-560 14-140 60-260 140-350" />
      </g>

      <g className="veins__nodes" fill="var(--c-emerald-bright)">
        <circle cx="420" cy="520" r="2.6" opacity="0.55" />
        <circle cx="600" cy="300" r="2" opacity="0.4" />
        <circle cx="940" cy="470" r="2.4" opacity="0.5" />
        <circle cx="830" cy="200" r="1.8" opacity="0.35" />
      </g>
    </svg>
  );
}
