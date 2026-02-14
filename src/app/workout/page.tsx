'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
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
        
        // Fetch templates from 'templates' table
        const { data, error: fetchError } = await supabase
          .from('templates')
          .select('id, name, description, difficulty, estimated_duration_minutes, equipment_needed, exercises')
          .eq('is_public', true)
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
          exercise_count: Array.isArray(template.exercises) ? template.exercises.length : 0,
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
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Workout Templates</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
        {loading && (
          <>
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
            <p className="text-red-400 text-sm font-semibold mb-2">⚠️ Error loading templates</p>
            <p className="text-red-400/80 text-xs mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No workout templates available yet.</p>
          </div>
        )}

        {!loading && !error && templates.length > 0 && (
          <>
            <div className="space-y-3">
              {displayedTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                />
              ))}
            </div>

            {!showAll && templates.length > 3 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full py-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-border rounded-xl hover:bg-muted/50"
              >
                Show {templates.length - 3} more templates →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
