'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGate } from '@/components/AuthGate';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import {
  EXPERIENCE_LEVELS,
  FITNESS_GOALS,
  TRAINING_SPLITS,
  GENDER_OPTIONS,
  WEIGHT_UNITS,
  HEIGHT_UNITS,
} from '@/lib/constants/fitness';
import type {
  ExperienceLevel,
  Gender,
  FitnessGoal,
  TrainingSplit,
  WeightUnit,
  HeightUnit,
} from '@/lib/types/profile';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile(user?.id);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '' as Gender | '',
    height_cm: '',
    current_weight_kg: '',
    target_weight_kg: '',
    experience_level: 'beginner' as ExperienceLevel,
    primary_goal: '' as FitnessGoal | '',
    training_frequency: 3,
    preferred_split: '' as TrainingSplit | '',
    weight_unit: 'kg' as WeightUnit,
    height_unit: 'cm' as HeightUnit,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        height_cm: profile.height_cm?.toString() || '',
        current_weight_kg: profile.current_weight_kg?.toString() || '',
        target_weight_kg: profile.target_weight_kg?.toString() || '',
        experience_level: profile.experience_level,
        primary_goal: profile.primary_goal || '',
        training_frequency: profile.training_frequency,
        preferred_split: profile.preferred_split || '',
        weight_unit: profile.weight_unit,
        height_unit: profile.height_unit,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await updateProfile({
      name: formData.name || null,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      current_weight_kg: formData.current_weight_kg ? parseFloat(formData.current_weight_kg) : null,
      target_weight_kg: formData.target_weight_kg ? parseFloat(formData.target_weight_kg) : null,
      experience_level: formData.experience_level,
      primary_goal: formData.primary_goal || null,
      training_frequency: formData.training_frequency,
      preferred_split: formData.preferred_split || null,
      weight_unit: formData.weight_unit,
      height_unit: formData.height_unit,
    });

    setSaving(false);

    if (result?.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => router.push('/profile'), 1500);
    } else {
      setMessage({ type: 'error', text: result?.error || 'Failed to update profile' });
    }
  };

  if (loading) {
    return (
      <AuthGate>
        <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
          <p className="text-gray-400">Loading...</p>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <main className="min-h-screen bg-[#0a1628] pb-20">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0a1628] p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Message */}
            {message && (
              <div
                className={`rounded-lg p-4 ${
                  message.type === 'success'
                    ? 'bg-green-900/20 text-green-400'
                    : 'bg-red-900/20 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Personal Info */}
            <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6">
              <h2 className="text-lg font-semibold text-white">Personal Info</h2>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Date of Birth</label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Body Stats */}
            <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6">
              <h2 className="text-lg font-semibold text-white">Body Stats</h2>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height_cm}
                  onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                  placeholder="170"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.current_weight_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, current_weight_kg: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Target Weight (kg, optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.target_weight_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, target_weight_kg: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                  placeholder="65"
                />
              </div>
            </div>

            {/* Fitness Profile */}
            <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6">
              <h2 className="text-lg font-semibold text-white">Fitness Profile</h2>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_level: e.target.value as ExperienceLevel })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Primary Goal</label>
                <select
                  value={formData.primary_goal}
                  onChange={(e) =>
                    setFormData({ ...formData, primary_goal: e.target.value as FitnessGoal })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  <option value="">Select goal</option>
                  {FITNESS_GOALS.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.icon} {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Training Frequency (days/week)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.training_frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, training_frequency: parseInt(e.target.value) })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Preferred Split</label>
                <select
                  value={formData.preferred_split}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_split: e.target.value as TrainingSplit })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  <option value="">Select split</option>
                  {TRAINING_SPLITS.map((split) => (
                    <option key={split.value} value={split.value}>
                      {split.label} - {split.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4 rounded-lg bg-[#0f1e33] p-6">
              <h2 className="text-lg font-semibold text-white">Units & Preferences</h2>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Weight Unit</label>
                <select
                  value={formData.weight_unit}
                  onChange={(e) =>
                    setFormData({ ...formData, weight_unit: e.target.value as WeightUnit })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  {WEIGHT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">Height Unit</label>
                <select
                  value={formData.height_unit}
                  onChange={(e) =>
                    setFormData({ ...formData, height_unit: e.target.value as HeightUnit })
                  }
                  className="w-full rounded-lg bg-[#0a1628] px-4 py-2 text-white outline-none ring-1 ring-gray-700 focus:ring-blue-600"
                >
                  {HEIGHT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              size="lg"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Profile
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </AuthGate>
  );
}
