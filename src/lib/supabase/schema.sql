-- ============================================================
-- HYVE CODEX — DATABASE SCHEMA
-- Open your Supabase project → SQL Editor → paste this file → Run
-- ============================================================

-- ── PROFILES ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  first_name  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid default gen_random_uuid() primary key,
  user_id                 uuid references public.profiles(id) on delete cascade not null,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  status                  text not null default 'trial'
                            check (status in ('trial', 'active', 'inactive', 'canceled', 'past_due')),
  plan                    text not null default 'trial'
                            check (plan in ('trial', 'full_codex')),
  trial_started_at        timestamptz default now(),
  current_period_end      timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ── LEAD MAGNET ACCESS ────────────────────────────────────────
-- RLS disabled — this table is accessed by the Lead Magnet web app
-- using the anon key. Access is controlled via API route validation
-- in the application layer, not via Supabase RLS.
create table if not exists public.lead_magnet_access (
  id                  uuid default gen_random_uuid() primary key,
  email               text not null unique,
  first_name          text,
  phone               text,
  quiz_answer_1       text,
  quiz_answer_2       text,
  quiz_answer_3       text,
  access_granted_at   timestamptz default now(),
  -- expires_at is set by the application to access_granted_at + 90 days on insert
  expires_at          timestamptz not null,
  created_at          timestamptz default now()
);

alter table public.lead_magnet_access disable row level security;

-- ── TRIGGER: auto-create profile + subscription on signup ─────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  insert into public.subscriptions (user_id, status, plan, trial_started_at)
  values (new.id, 'trial', 'trial', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── TRIGGER: auto-update updated_at ──────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();
