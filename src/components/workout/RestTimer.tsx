'use client';

import { useState, useEffect } from 'react';
import { SkipForward } from 'lucide-react';

interface RestTimerProps {
  isOpen: boolean;
  restSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ isOpen, restSeconds, onComplete, onSkip }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(restSeconds);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(restSeconds);
      return;
    }

    if (timeLeft <= 0) {
      // Vibrate if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft, restSeconds, onComplete]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((restSeconds - timeLeft) / restSeconds) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-sm animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Rest Time</h2>
          </div>

          {/* Timer Display */}
          <div className="p-8 flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative w-48 h-48 mb-6">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-800"
                />
                {/* Progress Circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="text-blue-500 transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white tabular-nums">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400 mt-1">remaining</div>
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={onSkip}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
            >
              <SkipForward className="w-5 h-5" />
              Skip Rest
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
