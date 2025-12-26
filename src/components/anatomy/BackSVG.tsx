export function BackSVG({ className = "" }: { className?: string }) {
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
      
      {/* BACK - HIGHLIGHTED (trapezius + lats) */}
      <path
        d="M 70 75 L 75 110 L 80 140 L 85 180 L 100 175 L 115 180 L 120 140 L 125 110 L 130 75 L 100 70 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      
      {/* Lower back */}
      <path
        d="M 85 180 L 80 200 L 85 210 L 115 210 L 120 200 L 115 180"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      
      {/* Arms */}
      <line x1="70" y1="75" x2="50" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="130" y1="75" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      
      {/* Legs */}
      <line x1="85" y1="210" x2="80" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <line x1="115" y1="210" x2="120" y2="270" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
