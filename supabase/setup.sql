-- Run once in Supabase SQL Editor, after adding the admin user in Authentication > Users.
begin;
create table if not exists public.portfolio_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
create or replace function public.is_portfolio_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.portfolio_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;
create table if not exists public.portfolio_content (id integer primary key check (id = 1), revision bigint not null default 0, data jsonb not null default '{}'::jsonb check(jsonb_typeof(data)='object'));
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant update (data, revision) on public.portfolio_content to authenticated;
drop policy if exists "portfolio_public_read" on public.portfolio_content;
create policy "portfolio_public_read" on public.portfolio_content for select to anon, authenticated using (true);
drop policy if exists "portfolio_admin_update" on public.portfolio_content;
create policy "portfolio_admin_update" on public.portfolio_content for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin() and id=1);
insert into public.portfolio_content(id) values(1) on conflict(id) do nothing;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('portfolio-media','portfolio-media',true,8388608,array['image/jpeg','image/png','image/webp','image/gif']) on conflict(id) do nothing;
drop policy if exists "portfolio_admin_media_insert" on storage.objects;
create policy "portfolio_admin_media_insert" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media' and public.is_portfolio_admin());
-- Grant only the manually created admin user. Replace the email below only if needed.
insert into public.portfolio_admins(user_id) select id from auth.users where lower(email)=lower('admin@abdelrahmanhamoud.com') on conflict do nothing;
commit;
-- Check that exactly the intended admin exists (run separately if needed):
select u.id,u.email from public.portfolio_admins a join auth.users u on a.user_id=u.id;
