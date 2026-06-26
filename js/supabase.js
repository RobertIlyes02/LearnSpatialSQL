// ═══════════════════════════════════════════════════════════════════════════
// GeoSQL — Supabase client
//
// HOW TO SET UP (one-time, takes ~5 minutes):
//
// 1. Go to https://supabase.com and create a free project.
//
// 2. In the Supabase dashboard → SQL Editor, run this to create the
//    submissions table:
//
//      CREATE TABLE submissions (
//        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//        user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//        problem_id  INTEGER NOT NULL,
//        code        TEXT NOT NULL,
//        passed      BOOLEAN NOT NULL DEFAULT false,
//        submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
//      );
//
//      -- Only let users read/write their own rows
//      ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
//      CREATE POLICY "Users manage own submissions"
//        ON submissions FOR ALL
//        USING (auth.uid() = user_id)
//        WITH CHECK (auth.uid() = user_id);
//
// 3. Go to Project Settings → API and copy:
//    - "Project URL"  → paste as SUPABASE_URL below
//    - "anon public"  → paste as SUPABASE_ANON_KEY below
//    Both values are safe to commit — they're public by design.
//
// 4. To enable GitHub OAuth (recommended for a dev audience):
//    - Supabase dashboard → Authentication → Providers → GitHub → Enable
//    - Create a GitHub OAuth App at github.com/settings/developers
//      · Homepage URL: your site URL (or http://localhost:3000 for local dev)
//      · Callback URL: shown in the Supabase GitHub provider settings page
//    - Paste the GitHub Client ID + Secret into Supabase.
//
// 5. To enable Google OAuth (optional):
//    - Supabase dashboard → Authentication → Providers → Google → Enable
//    - Create credentials at console.cloud.google.com → APIs & Services → Credentials
//    - Paste Client ID + Secret into Supabase.
//
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── PASTE YOUR VALUES HERE ──────────────────────────────────────────────────
const SUPABASE_URL      = 'PASTE_YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_KEY_HERE';
// ─────────────────────────────────────────────────────────────────────────────

const CONFIGURED = (
  SUPABASE_URL      !== 'PASTE_YOUR_PROJECT_URL_HERE' &&
  SUPABASE_ANON_KEY !== 'PASTE_YOUR_ANON_KEY_HERE'
);

// Export a dummy client when not configured so the rest of the app doesn't
// need to null-check everywhere — auth calls just return null/empty.
let supabase = null;
if (CONFIGURED) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      // Persist session in localStorage so the user stays logged in on refresh
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export { supabase, CONFIGURED };

// ─── AUTH HELPERS ────────────────────────────────────────────────────────────

/** Returns the current session, or null if not logged in / not configured. */
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

/** Returns the current user object, or null. */
export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Sign in with an OAuth provider.
 * provider: 'github' | 'google'
 * Redirects to the provider's consent page; Supabase handles the callback.
 */
export async function signInWithOAuth(provider) {
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      // After OAuth, redirect back to wherever the user was
      redirectTo: window.location.origin + window.location.pathname,
    },
  });
  if (error) throw error;
}

/**
 * Sign in with email + password.
 * For new users who don't want OAuth.
 */
export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign up with email + password.
 * Supabase sends a confirmation email by default.
 */
export async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase not configured.');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/** Sign out the current user. */
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('[GeoSQL] Sign out error:', error);
}

/**
 * Subscribe to auth state changes (login, logout, token refresh).
 * callback receives (event, session).
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback) {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

// ─── SUBMISSIONS ─────────────────────────────────────────────────────────────

/**
 * Load all problem IDs the current user has solved.
 * Returns a Set<number> of problem IDs.
 * Falls back to empty Set if not logged in or Supabase not configured.
 */
export async function loadSolvedFromSupabase() {
  if (!supabase) return new Set();
  const session = await getSession();
  if (!session) return new Set();

  const { data, error } = await supabase
    .from('submissions')
    .select('problem_id')
    .eq('user_id', session.user.id)
    .eq('passed', true);

  if (error) {
    console.warn('[GeoSQL] Could not load submissions:', error.message);
    return new Set();
  }

  return new Set(data.map(row => row.problem_id));
}

/**
 * Record a submission. Called on every Submit click, pass or fail.
 * Silently swallows errors — a failed write shouldn't break the UX.
 */
export async function recordSubmission({ problemId, code, passed, runtimeMs }) {
  if (!supabase) return;
  const session = await getSession();
  if (!session) return;

  const { error } = await supabase.from('submissions').insert({
    user_id:    session.user.id,
    problem_id: problemId,
    code,
    passed,
    runtime_ms: runtimeMs ?? null,
  });

  if (error) console.warn('[GeoSQL] Could not save submission:', error.message);
}

/**
 * Fetch leaderboard for a given problem.
 * Returns the single fastest passing submission per user, sorted by runtime_ms.
 * We use a Postgres view defined in Supabase for this — see SQL below.
 *
 * Run this once in the Supabase SQL editor to create the view:
 *
 *   CREATE VIEW leaderboard AS
 *   SELECT DISTINCT ON (s.user_id, s.problem_id)
 *     s.problem_id,
 *     s.runtime_ms,
 *     s.submitted_at,
 *     COALESCE(u.raw_user_meta_data->>'full_name',
 *              u.raw_user_meta_data->>'user_name',
 *              u.email) AS display_name,
 *     u.raw_user_meta_data->>'avatar_url' AS avatar_url
 *   FROM submissions s
 *   JOIN auth.users u ON u.id = s.user_id
 *   WHERE s.passed = true
 *     AND s.runtime_ms IS NOT NULL
 *   ORDER BY s.user_id, s.problem_id, s.runtime_ms ASC;
 *
 *   -- Let anyone read the leaderboard view
 *   GRANT SELECT ON leaderboard TO anon, authenticated;
 */
export async function fetchLeaderboard(problemId) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('leaderboard')
    .select('display_name, avatar_url, runtime_ms, submitted_at')
    .eq('problem_id', problemId)
    .order('runtime_ms', { ascending: true })
    .limit(25);

  if (error) {
    console.warn('[GeoSQL] Leaderboard fetch error:', error.message);
    return [];
  }
  return data ?? [];
}
