'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface SetInputFormProps {
  setNumber: number;
  onSubmit: (data: { weight_kg: number; reps: number; rpe: number }) => void;
  loading?: boolean;
  lastSetData?: { weight_kg: number; reps: number; rpe: number } | null;
}

export function SetInputForm({ setNumber, onSubmit, loading = false, lastSetData }: SetInputFormProps) {
  const [weight, setWeight] = useState(lastSetData?.weight_kg?.toString() || '');
  const [reps, setReps] = useState(lastSetData?.reps?.toString() || '');
  const [rpe, setRpe] = useState(lastSetData?.rpe || 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    if (isNaN(repsNum) || repsNum <= 0) {
      alert('Please enter valid reps');
      return;
    }

    onSubmit({ weight_kg: weightNum, reps: repsNum, rpe });

    // Keep weight, reset reps, keep RPE for next set
    setReps('');
  };

  // RPE emoji mapping
  const getRPEEmoji = (rpeValue: number): string => {
    if (rpeValue <= 3) return '😌'; // Relaxed
    if (rpeValue <= 5) return '🙂'; // Slightly smiling
    if (rpeValue <= 7) return '😐'; // Neutral
    if (rpeValue <= 9) return '😤'; // Tired
    return '😤'; // Exhausted
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1c2e] rounded-lg p-4 border border-gray-800 space-y-4">
      {/* Set Number Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Set {setNumber}</h3>
        {lastSetData && (
          <span className="text-xs text-gray-400">
            Last: {lastSetData.weight_kg}kg × {lastSetData.reps} @ RPE {lastSetData.rpe}
          </span>
        )}
      </div>

      {/* Weight & Reps Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="w-full bg-[#0a1628] text-white text-lg font-semibold rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            disabled={loading}
            required
          />
        </div>

        {/* Reps Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Reps</label>
          <input
            type="number"
            step="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="w-full bg-[#0a1628] text-white text-lg font-semibold rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* RPE Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-400">RPE (Effort)</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getRPEEmoji(rpe)}</span>
            <span className="text-2xl font-bold text-white">{rpe}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={rpe}
            onChange={(e) => setRpe(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={loading}
          />
          
          {/* Emoji indicators on ends */}
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="flex items-center gap-1 text-gray-400">
              <span className="text-lg">😌</span> Easy
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              Hard <span className="text-lg">😤</span>
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-500 hover:to-green-600 transition-all active:scale-[0.98] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
      >
        <Plus className="w-6 h-6" />
        {loading ? 'Logging...' : 'Log Set'}
      </button>

      {/* CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
          border: 2px solid white;
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #4b5563;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          background: #4b5563;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
