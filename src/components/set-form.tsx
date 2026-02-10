'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

// Validation constants
const MAX_WEIGHT_KG = 500;
const MAX_REPS = 100;
const DEFAULT_RPE = 7;
const MIN_RPE = 1;
const MAX_RPE = 10;
const RPE_STEP = 0.5;

interface SetFormProps {
  onSubmit: (data: { weight_kg: number; reps: number; rpe: number }) => Promise<void>;
  setNumber: number;
  loading: boolean;
}

export default function SetForm({ onSubmit, setNumber, loading }: SetFormProps) {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rpe, setRpe] = useState<number>(DEFAULT_RPE);
  const [errors, setErrors] = useState<{ weight?: string; reps?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { weight?: string; reps?: string } = {};

    // Validate weight
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = 'Enter valid weight';
    } else if (weightNum > MAX_WEIGHT_KG) {
      newErrors.weight = `Weight must be under ${MAX_WEIGHT_KG}kg`;
    }

    // Validate reps
    const repsNum = parseInt(reps);
    if (!reps || isNaN(repsNum) || repsNum <= 0) {
      newErrors.reps = 'Enter valid reps';
    } else if (repsNum > MAX_REPS) {
      newErrors.reps = `Reps must be under ${MAX_REPS}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    await onSubmit({
      weight_kg: weightNum,
      reps: repsNum,
      rpe: rpe,
    });

    // Clear form after successful submit
    // Keep weight and RPE, clear reps
    setReps('');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-[#0f1c2e] p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Set {setNumber}</h3>

      {/* Weight and Reps Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weight Input */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (errors.weight) setErrors({ ...errors, weight: undefined });
            }}
            placeholder="0"
            disabled={loading}
            className={`w-full rounded-lg bg-[#0a1628] px-4 py-3 text-lg text-white placeholder-gray-500 outline-none ring-1 transition-all disabled:opacity-50 ${
              errors.weight
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-gray-700 focus:ring-2 focus:ring-blue-500'
            }`}
          />
          {errors.weight && <p className="mt-1 text-xs text-red-400">{errors.weight}</p>}
        </div>

        {/* Reps Input */}
        <div>
          <label htmlFor="reps" className="block text-sm font-medium text-gray-300 mb-2">
            Reps
          </label>
          <input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => {
              setReps(e.target.value);
              if (errors.reps) setErrors({ ...errors, reps: undefined });
            }}
            placeholder="0"
            disabled={loading}
            className={`w-full rounded-lg bg-[#0a1628] px-4 py-3 text-lg text-white placeholder-gray-500 outline-none ring-1 transition-all disabled:opacity-50 ${
              errors.reps
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-gray-700 focus:ring-2 focus:ring-blue-500'
            }`}
          />
          {errors.reps && <p className="mt-1 text-xs text-red-400">{errors.reps}</p>}
        </div>
      </div>

      {/* RPE Slider */}
      <div>
        <label htmlFor="rpe" className="block text-sm font-medium text-gray-300 mb-2">
          RPE (Rate of Perceived Exertion): <span className="text-blue-400 font-semibold">{rpe}</span>
        </label>
        <input
          id="rpe"
          type="range"
          min={MIN_RPE}
          max={MAX_RPE}
          step={RPE_STEP}
          value={rpe}
          onChange={(e) => setRpe(parseFloat(e.target.value))}
          disabled={loading}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{MIN_RPE} - Easy</span>
          <span>5 - Moderate</span>
          <span>{MAX_RPE} - Max</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !weight || !reps}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-all disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        <Plus className="h-5 w-5" />
        {loading ? 'Logging...' : 'Log Set'}
      </button>
    </form>
  );
}
