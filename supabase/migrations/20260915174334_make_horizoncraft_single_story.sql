begin;

update public.stories
set
  title = 'Horizoncraft',
  slug = 'horizoncraft',
  category = 'Aventura',
  progress = 'ongoing',
  featured = true,
  updated_at = now()
where id = '11000000-0000-0000-0000-000000000001';

update public.chapters
set
  title = 'Parabéns, Théo!',
  slug = 'parabens-theo',
  chapter_number = 1,
  updated_at = now()
where id = '21000000-0000-0000-0000-000000000001'
  and story_id = '11000000-0000-0000-0000-000000000001';

commit;
