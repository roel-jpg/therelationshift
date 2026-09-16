// Doctor Love as a friendly little character, drawn by hand so it carries the brand colours.
export function DoctorLoveAvatar({ size = 40, id = 'dl' }: { size?: number; id?: string }) {
  const g = `${id}-grad`;
  const clip = `${id}-clip`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Doctor Love">
      <defs>
        <linearGradient id={g} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F05F61" />
          <stop offset="100%" stopColor="#FBB022" />
        </linearGradient>
        <clipPath id={clip}><circle cx="60" cy="60" r="60" /></clipPath>
      </defs>

      <g clipPath={`url(#${clip})`}>
        <circle cx="60" cy="60" r="60" fill={`url(#${g})`} />

        {/* white coat and shoulders */}
        <path d="M18 120c0-19 19-30 42-30s42 11 42 30z" fill="#ffffff" />
        <path d="M60 90c-7 0-13 2-13 2l13 16 13-16s-6-2-13-2z" fill="#fdf6ef" />
        {/* collar */}
        <path d="M47 92l13 12-6 6-11-14zM73 92L60 104l6 6 11-14z" fill="#f0ebe5" />
        {/* little heart badge on the coat */}
        <path d="M84 104c-2-2-5-2-6 0-1-2-4-2-6 0-1 2 0 4 2 6l4 4 4-4c2-2 3-4 2-6z" fill="#F05F61" />

        {/* neck */}
        <rect x="53" y="76" width="14" height="16" rx="7" fill="#e8b48e" />

        {/* hair behind */}
        <path d="M27 60c0-21 15-35 33-35s33 14 33 35c0 12-2 22-6 27 1-10 0-19-2-25-6 3-16 5-25 5s-19-2-25-5c-2 6-3 15-2 25-4-5-6-15-6-27z" fill="#4a3b35" />

        {/* face */}
        <ellipse cx="60" cy="58" rx="27" ry="29" fill="#f7d3b3" />
        <ellipse cx="60" cy="58" rx="27" ry="29" fill="none" stroke="#eec0a0" strokeWidth="0.8" />

        {/* fringe */}
        <path d="M33 54c0-17 12-28 27-28s27 11 27 28c-4-8-11-13-20-14-3 5-9 9-17 10-8 1-13 1-17 4z" fill="#4a3b35" />

        {/* eyes */}
        <ellipse cx="50" cy="58" rx="3.2" ry="3.6" fill="#3a2f2a" />
        <ellipse cx="70" cy="58" rx="3.2" ry="3.6" fill="#3a2f2a" />
        <circle cx="51.2" cy="56.8" r="1.1" fill="#ffffff" />
        <circle cx="71.2" cy="56.8" r="1.1" fill="#ffffff" />

        {/* brows */}
        <path d="M45 50.5c2-2 6-2.4 8.6-1" fill="none" stroke="#4a3b35" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M66.4 49.5c2.6-1.4 6.6-1 8.6 1" fill="none" stroke="#4a3b35" strokeWidth="1.8" strokeLinecap="round" />

        {/* blush */}
        <ellipse cx="44" cy="66" rx="5" ry="3.4" fill="#f4a09a" opacity=".55" />
        <ellipse cx="76" cy="66" rx="5" ry="3.4" fill="#f4a09a" opacity=".55" />

        {/* smile */}
        <path d="M51 69c3 4.2 15 4.2 18 0" fill="none" stroke="#a9614a" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
