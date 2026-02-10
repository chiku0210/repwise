'use client';

import { SupabaseClient } from '@supabase/supabase-js';
import { Muscle } from '@/lib/types/exercise';

/**
 * Fetches all muscles and returns a Map for quick ID to name lookups
 * Reusable across components to avoid duplication
 */
export async function getMuscleMap(
  supabase: SupabaseClient
): Promise<Map<string, string>> {
  const { data: muscles, error } = await supabase
    .from('muscles')
    .select('*');

  if (error) {
    console.error('Error fetching muscles:', error);
    return new Map();
  }

  const muscleMap = new Map<string, string>();
  muscles?.forEach((m: Muscle) => {
    muscleMap.set(m.id, m.name);
  });

  return muscleMap;
}
