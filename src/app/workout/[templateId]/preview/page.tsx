'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Clock, Dumbbell, Play } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { DifficultyBadge } from '@/components/workout/DifficultyBadge';
import { ExercisePreviewCard } from '@/components/workout/ExercisePreviewCard';
import { BottomNav } from '@/components/ui/bottom-nav';

interface Exercise {
  exercise_id: string;
  exercise_name: string;
  target_sets: number;
  reps_range: string;
  rest_seconds: number;
  order_index: number;
  notes?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_minutes: number;
  equipment_needed: string[];
  exercises: Exercise[];
}

export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const supabase = getSupabaseBrowserClient();

        // Fetch template with exercises
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('id, name, description, difficulty, estimated_duration_minutes, equipment_needed, exercises')
          .eq('id', templateId)
          .single();

        if (templateError) throw templateError;
        if (!templateData) throw new Error('Template not found');

        // Parse exercises from JSONB and fetch exercise names
        const exerciseIds = templateData.exercises.map((ex: any) => ex.exercise_id);
        
        const { data: exerciseNames, error: exerciseError } = await supabase
          .from('exercises')
          .select('id, name')
          .in('id', exerciseIds);

        if (exerciseError) throw exerciseError;

        // Map exercise names to exercises
        const exerciseMap = new Map(exerciseNames?.map(ex => [ex.id, ex.name]) || []);
        
        const enrichedExercises = templateData.exercises.map((ex: any) => ({
          exercise_id: ex.exercise_id,
          exercise_name: exerciseMap.get(ex.exercise_id) || 'Unknown Exercise',
          target_sets: ex.target_sets,
          reps_range: ex.reps_range,
          rest_seconds: ex.rest_seconds,
          order_index: ex.order_index,
          notes: ex.notes,
        }));

        // Sort by order_index
        enrichedExercises.sort((a, b) => a.order_index - b.order_index);

        setTemplate({
          id: templateData.id,
          name: templateData.name,
          description: templateData.description,
          difficulty: templateData.difficulty,
          estimated_duration_minutes: templateData.estimated_duration_minutes,
          equipment_needed: templateData.equipment_needed || [],
          exercises: enrichedExercises,
        });
      } catch (err: any) {
        console.error('Error fetching template:', err);
        setError(err.message || 'Failed to load template');
      } finally {
        setLoading(false);
      }
    }

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleStartWorkout = () => {
    // Phase 2: Navigate to active workout
    router.push(`/workout/${templateId}/active`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-700 px-4 py-3">
          <div className="h-6 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          <div className="h-32 bg-gray-700/30 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-gray-700/30 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-gray-700/30 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Template not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-700">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Preview</h1>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Template Info */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{template.name}</h2>
            
            <div className="flex items-center gap-3 flex-wrap">
              <DifficultyBadge difficulty={template.difficulty} />
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{template.estimated_duration_minutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Dumbbell className="w-4 h-4" />
                <span>{template.exercises.length} exercises</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              {template.description}
            </p>

            {template.equipment_needed.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Equipment:</span>
                {template.equipment_needed.map((equipment, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full"
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Exercise List */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold">Exercises</h3>
            {template.exercises.map((exercise, index) => (
              <ExercisePreviewCard
                key={exercise.exercise_id}
                exercise={exercise}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - Above BottomNav */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-gray-800">
        <button
          onClick={handleStartWorkout}
          className="w-full py-4 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          Start Workout
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
