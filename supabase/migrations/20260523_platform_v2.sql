-- ─────────────────────────────────────────────────────────────
-- Platform v2 migration
-- Run in Supabase SQL editor or via Supabase CLI
-- ─────────────────────────────────────────────────────────────

-- 1. Add last_name to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_name text;

-- 2. Prompt favorites (per-user, one per prompt)
CREATE TABLE IF NOT EXISTS prompt_favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  prompt_id   int  not null,
  created_at  timestamptz not null default now(),
  unique(user_id, prompt_id)
);

ALTER TABLE prompt_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own favorites"
  ON prompt_favorites
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Skill reactions (global heart counts, one per user per skill)
CREATE TABLE IF NOT EXISTS skill_reactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  skill_id    int  not null,
  created_at  timestamptz not null default now(),
  unique(user_id, skill_id)
);

ALTER TABLE skill_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read (needed for global counts)
CREATE POLICY "Authenticated users can read reactions"
  ON skill_reactions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage own reactions"
  ON skill_reactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own reactions"
  ON skill_reactions
  FOR DELETE
  USING (auth.uid() = user_id);
