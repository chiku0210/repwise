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

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function WorkoutPickerPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>('all');

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const supabase = getSupabaseBrowserClient();
        
        // Fetch templates - we'll sort on client side for proper difficulty order
        const { data, error: fetchError } = await supabase
          .from('templates')
          .select('id, name, description, difficulty, estimated_duration_minutes, equipment_needed, exercises')
          .eq('is_public', true);

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

        // Sort by difficulty (beginner → intermediate → advanced), then by name
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        transformedTemplates.sort((a, b) => {
          const diffComparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          if (diffComparison !== 0) return diffComparison;
          return a.name.localeCompare(b.name);
        });

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

  // Filter templates based on active filter
  const filteredTemplates = activeFilter === 'all' 
    ? templates 
    : templates.filter(t => t.difficulty === activeFilter);

  const filterTabs: { value: DifficultyFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

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

        {/* Filter Tabs - Pill Style */}
        <div className="px-4 pb-3">
          <div className="inline-flex p-1 space-x-1 bg-muted/50 rounded-xl">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`
                    relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
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

        {!loading && !error && filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-2">
              No {activeFilter !== 'all' && activeFilter} templates found
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-sm text-primary hover:underline"
            >
              View all templates
            </button>
          </div>
        )}

        {!loading && !error && filteredTemplates.length > 0 && (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
