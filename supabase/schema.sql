-- ============================================================
-- BLITZNET — Supabase Schema
-- Run this in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  wg_account_id   bigint unique,                  -- Wargaming player ID (nullable until linked)
  wg_nickname     text not null,
  clan_tag        text,
  server          text not null default 'eu',     -- eu | com | asia
  avatar_url      text,
  bio             text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists users_wg_account_id_idx on public.users(wg_account_id);

-- ────────────────────────────────────────────
-- POSTS
-- ────────────────────────────────────────────
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.users(id) on delete cascade,
  author_nickname text not null,                  -- denormalised for fast reads
  author_clan_tag text,
  content         text not null,
  post_type       text not null default 'text'    -- text | battle_result | achievement | tank_review
                    check (post_type in ('text', 'battle_result', 'achievement', 'tank_review')),
  -- Battle result data stored as JSONB:
  -- { tank_name, damage_dealt, frags, xp, result, map_name }
  battle_result   jsonb,
  media_url       text,                           -- public URL from Supabase Storage
  media_type      text check (media_type in ('image', 'video', null)),
  likes_count     integer not null default 0,
  comments_count  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists posts_author_id_idx  on public.posts(author_id);
create index if not exists posts_created_at_idx on public.posts(created_at desc);

-- ────────────────────────────────────────────
-- COMMENTS
-- ────────────────────────────────────────────
create table if not exists public.comments (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references public.posts(id) on delete cascade,
  author_id       uuid not null references public.users(id) on delete cascade,
  author_nickname text not null,
  author_clan_tag text,
  content         text not null,
  created_at      timestamptz not null default now()
);

create index if not exists comments_post_id_idx on public.comments(post_id);

-- ────────────────────────────────────────────
-- POST LIKES  (one row per user-post pair)
-- ────────────────────────────────────────────
create table if not exists public.post_likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists post_likes_user_idx on public.post_likes(user_id);

-- ────────────────────────────────────────────
-- STORAGE BUCKET
-- ────────────────────────────────────────────
-- Run this separately in the Dashboard → Storage, or via the Supabase CLI:
--
--   supabase storage create post-media --public
--
-- Or via SQL (requires supabase_storage_admin role):

insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

-- Storage policy: anyone can read (public bucket)
create policy "Public read post-media"
  on storage.objects for select
  using ( bucket_id = 'post-media' );

-- Storage policy: authenticated users can upload their own files
create policy "Users upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'post-media'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

-- Storage policy: users can delete their own files
create policy "Users delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'post-media'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

-- ────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────
-- Enable RLS on all tables (even though our server uses service_role
-- which bypasses RLS, it's good practice to define policies).

alter table public.users     enable row level security;
alter table public.posts     enable row level security;
alter table public.comments  enable row level security;
alter table public.post_likes enable row level security;

-- Users: public read, own row write
create policy "Anyone can read users"   on public.users for select using (true);
create policy "Users update own row"    on public.users for update using (auth.uid() = id);

-- Posts: public read, author write
create policy "Anyone can read posts"   on public.posts for select using (true);
create policy "Authors insert posts"    on public.posts for insert with check (auth.uid() = author_id);
create policy "Authors update posts"    on public.posts for update using (auth.uid() = author_id);
create policy "Authors delete posts"    on public.posts for delete using (auth.uid() = author_id);

-- Comments: public read, author write
create policy "Anyone can read comments"  on public.comments for select using (true);
create policy "Authors insert comments"   on public.comments for insert with check (auth.uid() = author_id);
create policy "Authors delete comments"   on public.comments for delete using (auth.uid() = author_id);

-- Post likes: users see own, insert/delete own
create policy "Users read own likes"    on public.post_likes for select using (auth.uid() = user_id);
create policy "Users insert own likes"  on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users delete own likes"  on public.post_likes for delete using (auth.uid() = user_id);

-- ────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();
