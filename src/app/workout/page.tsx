'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, LayoutGrid, Search, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { TemplateCard } from '@/components/workout/TemplateCard';
import { TemplateCardSkeleton } from '@/components/workout/TemplateCardSkeleton';
import { BottomNav } from '@/components/ui/bottom-nav';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>('all');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    async function fetchTemplates() {
      try {
        const supabase = getSupabaseBrowserClient();
        
        const { data, error: fetchError } = await supabase
          .from('templates')
          .select('id, name, description, difficulty, estimated_duration_minutes, equipment_needed, exercises')
          .eq('is_public', true);

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
          throw new Error('No workout templates found. Please add templates to the database.');
        }

        // Transform data
        const transformedTemplates: WorkoutTemplate[] = data.map((template: any) => ({
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
        const errorMessage = err instanceof Error ? err.message : 'Failed to load workout templates. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/workout/${templateId}/preview`);
  };

  // Filter templates by search query and difficulty
  const filteredTemplates = templates.filter((template) => {
    // Difficulty filter
    if (activeFilter !== 'all' && template.difficulty !== activeFilter) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.equipment.some((eq) => eq.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const filterTabs: { value: DifficultyFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-lg bg-card py-3 pl-10 pr-4 text-white placeholder-gray-400 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all"
              disabled={loading || !!error}
            />
          </div>
        </div>

        {/* Filter Tabs - Pill Style */}
        <div className="px-4 pb-3">
          <div className="flex p-1 space-x-1 bg-muted/30 rounded-xl">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  disabled={loading || !!error}
                  className={`
                    flex-1 px-3 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isActive
                        ? 'bg-white text-zinc-900 shadow-lg'
                        : 'text-zinc-400 hover:text-zinc-200'
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

      {/* Content - Scrollable with bottom padding */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6 space-y-4">
          {loading && (
            <>
              <TemplateCardSkeleton />
              <TemplateCardSkeleton />
              <TemplateCardSkeleton />
            </>
          )}

          {error && (
            <div className="rounded-lg bg-red-900/20 p-6 border border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-400 mb-2">Database Error</h3>
                  <p className="text-sm text-red-300 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
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
              {searchQuery && (
                <p className="text-sm text-gray-500 mb-3">
                  Try adjusting your search
                </p>
              )}
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
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

      <BottomNav />
    </div>
  );
}
