'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Search, X, Dumbbell, AlertCircle } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  is_compound: boolean;
}

interface Muscle {
  id: string;
  name: string;
  group: string;
}

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

const MUSCLE_GROUPS = ['Push', 'Pull', 'Legs', 'Core', 'All'];

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscles, setMuscles] = useState<Muscle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises and muscles on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    async function fetchData() {
      try {
        const supabase = getSupabaseBrowserClient();

        console.log('Fetching exercises and muscles...');

        // Fetch exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('id, name, equipment, primary_muscles, secondary_muscles, is_compound')
          .order('name');

        console.log('Exercises response:', { data: exercisesData, error: exercisesError });

        if (exercisesError) {
          console.error('Exercise fetch error:', exercisesError);
          throw new Error(`Failed to fetch exercises: ${exercisesError.message}`);
        }

        if (!exercisesData || exercisesData.length === 0) {
          throw new Error(
            'No exercises found. Please ensure: 1) The exercises table exists, 2) It has data, 3) RLS policies allow public read access'
          );
        }

        // Fetch muscles
        const { data: musclesData, error: musclesError } = await supabase
          .from('muscles')
          .select('id, name, group')
          .order('name');

        console.log('Muscles response:', { data: musclesData, error: musclesError });

        if (musclesError) {
          console.error('Muscle fetch error:', musclesError);
          throw new Error(`Failed to fetch muscles: ${musclesError.message}`);
        }

        if (!musclesData || musclesData.length === 0) {
          throw new Error(
            'No muscles found. Please ensure: 1) The muscles table exists, 2) It has data, 3) RLS policies allow public read access'
          );
        }

        setExercises(exercisesData);
        setMuscles(musclesData);
        
        // Log unique muscle groups for debugging
        const uniqueGroups = [...new Set(musclesData.map(m => m.group))];
        console.log('Unique muscle groups in database:', uniqueGroups);
        console.log('Data loaded successfully:', {
          exerciseCount: exercisesData.length,
          muscleCount: musclesData.length,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load exercises. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get muscle name by ID
  const getMuscleNameById = (muscleId: string): string => {
    const muscle = muscles.find((m) => m.id === muscleId);
    return muscle?.name || '';
  };

  // Filter exercises by search and muscle group
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.equipment.toLowerCase().includes(query) ||
          ex.primary_muscles.some((muscleId) =>
            getMuscleNameById(muscleId).toLowerCase().includes(query)
          )
      );
    }

    // Filter by muscle group (case-insensitive)
    if (selectedMuscleGroup !== 'All') {
      filtered = filtered.filter((ex) => {
        const primaryMuscleGroups = ex.primary_muscles
          .map((muscleId) => {
            const muscle = muscles.find((m) => m.id === muscleId);
            return muscle?.group;
          })
          .filter(Boolean);

        // Case-insensitive comparison
        const hasMatchingGroup = primaryMuscleGroups.some(
          (group) => group?.toLowerCase() === selectedMuscleGroup.toLowerCase()
        );

        // Debug log for first exercise when filter is active
        if (ex === exercises[0]) {
          console.log('Filter Debug:', {
            selectedMuscleGroup,
            exerciseName: ex.name,
            primaryMuscleGroups,
            hasMatch: hasMatchingGroup,
          });
        }

        return hasMatchingGroup;
      });
    }

    console.log(`Filtered exercises: ${filtered.length} of ${exercises.length}`);
    return filtered;
  }, [exercises, muscles, searchQuery, selectedMuscleGroup]);

  const handleExerciseSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl rounded-t-2xl bg-[#0f1c2e] sm:rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-xl font-bold text-white">Select Exercise</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full rounded-lg bg-[#0a1628] py-3 pl-10 pr-4 text-white placeholder-gray-400 outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={loading || !!error}
            />
          </div>
        </div>

        {/* Muscle Group Filter */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {MUSCLE_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedMuscleGroup(group)}
                disabled={loading || !!error}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedMuscleGroup === group
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-900/20 p-6 border border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-400 mb-2">Database Error</h3>
                  <p className="text-sm text-red-300 mb-4">{error}</p>
                  <div className="text-xs text-red-400/80 space-y-1">
                    <p className="font-semibold">Common fixes:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Check if tables 'exercises' and 'muscles' exist in Supabase</li>
                      <li>Ensure tables have data (run seed scripts if needed)</li>
                      <li>Verify RLS policies allow public SELECT access</li>
                      <li>Check browser console for detailed error logs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Dumbbell className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>No exercises found</p>
              <p className="mt-1 text-sm">Try adjusting your search or filters</p>
              {selectedMuscleGroup !== 'All' && (
                <p className="mt-2 text-xs text-gray-500">
                  Check console for filter debug info
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExercises.map((exercise) => {
                const primaryMuscleNames = exercise.primary_muscles
                  .map(getMuscleNameById)
                  .filter(Boolean)
                  .join(', ');

                return (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                    className="w-full rounded-lg bg-[#0a1628] p-4 text-left transition-all hover:bg-[#152235] hover:ring-2 hover:ring-blue-500 active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{exercise.name}</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {primaryMuscleNames || 'No muscle data'}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-1">
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                          {exercise.equipment}
                        </span>
                        {exercise.is_compound && (
                          <span className="rounded-full bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-400">
                            Compound
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
