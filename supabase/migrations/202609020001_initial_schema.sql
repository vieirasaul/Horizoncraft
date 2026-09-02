create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Criador' check (char_length(display_name) between 1 and 40),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 100),
  synopsis text not null check (char_length(synopsis) between 1 and 600),
  cover_path text,
  category text not null,
  progress text not null default 'ongoing' check (progress in ('ongoing', 'complete', 'paused')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  accent text not null default 'blue' check (accent in ('blue', 'red', 'yellow', 'green', 'violet')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 120),
  chapter_number integer not null check (chapter_number > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  content jsonb not null default '[]'::jsonb check (jsonb_typeof(content) = 'array'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (story_id, slug),
  unique (story_id, chapter_number)
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 100),
  role text not null check (role in ('hero', 'villain', 'other')),
  short_description text not null check (char_length(short_description) between 1 and 260),
  biography text not null,
  weaknesses text[] not null default '{}',
  curiosities text[] not null default '{}',
  image_path text,
  accent text not null default 'blue' check (accent in ('blue', 'red', 'yellow', 'green', 'violet')),
  sort_order integer not null default 0 check (sort_order >= 0),
  featured boolean not null default false,
  story_slug text references public.stories(slug) on update cascade on delete set null,
  group_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.powers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.character_powers (
  character_id uuid not null references public.characters(id) on delete cascade,
  power_id uuid not null references public.powers(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (character_id, power_id)
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  caption text not null check (char_length(caption) between 1 and 400),
  image_path text not null,
  related_label text,
  related_type text check (related_type in ('story', 'character')),
  accent text not null default 'blue' check (accent in ('blue', 'red', 'yellow', 'green', 'violet')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stories_status_published_at_idx on public.stories(status, published_at desc);
create index stories_featured_idx on public.stories(featured) where featured = true;
create index chapters_story_order_idx on public.chapters(story_id, chapter_number);
create index chapters_status_idx on public.chapters(status);
create index characters_role_status_idx on public.characters(role, status);
create index characters_status_sort_idx on public.characters(status, sort_order, name);
create index characters_featured_idx on public.characters(featured) where featured = true;
create index gallery_status_created_idx on public.gallery_items(status, created_at desc);
create index character_powers_power_idx on public.character_powers(power_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger stories_updated_at before update on public.stories for each row execute function public.set_updated_at();
create trigger chapters_updated_at before update on public.chapters for each row execute function public.set_updated_at();
create trigger characters_updated_at before update on public.characters for each row execute function public.set_updated_at();
create trigger powers_updated_at before update on public.powers for each row execute function public.set_updated_at();
create trigger gallery_items_updated_at before update on public.gallery_items for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Criador'));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

create or replace function public.move_chapter(target_chapter_id uuid, new_chapter_number integer)
returns void language plpgsql security definer set search_path = '' as $$
declare
  target_story_id uuid;
  old_chapter_number integer;
  temporary_number integer;
begin
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  if new_chapter_number < 1 then raise exception 'Invalid chapter number'; end if;
  select story_id, chapter_number into target_story_id, old_chapter_number from public.chapters where id = target_chapter_id for update;
  if target_story_id is null or old_chapter_number = new_chapter_number then return; end if;
  select coalesce(max(chapter_number), 0) + 1000 into temporary_number from public.chapters where story_id = target_story_id;
  update public.chapters set chapter_number = temporary_number where id = target_chapter_id;
  update public.chapters set chapter_number = old_chapter_number where story_id = target_story_id and chapter_number = new_chapter_number;
  update public.chapters set chapter_number = new_chapter_number where id = target_chapter_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.chapters enable row level security;
alter table public.characters enable row level security;
alter table public.powers enable row level security;
alter table public.character_powers enable row level security;
alter table public.gallery_items enable row level security;

create policy "Admins can read profiles" on public.profiles for select to authenticated using (public.is_admin());
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Admins can update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Public can read published stories" on public.stories for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins can insert stories" on public.stories for insert to authenticated with check (public.is_admin());
create policy "Admins can update stories" on public.stories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete stories" on public.stories for delete to authenticated using (public.is_admin());

create policy "Public can read published chapters" on public.chapters for select to anon, authenticated using ((status = 'published' and exists (select 1 from public.stories where stories.id = chapters.story_id and stories.status = 'published')) or public.is_admin());
create policy "Admins can insert chapters" on public.chapters for insert to authenticated with check (public.is_admin());
create policy "Admins can update chapters" on public.chapters for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete chapters" on public.chapters for delete to authenticated using (public.is_admin());

create policy "Public can read published characters" on public.characters for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins can insert characters" on public.characters for insert to authenticated with check (public.is_admin());
create policy "Admins can update characters" on public.characters for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete characters" on public.characters for delete to authenticated using (public.is_admin());

create policy "Public can read powers for published characters" on public.powers for select to anon, authenticated using (exists (select 1 from public.character_powers join public.characters on characters.id = character_powers.character_id where character_powers.power_id = powers.id and characters.status = 'published') or public.is_admin());
create policy "Admins can insert powers" on public.powers for insert to authenticated with check (public.is_admin());
create policy "Admins can update powers" on public.powers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete powers" on public.powers for delete to authenticated using (public.is_admin());

create policy "Public can read published character powers" on public.character_powers for select to anon, authenticated using (exists (select 1 from public.characters where characters.id = character_powers.character_id and characters.status = 'published') or public.is_admin());
create policy "Admins can insert character powers" on public.character_powers for insert to authenticated with check (public.is_admin());
create policy "Admins can update character powers" on public.character_powers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete character powers" on public.character_powers for delete to authenticated using (public.is_admin());

create policy "Public can read published gallery items" on public.gallery_items for select to anon, authenticated using (status = 'published' or public.is_admin());
create policy "Admins can insert gallery items" on public.gallery_items for insert to authenticated with check (public.is_admin());
create policy "Admins can update gallery items" on public.gallery_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete gallery items" on public.gallery_items for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', false, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Published media can be viewed" on storage.objects for select to anon, authenticated using (
  bucket_id = 'media' and (
    public.is_admin()
    or exists (select 1 from public.stories where stories.cover_path = name and stories.status = 'published')
    or exists (select 1 from public.characters where characters.image_path = name and characters.status = 'published')
    or exists (select 1 from public.gallery_items where gallery_items.image_path = name and gallery_items.status = 'published')
    or exists (select 1 from public.chapters join public.stories on stories.id = chapters.story_id where chapters.status = 'published' and stories.status = 'published' and chapters.content::text like ('%' || name || '%'))
  )
);
create policy "Admins can upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin() and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Admins can update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "Admins can delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
