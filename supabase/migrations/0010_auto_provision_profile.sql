-- Auto-create a profiles row whenever a new auth.users row appears (e.g. an
-- admin adding a staff account directly in Supabase Auth) — without this,
-- the new user can sign in but app/admin/layout.tsx finds no profile and
-- bounces them straight back to /admin/login with no visible error.
-- Defaults to 'customer'; promote via Admin > Settings > Staff Users.
create or replace function fn_handle_new_auth_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_handle_new_auth_user on auth.users;
create trigger trg_handle_new_auth_user
after insert on auth.users
for each row execute function fn_handle_new_auth_user();
