-- ─────────────────────────────────────────────────────────────
-- Platform Admin migration — Document 4
-- Run in Supabase SQL editor
-- ─────────────────────────────────────────────────────────────

-- HOW TO MAKE SOMEONE AN ADMIN
-- 1. Go to Supabase → Table Editor → profiles table
-- 2. Find the row for the team member's email
-- 3. Set is_admin to true
-- 4. That person logs in at /login and is redirected to /admin

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- ── Suggestions ───────────────────────────────────────────────
-- Submitted by users via "Request a Prompt / Skill" modals
-- type: 'prompt' | 'skill' | 'command' | 'tool' | 'feature' | 'other'
-- status: 'new' | 'reviewed' | 'in_progress' | 'added' | 'declined'
CREATE TABLE IF NOT EXISTS suggestions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete set null,
  user_name   text,
  user_email  text,
  type        text not null,
  message     text not null,
  status      text not null default 'new',
  created_at  timestamptz default now()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own suggestions"
  ON suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own suggestions"
  ON suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- ── Admin Granted Subscriptions ───────────────────────────────
-- Pre-grant access to an email before they sign up
-- When a user signs up with a matching email, the signup flow redeems the grant
CREATE TABLE IF NOT EXISTS admin_granted_subscriptions (
  id                    uuid default gen_random_uuid() primary key,
  email                 text not null unique,
  granted_by            uuid references profiles(id),
  plan                  text not null default 'full_codex',
  access_starts_at      timestamptz default now(),
  access_ends_at        timestamptz not null,
  notes                 text,
  redeemed              boolean default false,
  redeemed_at           timestamptz,
  redeemed_by_user_id   uuid references profiles(id),
  created_at            timestamptz default now()
);

-- Service role only — no RLS needed (admin API routes use service role)

-- ── Content Tables ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prompts (
  id          serial primary key,
  category    text not null,
  subcategory text not null,
  title       text not null,
  description text not null,
  tip         text,
  prompt      text not null,
  is_active   boolean default true,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

CREATE TABLE IF NOT EXISTS skills (
  id          serial primary key,
  name        text not null,
  author      text,
  category    text not null,
  description text not null,
  install_url text,
  is_active   boolean default true,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

CREATE TABLE IF NOT EXISTS commands (
  id          serial primary key,
  category    text not null,
  keys        text not null,
  description text not null,
  platform    text default 'all',
  is_active   boolean default true,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

CREATE TABLE IF NOT EXISTS ai_tools (
  id           serial primary key,
  name         text not null,
  category     text not null,
  tagline      text,
  description  text not null,
  we_use_this  boolean default false,
  referral_url text,
  is_active    boolean default true,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

-- RLS for content tables: authenticated users can read active records
ALTER TABLE prompts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills    ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read active prompts"
  ON prompts FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Authenticated users read active skills"
  ON skills FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Authenticated users read active commands"
  ON commands FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Authenticated users read active ai_tools"
  ON ai_tools FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- ── Platform Settings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz default now()
);

INSERT INTO platform_settings (key, value) VALUES
  ('support_email', 'support@thehyvehamptons.com'),
  ('platform_name', 'Hyve Codex')
ON CONFLICT (key) DO NOTHING;
