export function CoreSVG({ className = "" }: { className?: string }) {
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
      
      {/* Chest */}
      <path
        d="M 80 75 Q 85 90 90 110 L 110 110 Q 115 90 120 75"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* CORE - HIGHLIGHTED (abs + obliques) */}
      <path
        d="M 90 110 L 85 150 L 90 200 L 110 200 L 115 150 L 110 110 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Ab segments */}
      <line x1="95" y1="125" x2="105" y2="125" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="93" y1="140" x2="107" y2="140" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="92" y1="155" x2="108" y2="155" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="93" y1="170" x2="107" y2="170" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="95" y1="185" x2="105" y2="185" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      
      {/* Vertical line */}
      <line x1="100" y1="110" x2="100" y2="200" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      
      {/* Arms */}
      <line x1="70" y1="75" x2="50" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="130" y1="75" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Legs */}
      <line x1="93" y1="200" x2="88" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="107" y1="200" x2="112" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
