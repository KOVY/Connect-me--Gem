import { createClient } from '@supabase/supabase-js';

// Načtení environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('🔧 [Supabase] Configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING'
});

// Graceful fallback for missing env variables (allows app to load)
let url = supabaseUrl;
let key = supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase] Missing environment variables!');
  console.warn('⚠️ Missing Supabase environment variables. App running in limited mode.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel dashboard.');
  console.warn('Go to: Vercel Dashboard → Settings → Environment Variables');
  console.warn('Make sure to redeploy after adding environment variables!');

  // Use dummy values to prevent crash (app will work without backend)
  url = 'https://placeholder.supabase.co';
  key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5MDk2MDAsImV4cCI6MTk2NTQ4NTYwMH0.placeholder';
} else {
  console.log('✅ [Supabase] Environment variables loaded successfully');
}

// Vytvoření Supabase klienta
export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: !!supabaseUrl,
    persistSession: !!supabaseUrl,
    detectSessionInUrl: !!supabaseUrl,
  },
  realtime: supabaseUrl ? {
    params: {
      eventsPerSecond: 10,
    },
  } : undefined,
});

// Helper pro získání aktuálního uživatele
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return user;
};

// Helper pro odhlášení
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Helper pro kontrolu session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return session;
};
