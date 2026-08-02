-- GeoSQL — Supabase schema (applied to project nosguilaomfrnuuhdwcd)
--
-- Idempotent: safe to re-run. Paste into the Supabase SQL editor to rebuild
-- from scratch, or to set up a second environment.
--
-- Design note: the public leaderboard NEVER joins auth.users. It reads a
-- `profiles` table instead, so the API surface can't leak emails or auth
-- metadata even if someone adds a column later. Solution text (`code`) is
-- excluded from the anon/authenticated grants, so nobody can scrape answers.

-- ── submissions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id   integer NOT NULL,
  code         text NOT NULL,
  passed       boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  runtime_ms   numeric
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own submissions" ON public.submissions;
CREATE POLICY "Users manage own submissions"
  ON public.submissions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Passing submissions are publicly visible" ON public.submissions;
CREATE POLICY "Passing submissions are publicly visible"
  ON public.submissions FOR SELECT USING (passed = true);

-- Column-scoped grants: everything except `code`.
REVOKE SELECT ON public.submissions FROM anon, authenticated;
GRANT  SELECT (id, user_id, problem_id, passed, submitted_at, runtime_ms)
  ON public.submissions TO anon, authenticated;
GRANT  INSERT ON public.submissions TO authenticated;

-- ── profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS display_name_sane;
ALTER TABLE public.profiles ADD CONSTRAINT display_name_sane
  CHECK (char_length(display_name) BETWEEN 2 AND 24 AND display_name !~ '@');

-- Pseudonymous handles like "SwiftPolygon420".
CREATE OR REPLACE FUNCTION public.generate_handle()
RETURNS text LANGUAGE sql VOLATILE AS $$
  SELECT (ARRAY['Swift','Quiet','Clever','Brave','Lucky','Sharp','Calm','Bold',
                'Nimble','Wandering','Curious','Steady','Bright','Silent'])
           [floor(random()*14)+1]
      || (ARRAY['Polygon','Hexagon','Vertex','Centroid','Raster','Geodesic',
                'Meridian','Contour','Isoline','Quadtree','Buffer','Transect'])
           [floor(random()*12)+1]
      || floor(random()*900 + 100)::text
$$;

-- The leaderboard is world-readable, so the default name must never be derived
-- from the email (alice@gmail.com -> "alice" is not what anyone expects to be
-- published) nor from full_name (real names). A public OAuth handle is fine;
-- otherwise generate one. Users can change it from the leaderboard screen.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'user_name'), ''),
      public.generate_handle()
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.generate_handle() FROM PUBLIC, anon;

-- Trigger-only: must not be reachable at /rest/v1/rpc/handle_new_user
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (user_id, display_name, avatar_url)
SELECT id,
       COALESCE(NULLIF(TRIM(raw_user_meta_data->>'user_name'), ''),
                public.generate_handle()),
       raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ── leaderboard ─────────────────────────────────────────────────────────────
-- Fastest passing submission per user per problem.
-- security_invoker = the view respects the caller's RLS, so it can't become a
-- privilege-escalation hole.
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard WITH (security_invoker = true) AS
SELECT DISTINCT ON (s.user_id, s.problem_id)
  s.problem_id,
  s.runtime_ms,
  s.submitted_at,
  p.display_name,
  p.avatar_url
FROM public.submissions s
JOIN public.profiles p ON p.user_id = s.user_id
WHERE s.passed = true
  AND s.runtime_ms IS NOT NULL
ORDER BY s.user_id, s.problem_id, s.runtime_ms ASC;

GRANT SELECT ON public.leaderboard TO anon, authenticated;
