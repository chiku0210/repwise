export function ChestSVG({ className = "" }: { className?: string }) {
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
      
      {/* CHEST - HIGHLIGHTED */}
      <path
        d="M 70 75 Q 75 90 80 110 L 100 125 L 120 110 Q 125 90 130 75 L 100 70 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Torso outline */}
      <path
        d="M 80 110 L 75 150 L 80 200 L 120 200 L 125 150 L 120 110"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Arms */}
      <line x1="70" y1="75" x2="50" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="130" y1="75" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Legs */}
      <line x1="85" y1="200" x2="80" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="115" y1="200" x2="120" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
