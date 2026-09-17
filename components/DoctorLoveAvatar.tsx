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

        {/* long hair, falling over the shoulders */}
        <path d="M24 62c0-23 16-38 36-38s36 15 36 38c0 16-1 28-3 38-3 12-6 18-9 20 2-12 3-26 2-36-7 4-16 6-26 6s-19-2-26-6c-1 10 0 24 2 36-3-2-6-8-9-20-2-10-3-22-3-38z" fill="#4a3b35" />
        <path d="M31 96c-1 8-1 15 0 20-3-3-5-10-6-18zM89 96c1 8 1 15 0 20 3-3 5-10 6-18z" fill="#3d322c" />

        {/* face */}
        <ellipse cx="60" cy="58" rx="27" ry="29" fill="#f7d3b3" />
        <ellipse cx="60" cy="58" rx="27" ry="29" fill="none" stroke="#eec0a0" strokeWidth="0.8" />

        {/* side-swept fringe */}
        <path d="M33 54c0-17 12-28 27-28s27 11 27 28c-3-9-9-15-16-17-2 6-10 11-20 12-7 1-14 2-18 5z" fill="#4a3b35" />

        {/* eyes with lashes */}
        <ellipse cx="50" cy="58" rx="3.2" ry="3.6" fill="#3a2f2a" />
        <ellipse cx="70" cy="58" rx="3.2" ry="3.6" fill="#3a2f2a" />
        <circle cx="51.2" cy="56.8" r="1.1" fill="#ffffff" />
        <circle cx="71.2" cy="56.8" r="1.1" fill="#ffffff" />
        <path d="M45.6 55.4c1.4-1.6 3.4-2.4 5.4-2.4M74.4 55.4c-1.4-1.6-3.4-2.4-5.4-2.4" fill="none" stroke="#3a2f2a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M45.2 53.4l-2.2-1.6M74.8 53.4l2.2-1.6" fill="none" stroke="#3a2f2a" strokeWidth="1.4" strokeLinecap="round" />

        {/* brows */}
        <path d="M45 50.5c2-2 6-2.4 8.6-1" fill="none" stroke="#4a3b35" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M66.4 49.5c2.6-1.4 6.6-1 8.6 1" fill="none" stroke="#4a3b35" strokeWidth="1.8" strokeLinecap="round" />

        {/* blush */}
        <ellipse cx="44" cy="66" rx="5" ry="3.4" fill="#f4a09a" opacity=".55" />
        <ellipse cx="76" cy="66" rx="5" ry="3.4" fill="#f4a09a" opacity=".55" />

        {/* smile */}
        <path d="M52 69.2c3 4 13 4 16 0 0 0-2 5.4-8 5.4s-8-5.4-8-5.4z" fill="#d4565c" />
        <path d="M52 69.2c3 1.2 13 1.2 16 0" fill="none" stroke="#b6474d" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
