import { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { UserProfile } from '../types';

interface DiscoveryProfile {
  id: string;
  user_id: string | null;
  name: string;
  age: number;
  gender: string;
  country: string;
  language: string;
  city: string | null;
  occupation: string | null;
  bio: string | null;
  photo_url: string | null;
  interests: string[] | null;
  hobbies: string[] | null;
  icebreakers: string[] | null;
  is_ai_profile: boolean | null;
  verified: boolean | null;
  last_seen: string | null;
  created_at: string;
}

export function useDiscoveryProfiles(language?: string) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        console.log('🔍 [Discovery] Starting profile fetch...', { language });
        setLoading(true);

        // Build query
        let query = supabase
          .from('discovery_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Filter by language if provided
        if (language && language !== 'en') {
          console.log('🌐 [Discovery] Filtering by language:', language);
          query = query.eq('language', language);
        }

        console.log('⏳ [Discovery] Executing Supabase query...');
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('❌ [Discovery] Supabase error:', fetchError);
          throw fetchError;
        }

        console.log('✅ [Discovery] Received data from Supabase:', {
          count: data?.length || 0,
          sample: data?.[0] ? { id: data[0].id, name: data[0].name } : null
        });

        // Check if table is empty
        if (!data || data.length === 0) {
          console.warn('⚠️ [Discovery] No profiles found in database. Have you run the seed migrations?');
        }

        // Map database schema to UserProfile interface
        const mappedProfiles: UserProfile[] = (data as DiscoveryProfile[]).map((profile) => ({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          imageUrl: profile.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          occupation: profile.occupation || 'Not specified',
          bio: profile.bio || '',
          interests: profile.interests || [],
          hobbies: profile.hobbies || [],
          country: profile.country,
          lastSeen: profile.last_seen || new Date().toISOString(),
          verified: profile.verified || false,
          icebreakers: profile.icebreakers || [],
        }));

        console.log('📦 [Discovery] Mapped profiles:', mappedProfiles.length);
        setProfiles(mappedProfiles);
        setError(null);
      } catch (err) {
        console.error('❌ [Discovery] Error fetching discovery profiles:', err);
        console.error('❌ [Discovery] Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setProfiles([]); // Clear profiles on error
      } finally {
        setLoading(false);
        console.log('🏁 [Discovery] Fetch complete');
      }
    }

    fetchProfiles();
  }, [language]);

  return { profiles, loading, error };
}
