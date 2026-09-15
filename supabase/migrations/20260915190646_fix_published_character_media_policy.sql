drop policy if exists "Published media can be viewed" on storage.objects;

create policy "Published media can be viewed"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'media'
  and (
    (select public.is_admin())
    or exists (
      select 1
      from public.stories as published_story
      where published_story.cover_path = storage.objects.name
        and published_story.status = 'published'
    )
    or exists (
      select 1
      from public.characters as published_character
      where published_character.image_path = storage.objects.name
        and published_character.status = 'published'
    )
    or exists (
      select 1
      from public.gallery_items as published_gallery_item
      where published_gallery_item.image_path = storage.objects.name
        and published_gallery_item.status = 'published'
    )
    or exists (
      select 1
      from public.chapters as published_chapter
      join public.stories as chapter_story
        on chapter_story.id = published_chapter.story_id
      where published_chapter.status = 'published'
        and chapter_story.status = 'published'
        and published_chapter.content::text like ('%' || storage.objects.name || '%')
    )
  )
);
