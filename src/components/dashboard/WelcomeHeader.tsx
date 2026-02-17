'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { Dumbbell } from 'lucide-react';

interface UserProfile {
  name: string | null;
}

export function WelcomeHeader() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Extract first name + middle name (exclude last name)
  const getFirstName = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length === 1) {
      // Only one name
      return parts[0];
    } else if (parts.length === 2) {
      // Two names - assume first name only
      return parts[0];
    } else {
      // Three or more names - return first + middle (exclude last)
      return parts.slice(0, -1).join(' ');
    }
  };

  // Priority: profile.name (first + middle only) > email username > 'there'
  const getName = () => {
    if (profile?.name) return getFirstName(profile.name);
    if (!user?.email) return 'there';
    const username = user.email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {getGreeting()}, {getName()}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-400">Ready to make every rep count?</p>
      </div>

      {/* App Branding */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-[#0f1e33] p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
          <Dumbbell className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Repwise</p>
          <p className="text-xs text-gray-400">Your strength training companion</p>
        </div>
      </div>
    </div>
  );
}
