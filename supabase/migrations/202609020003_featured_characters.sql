-- Featured characters are selected for the homepage without limiting the full cast.
alter table public.characters
  add column if not exists featured boolean not null default false;

create index if not exists characters_featured_idx
  on public.characters(featured) where featured = true;

update public.characters
set featured = true
where id in (
  '31000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000002',
  '31000000-0000-0000-0000-000000000003',
  '31000000-0000-0000-0000-000000000004'
);

update public.stories
set
  category = 'Mensagem especial',
  synopsis = 'O Horizoncraft agora tem um lugar só dele.'
where id = '11000000-0000-0000-0000-000000000001';
