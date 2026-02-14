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
        console.log('🔍 Fetching templates...');
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
            equipment_needed
          `)
          .order('difficulty', { ascending: true })
          .order('name', { ascending: true });

        console.log('📊 Supabase response:', { data, error: fetchError });

        if (fetchError) {
          console.error('❌ Supabase error:', fetchError);
          throw new Error(fetchError.message || 'Unknown database error');
        }

        if (!data) {
          console.warn('⚠️ No data returned');
          setTemplates([]);
          setLoading(false);
          return;
        }

        // Transform data
        const transformedTemplates: WorkoutTemplate[] = data.map((template: any) => {
          console.log('🔄 Transforming template:', template);
          return {
            id: template.id,
            name: template.name,
            description: template.description,
            difficulty: template.difficulty,
            estimated_duration_minutes: template.estimated_duration_minutes,
            exercise_count: 0, // TODO: Get from template_exercises join
            equipment: template.equipment_needed || [],
          };
        });

        console.log('✅ Transformed templates:', transformedTemplates);
        setTemplates(transformedTemplates);
      } catch (err: any) {
        console.error('💥 Error fetching templates:', err);
        console.error('Error name:', err?.name);
        console.error('Error message:', err?.message);
        console.error('Error stack:', err?.stack);
        setError(err?.message || 'Failed to load workout templates. Please try again.');
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
            <p className="text-red-400 text-sm font-semibold mb-2">Error loading templates</p>
            <p className="text-red-400 text-xs mb-3">{error}</p>
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
            <p className="text-xs text-muted-foreground mt-2">Check your database or add some templates first.</p>
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
