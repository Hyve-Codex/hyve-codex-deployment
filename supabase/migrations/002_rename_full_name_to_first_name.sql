-- Rename full_name to first_name in profiles table
alter table public.profiles rename column full_name to first_name;

-- Update trigger to only insert id and email (first_name set separately after signup)
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
