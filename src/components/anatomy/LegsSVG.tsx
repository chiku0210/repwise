export function LegsSVG({ className = "" }: { className?: string }) {
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
      
      {/* Arms */}
      <line x1="70" y1="75" x2="50" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="130" y1="75" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* LEGS - HIGHLIGHTED (quads + hamstrings + calves) */}
      {/* Left leg */}
      <path
        d="M 90 200 L 85 230 L 83 250 L 80 270"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="1"
      />
      <ellipse
        cx="85"
        cy="220"
        rx="9"
        ry="25"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Right leg */}
      <path
        d="M 110 200 L 115 230 L 117 250 L 120 270"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="1"
      />
      <ellipse
        cx="115"
        cy="220"
        rx="9"
        ry="25"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Calves highlight */}
      <ellipse cx="83" cy="258" rx="6" ry="12" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="117" cy="258" rx="6" ry="12" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}
