'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';

interface SetFormProps {
  onSubmit: (set: { weight_kg: number; reps: number; rpe: number }) => void;
  setNumber: number;
  loading?: boolean;
}

export default function SetForm({ onSubmit, setNumber, loading = false }: SetFormProps) {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [rpe, setRpe] = useState<string>('');
  const [errors, setErrors] = useState<{
    weight?: string;
    reps?: string;
    rpe?: string;
  }>({});

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    // Weight validation
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    // Reps validation
    const repsNum = parseInt(reps, 10);
    if (!reps || isNaN(repsNum) || repsNum <= 0 || !Number.isInteger(repsNum)) {
      newErrors.reps = 'Reps must be a positive integer';
    }

    // RPE validation
    const rpeNum = parseInt(rpe, 10);
    if (!rpe || isNaN(rpeNum) || rpeNum < 1 || rpeNum > 10 || !Number.isInteger(rpeNum)) {
      newErrors.rpe = 'RPE must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;

    onSubmit({
      weight_kg: parseFloat(weight),
      reps: parseInt(reps, 10),
      rpe: parseInt(rpe, 10),
    });

    // Reset form
    setWeight('');
    setReps('');
    setRpe('');
    setErrors({});
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'weight' | 'reps' | 'rpe') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Auto-focus next field or submit
      if (field === 'weight' && reps === '') {
        document.getElementById('reps-input')?.focus();
      } else if (field === 'reps' && rpe === '') {
        document.getElementById('rpe-input')?.focus();
      } else if (field === 'rpe' || (weight && reps && rpe)) {
        handleSubmit();
      }
    }
  };

  const isFormValid = weight && reps && rpe;

  return (
    <div className="rounded-lg bg-[#0f1c2e] p-6">
      {/* Set Number Badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/30 text-sm font-bold text-blue-400">
            {setNumber}
          </div>
          <h3 className="text-lg font-semibold text-white">Set {setNumber}</h3>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Weight Input */}
        <div>
          <label htmlFor="weight-input" className="mb-2 block text-sm font-medium text-gray-300">
            Weight (kg)
          </label>
          <input
            id="weight-input"
            type="number"
            inputMode="decimal"
            step="0.5"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (errors.weight) setErrors({ ...errors, weight: undefined });
            }}
            onKeyPress={(e) => handleKeyPress(e, 'weight')}
            placeholder="e.g., 80"
            className={`w-full rounded-lg bg-[#0a1628] px-4 py-4 text-lg text-white placeholder-gray-500 outline-none ring-1 transition-all ${
              errors.weight
                ? 'ring-red-500 focus:ring-2 focus:ring-red-500'
                : 'ring-gray-700 focus:ring-2 focus:ring-blue-500'
            }`}
            disabled={loading}
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-400">{errors.weight}</p>
          )}
        </div>

        {/* Reps Input */}
        <div>
          <label htmlFor="reps-input" className="mb-2 block text-sm font-medium text-gray-300">
            Reps
          </label>
          <input
            id="reps-input"
            type="number"
            inputMode="numeric"
            step="1"
            value={reps}
            onChange={(e) => {
              setReps(e.target.value);
              if (errors.reps) setErrors({ ...errors, reps: undefined });
            }}
            onKeyPress={(e) => handleKeyPress(e, 'reps')}
            placeholder="e.g., 10"
            className={`w-full rounded-lg bg-[#0a1628] px-4 py-4 text-lg text-white placeholder-gray-500 outline-none ring-1 transition-all ${
              errors.reps
                ? 'ring-red-500 focus:ring-2 focus:ring-red-500'
                : 'ring-gray-700 focus:ring-2 focus:ring-blue-500'
            }`}
            disabled={loading}
          />
          {errors.reps && (
            <p className="mt-1 text-sm text-red-400">{errors.reps}</p>
          )}
        </div>

        {/* RPE Input */}
        <div>
          <label htmlFor="rpe-input" className="mb-2 block text-sm font-medium text-gray-300">
            RPE (1-10)
            <span className="ml-2 text-xs text-gray-500">Rate of Perceived Exertion</span>
          </label>
          <input
            id="rpe-input"
            type="number"
            inputMode="numeric"
            step="1"
            min="1"
            max="10"
            value={rpe}
            onChange={(e) => {
              setRpe(e.target.value);
              if (errors.rpe) setErrors({ ...errors, rpe: undefined });
            }}
            onKeyPress={(e) => handleKeyPress(e, 'rpe')}
            placeholder="e.g., 7"
            className={`w-full rounded-lg bg-[#0a1628] px-4 py-4 text-lg text-white placeholder-gray-500 outline-none ring-1 transition-all ${
              errors.rpe
                ? 'ring-red-500 focus:ring-2 focus:ring-red-500'
                : 'ring-gray-700 focus:ring-2 focus:ring-blue-500'
            }`}
            disabled={loading}
          />
          {errors.rpe && (
            <p className="mt-1 text-sm text-red-400">{errors.rpe}</p>
          )}
          {/* RPE Scale Helper */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>1 = Very easy</span>
            <span>10 = Max effort</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold transition-all ${
          !isFormValid || loading
            ? 'cursor-not-allowed bg-gray-700 text-gray-400'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            <span>Log Set {setNumber}</span>
          </>
        )}
      </button>
    </div>
  );
}
