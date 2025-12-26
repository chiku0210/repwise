export function ShouldersSVG({ className = "" }: { className?: string }) {
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
      
      {/* SHOULDERS - HIGHLIGHTED (deltoids) */}
      <ellipse
        cx="70"
        cy="85"
        rx="18"
        ry="25"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <ellipse
        cx="130"
        cy="85"
        rx="18"
        ry="25"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Chest */}
      <path
        d="M 80 75 Q 85 90 90 110 L 100 120 L 110 110 Q 115 90 120 75"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Torso */}
      <path
        d="M 90 110 L 85 150 L 90 200 L 110 200 L 115 150 L 110 110"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Arms */}
      <line x1="55" y1="95" x2="50" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="145" y1="95" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Legs */}
      <line x1="93" y1="200" x2="88" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="107" y1="200" x2="112" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
