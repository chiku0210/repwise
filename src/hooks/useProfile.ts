'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types/profile';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // If profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: userId,
                experience_level: 'beginner',
                training_frequency: 3,
                weight_unit: 'kg',
                height_unit: 'cm',
                notifications_enabled: true,
              })
              .select()
              .single();

            if (createError) throw createError;
            setProfile(newProfile);
          } else {
            throw error;
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update profile',
      };
    }
  };

  return { profile, loading, error, updateProfile };
}
