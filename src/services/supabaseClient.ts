import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://yskjjmebwulfrqnkmaoa.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' ? localStorage.getItem('melody_supabase_anon_key') : null) ||
  '';

export let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('[Melody Supabase] Initialized with endpoint:', SUPABASE_URL);
  } catch (err) {
    console.warn('[Melody Supabase] Initialization error:', err);
  }
} else {
  console.log(
    '[Melody Supabase] Ready for credentials (URL: ' +
      SUPABASE_URL +
      '). Local cache active.'
  );
}

export const getSupabaseClient = (): SupabaseClient | null => supabase;

export const setSupabaseAnonKey = (key: string): boolean => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('melody_supabase_anon_key', key);
    }
    supabase = createClient(SUPABASE_URL, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('[Melody Supabase] Client configured with provided key.');
    return true;
  } catch (e) {
    console.error('[Melody Supabase] Failed to configure client:', e);
    return false;
  }
};
