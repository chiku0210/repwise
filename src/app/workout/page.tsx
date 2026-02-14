'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { TemplateCard } from '@/components/workout/TemplateCard';
import { TemplateCardSkeleton } from '@/components/workout/TemplateCardSkeleton';

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_minutes: number;
  exercise_count: number;
  equipment: string[];
}

export default function WorkoutPickerPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const supabase = getSupabaseBrowserClient();
        
        // Fetch templates with exercise count
        const { data, error: fetchError } = await supabase
          .from('workout_templates')
          .select(`
            id,
            name,
            description,
            difficulty,
            estimated_duration_minutes,
            equipment_needed,
            template_exercises:template_exercises(count)
          `)
          .order('difficulty', { ascending: true })
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;

        // Transform data
        const transformedTemplates: WorkoutTemplate[] = (data || []).map((template: any) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          difficulty: template.difficulty,
          estimated_duration_minutes: template.estimated_duration_minutes,
          exercise_count: template.template_exercises?.[0]?.count || 0,
          equipment: template.equipment_needed || [],
        }));

        setTemplates(transformedTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load workout templates. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/workout/${templateId}/preview`);
  };

  const displayedTemplates = showAll ? templates : templates.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-muted rounded transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Templates</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {loading && (
          <>
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-400 underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No workout templates available yet.</p>
          </div>
        )}

        {!loading && !error && templates.length > 0 && (
          <>
            {displayedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}

            {!showAll && templates.length > 3 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Show {templates.length - 3} more templates...
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
