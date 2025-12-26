export function ArmsSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="100" cy="30" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Neck */}
      <line x1="100" y1="50" x2="100" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Shoulders */}
      <line x1="70" y1="75" x2="100" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="130" y1="75" x2="100" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Chest/Torso */}
      <path
        d="M 80 75 Q 85 90 90 110 L 110 110 Q 115 90 120 75"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M 90 110 L 85 150 L 90 200 L 110 200 L 115 150 L 110 110"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* ARMS - HIGHLIGHTED (biceps + triceps) */}
      {/* Left arm */}
      <ellipse
        cx="55"
        cy="110"
        rx="10"
        ry="30"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M 50 130 L 45 160 L 48 170"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Right arm */}
      <ellipse
        cx="145"
        cy="110"
        rx="10"
        ry="30"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M 150 130 L 155 160 L 152 170"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <line x1="93" y1="200" x2="88" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="107" y1="200" x2="112" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
