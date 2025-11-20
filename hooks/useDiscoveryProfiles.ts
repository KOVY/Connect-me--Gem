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
        console.log('[useDiscoveryProfiles] Starting fetch, language:', language);
        setLoading(true);

        // Build query
        let query = supabase
          .from('discovery_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Filter by language if provided
        if (language && language !== 'en') {
          console.log('[useDiscoveryProfiles] Filtering by language:', language);
          query = query.eq('language', language);
        }

        console.log('[useDiscoveryProfiles] Executing query...');
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('[useDiscoveryProfiles] Query error:', fetchError);
          throw fetchError;
        }

        console.log('[useDiscoveryProfiles] Query successful, rows:', data?.length || 0);

        // Check if table is empty
        if (!data || data.length === 0) {
          console.warn('[useDiscoveryProfiles] No profiles found in database. Have you run the seed migrations?');
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

        console.log('[useDiscoveryProfiles] Mapped profiles:', mappedProfiles.length);
        setProfiles(mappedProfiles);
        setError(null);
      } catch (err) {
        console.error('[useDiscoveryProfiles] Error fetching discovery profiles:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setProfiles([]); // Clear profiles on error
      } finally {
        setLoading(false);
        console.log('[useDiscoveryProfiles] Fetch complete, loading set to false');
      }
    }

    fetchProfiles();
  }, [language]);

  return { profiles, loading, error };
}
