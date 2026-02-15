'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface FormCuesCollapsibleProps {
  cues: string[];
}

export function FormCuesCollapsible({ cues }: FormCuesCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!cues || cues.length === 0) return null;

  return (
    <div className="bg-[#0f1c2e] rounded-lg border border-gray-800 overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-white">Form Cues</span>
          <span className="text-xs text-gray-400">({cues.length} tips)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          <ul className="space-y-2 pt-3">
            {cues.map((cue, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">
                  {index + 1}.
                </span>
                <span className="leading-relaxed">{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
