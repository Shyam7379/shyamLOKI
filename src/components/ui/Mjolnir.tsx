import React from 'react';

interface MjolnirProps {
  size?: number;
  className?: string;
  isCharged?: boolean;
}

/**
 * Mjolnir — Thor's legendary war hammer rendered in high-fidelity SVG.
 * Features:
 * - Authentic beveled Uru metal hammerhead with Norse triquetra engravings
 * - Leather-wrapped grip with silver spacer rings
 * - Pommel cap with hanging wrist loop strap
 * - Crackling Asgardian electric lightning aura and animated sparks
 */
export const Mjolnir: React.FC<MjolnirProps> = ({
  size = 38,
  className = '',
  isCharged = false,
}) => {
  return (
    <div
      className={`mjolnir-companion ${className} ${isCharged ? 'mjolnir-companion--charged' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mjolnir-svg"
      >
        <defs>
          {/* Uru metal primary gradient */}
          <linearGradient id="uru-head" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#d5e1ec" />
            <stop offset="25%" stopColor="#94a3b3" />
            <stop offset="60%" stopColor="#5b6978" />
            <stop offset="100%" stopColor="#333f4d" />
          </linearGradient>

          {/* Uru bevel highlights */}
          <linearGradient id="uru-bevel-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7a8999" />
          </linearGradient>

          <linearGradient id="uru-bevel-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252f3a" />
            <stop offset="100%" stopColor="#151b22" />
          </linearGradient>

          {/* Norse rune glowing cyan gradient */}
          <linearGradient id="rune-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Leather handle wrap gradient */}
          <linearGradient id="leather-wrap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2c1a0e" />
            <stop offset="35%" stopColor="#53311c" />
            <stop offset="65%" stopColor="#78492a" />
            <stop offset="100%" stopColor="#1f1209" />
          </linearGradient>

          {/* Silver fittings gradient */}
          <linearGradient id="silver-fitting" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Blue electric glow filter */}
          <filter id="lightning-aura" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Lightning Sparks (Background Crackle) ───────────────────── */}
        <g className="mjolnir-sparks" filter="url(#lightning-aura)">
          <path
            d="M22 28 L15 22 L20 18 L12 12"
            stroke="#67e8f9"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-arc spark-arc--1"
          />
          <path
            d="M78 26 L86 20 L82 14 L90 10"
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-arc spark-arc--2"
          />
          <path
            d="M32 46 L26 54 L30 58 L22 64"
            stroke="#a5f3fc"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-arc spark-arc--3"
          />
          <path
            d="M68 46 L76 52 L72 58 L80 62"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-arc spark-arc--4"
          />
        </g>

        {/* ── Leather Wrist Loop Strap ───────────────────────────────── */}
        <path
          d="M50 88 C 50 94, 58 98, 56 102 C 54 105, 46 104, 44 98 C 42 93, 48 90, 48 88"
          stroke="#422513"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 88 C 50 94, 58 98, 56 102 C 54 105, 46 104, 44 98 C 42 93, 48 90, 48 88"
          stroke="#693b1d"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Handle Shaft ───────────────────────────────────────────── */}
        {/* Leather base */}
        <rect
          x="46"
          y="42"
          width="8"
          height="45"
          rx="1"
          fill="url(#leather-wrap)"
          stroke="#1c1008"
          strokeWidth="0.8"
        />

        {/* Leather diagonal binding ridges */}
        <g stroke="#1a0c05" strokeWidth="1.2" opacity="0.75">
          <line x1="46" y1="48" x2="54" y2="51" />
          <line x1="46" y1="54" x2="54" y2="57" />
          <line x1="46" y1="60" x2="54" y2="63" />
          <line x1="46" y1="66" x2="54" y2="69" />
          <line x1="46" y1="72" x2="54" y2="75" />
          <line x1="46" y1="78" x2="54" y2="81" />
        </g>

        {/* Silver spacer rings */}
        <rect x="45" y="44" width="10" height="2" rx="0.5" fill="url(#silver-fitting)" />
        <rect x="45" y="58" width="10" height="2" rx="0.5" fill="url(#silver-fitting)" />
        <rect x="45" y="72" width="10" height="2" rx="0.5" fill="url(#silver-fitting)" />

        {/* Handle Collar (connects to head) */}
        <path
          d="M44 40 L56 40 L54 44 L46 44 Z"
          fill="url(#silver-fitting)"
          stroke="#202934"
          strokeWidth="0.8"
        />

        {/* Pommel Cap (bottom of handle) */}
        <path
          d="M44 87 L56 87 L55 90 L45 90 Z"
          fill="url(#silver-fitting)"
          stroke="#202934"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="89" r="2" fill="#cbd5e1" />

        {/* ── Mjolnir Hammerhead (Iconic Chamfered Uru Block) ──────────── */}
        {/* Main Body with Chamfered Octagonal Silhouette */}
        <path
          d="M24 16 L76 16 L84 24 L84 36 L76 42 L24 42 L16 36 L16 24 Z"
          fill="url(#uru-head)"
          stroke="#1e293b"
          strokeWidth="1.2"
        />

        {/* Top Chamfer Bevel Highlight */}
        <path
          d="M24 16 L76 16 L73 20 L27 20 Z"
          fill="url(#uru-bevel-top)"
          opacity="0.9"
        />

        {/* Bottom Chamfer Bevel Shadow */}
        <path
          d="M24 42 L76 42 L73 38 L27 38 Z"
          fill="url(#uru-bevel-dark)"
        />

        {/* Left Side Face Bevel */}
        <path
          d="M16 24 L24 16 L27 20 L20 27 L20 33 L27 38 L24 42 L16 36 Z"
          fill="url(#uru-bevel-dark)"
          opacity="0.85"
        />

        {/* Right Side Face Bevel */}
        <path
          d="M84 24 L76 16 L73 20 L80 27 L80 33 L73 38 L76 42 L84 36 Z"
          fill="url(#uru-bevel-top)"
          opacity="0.65"
        />

        {/* Center Recessed Engraving Plate */}
        <rect
          x="27"
          y="20"
          width="46"
          height="18"
          rx="1.5"
          fill="#3b4754"
          stroke="#1e2732"
          strokeWidth="0.8"
        />

        {/* Inner Border Runes Detail */}
        <rect
          x="29"
          y="22"
          width="42"
          height="14"
          rx="1"
          fill="none"
          stroke="#4f5e6d"
          strokeWidth="0.6"
          strokeDasharray="2 1.5"
        />

        {/* Norse Triquetra (Trinity Knot) Symbol on Hammer Face */}
        <g
          className="mjolnir-triquetra"
          stroke="url(#rune-glow)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#lightning-aura)"
        >
          {/* Triquetra loops */}
          <path d="M50 25 C 43 27, 43 33, 50 35 C 57 33, 57 27, 50 25" />
          <path d="M47 31 C 44 37, 50 39, 53 35 C 50 31, 45 28, 47 31" />
          <path d="M53 31 C 56 37, 50 39, 47 35 C 50 31, 55 28, 53 31" />
          {/* Inner circle connecting the rune */}
          <circle cx="50" cy="30" r="3.8" stroke="#38bdf8" strokeWidth="0.8" />
        </g>

        {/* Top Hammer Plate */}
        <rect
          x="38"
          y="13.5"
          width="24"
          height="3"
          rx="1"
          fill="url(#silver-fitting)"
          stroke="#1e293b"
          strokeWidth="0.8"
        />

        {/* Foreground Electric Arc on Hammer Face */}
        <path
          d="M34 29 L42 27 L46 32 L54 28 L60 32 L66 28"
          stroke="#e0f2fe"
          strokeWidth="1"
          strokeLinecap="round"
          className="front-lightning"
        />
      </svg>
    </div>
  );
};
