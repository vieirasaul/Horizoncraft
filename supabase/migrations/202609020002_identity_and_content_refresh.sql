-- This migration preserves existing records, moves the original fictional demo
-- content to drafts, and adds the confirmed Horizoncraft launch content.

alter table public.stories drop constraint if exists stories_accent_check;
alter table public.stories alter column accent set default 'blue';
update public.stories
set accent = case accent
  when 'cyan' then 'blue'
  when 'orange' then 'red'
  else accent
end;
alter table public.stories add constraint stories_accent_check
  check (accent in ('blue', 'red', 'yellow', 'green', 'violet'));

alter table public.characters drop constraint if exists characters_accent_check;
alter table public.characters alter column accent set default 'blue';
update public.characters
set accent = case accent
  when 'cyan' then 'blue'
  when 'orange' then 'red'
  else accent
end;
alter table public.characters add constraint characters_accent_check
  check (accent in ('blue', 'red', 'yellow', 'green', 'violet'));
alter table public.characters add column if not exists sort_order integer not null default 0;
alter table public.characters drop constraint if exists characters_sort_order_check;
alter table public.characters add constraint characters_sort_order_check check (sort_order >= 0);

alter table public.gallery_items drop constraint if exists gallery_items_accent_check;
alter table public.gallery_items alter column accent set default 'blue';
update public.gallery_items
set accent = case accent
  when 'cyan' then 'blue'
  when 'orange' then 'red'
  else accent
end;
alter table public.gallery_items add constraint gallery_items_accent_check
  check (accent in ('blue', 'red', 'yellow', 'green', 'violet'));

create index if not exists characters_status_sort_idx
  on public.characters(status, sort_order, name);

update public.stories
set status = 'draft', featured = false
where id in (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002'
);

update public.characters
set status = 'draft'
where id in (
  '30000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000002'
);

insert into public.stories (
  id, slug, title, synopsis, category, progress, status, featured, accent, published_at
) values (
  '11000000-0000-0000-0000-000000000001',
  'parabens-theo',
  'Parabéns, Théo!',
  'O Horizoncraft agora tem um lugar só dele.',
  'Mensagem especial',
  'complete',
  'published',
  true,
  'blue',
  now()
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  synopsis = excluded.synopsis,
  category = excluded.category,
  progress = excluded.progress,
  status = excluded.status,
  featured = excluded.featured,
  accent = excluded.accent;

insert into public.chapters (
  id, story_id, slug, title, chapter_number, status, content, published_at
) values (
  '21000000-0000-0000-0000-000000000001',
  '11000000-0000-0000-0000-000000000001',
  'bem-vindo-ao-seu-universo',
  'Uma aventura muito especial começa hoje',
  1,
  'published',
  '[
    {"id":"birthday-1","type":"heading","text":"Parabéns, Théo!"},
    {"id":"birthday-2","type":"paragraph","text":"O Horizoncraft foi criado para ser o lugar onde suas ideias podem ganhar vida. Agora seus heróis, poderes, desenhos e aventuras têm um universo próprio para crescer."},
    {"id":"birthday-3","type":"paragraph","text":"Esta é apenas a primeira página de muitas histórias que ainda serão criadas. Você poderá mudar tudo, inventar novos personagens, revelar vilões e construir esse mundo do seu jeito."},
    {"id":"birthday-4","type":"quote","text":"Que nunca faltem ideias, coragem e aventuras."},
    {"id":"birthday-5","type":"paragraph","text":"Feliz aniversário — e bem-vindo ao seu próprio universo!"}
  ]'::jsonb,
  now()
)
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  status = excluded.status,
  content = excluded.content;

insert into public.characters (
  id, slug, name, role, short_description, biography, weaknesses, curiosities,
  accent, sort_order, status
) values
(
  '31000000-0000-0000-0000-000000000001', 'caveira-vermelha', 'Caveira Vermelha', 'hero',
  'Um herói mascarado que domina o fogo, atravessa portais e enfrenta seus desafios usando poderosas correntes.',
  '', '{}', '{}', 'red', 1, 'published'
),
(
  '31000000-0000-0000-0000-000000000002', 'kauan-raio', 'Kauan Raio', 'hero',
  'Após recuperar o controle de seu corpo, Kauan Raio passou a carregar a energia da misteriosa entidade Kairay.',
  'Kauan Raio foi possuído pela entidade misteriosa Kairay. Ele conseguiu retomar o controle do próprio corpo e absorveu os poderes da entidade.',
  '{}', '{}', 'yellow', 2, 'published'
),
(
  '31000000-0000-0000-0000-000000000003', 'metanic', 'Metanic', 'hero',
  'Um herói capaz de transformar seu corpo em diferentes materiais e adaptar suas habilidades a cada desafio.',
  '', '{}', '{}', 'green', 3, 'published'
),
(
  '31000000-0000-0000-0000-000000000004', 'blood-phantom', 'Blood Phantom', 'hero',
  'Um herói fantasmagórico capaz de atravessar obstáculos, projetar energia espectral e assumir temporariamente o controle de outras pessoas.',
  '', '{}', '{}', 'violet', 4, 'published'
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  role = excluded.role,
  short_description = excluded.short_description,
  biography = excluded.biography,
  weaknesses = excluded.weaknesses,
  curiosities = excluded.curiosities,
  accent = excluded.accent,
  sort_order = excluded.sort_order,
  status = excluded.status;

insert into public.powers (id, name, description) values
('41000000-0000-0000-0000-000000000001', 'Controle do fogo', 'Controla e utiliza fogo durante as batalhas.'),
('41000000-0000-0000-0000-000000000002', 'Criação de portais', 'Cria portais para atravessar grandes distâncias.'),
('41000000-0000-0000-0000-000000000003', 'Teletransporte', 'Usa seus portais para se teletransportar.'),
('41000000-0000-0000-0000-000000000004', 'Combate com correntes', 'Utiliza correntes durante os combates.'),
('41000000-0000-0000-0000-000000000005', 'Controle de eletricidade', 'Controla energia elétrica.'),
('41000000-0000-0000-0000-000000000006', 'Criação de raios', 'Cria raios para usar em ação.'),
('41000000-0000-0000-0000-000000000007', 'Ataques elétricos', 'Canaliza eletricidade em seus ataques.'),
('41000000-0000-0000-0000-000000000008', 'Energia de Kairay', 'Carrega a energia absorvida da entidade Kairay.'),
('41000000-0000-0000-0000-000000000009', 'Transformação em aço', 'Transforma o próprio corpo em aço.'),
('41000000-0000-0000-0000-000000000010', 'Transformação em madeira', 'Transforma o próprio corpo em madeira.'),
('41000000-0000-0000-0000-000000000011', 'Transformação em mercúrio', 'Transforma o próprio corpo em mercúrio.'),
('41000000-0000-0000-0000-000000000012', 'Adaptação material', 'Escolhe um material de acordo com o desafio.'),
('41000000-0000-0000-0000-000000000013', 'Intangibilidade', 'Torna o corpo intangível.'),
('41000000-0000-0000-0000-000000000014', 'Travessia de paredes', 'Atravessa paredes e outras superfícies.'),
('41000000-0000-0000-0000-000000000015', 'Possessão', 'Controla temporariamente outras pessoas.'),
('41000000-0000-0000-0000-000000000016', 'Ataques fantasmagóricos', 'Projeta energia espectral em seus ataques.')
on conflict (id) do update set name = excluded.name, description = excluded.description;

insert into public.character_powers (character_id, power_id, sort_order) values
('31000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000001', 1),
('31000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000002', 2),
('31000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000003', 3),
('31000000-0000-0000-0000-000000000001', '41000000-0000-0000-0000-000000000004', 4),
('31000000-0000-0000-0000-000000000002', '41000000-0000-0000-0000-000000000005', 1),
('31000000-0000-0000-0000-000000000002', '41000000-0000-0000-0000-000000000006', 2),
('31000000-0000-0000-0000-000000000002', '41000000-0000-0000-0000-000000000007', 3),
('31000000-0000-0000-0000-000000000002', '41000000-0000-0000-0000-000000000008', 4),
('31000000-0000-0000-0000-000000000003', '41000000-0000-0000-0000-000000000009', 1),
('31000000-0000-0000-0000-000000000003', '41000000-0000-0000-0000-000000000010', 2),
('31000000-0000-0000-0000-000000000003', '41000000-0000-0000-0000-000000000011', 3),
('31000000-0000-0000-0000-000000000003', '41000000-0000-0000-0000-000000000012', 4),
('31000000-0000-0000-0000-000000000004', '41000000-0000-0000-0000-000000000013', 1),
('31000000-0000-0000-0000-000000000004', '41000000-0000-0000-0000-000000000014', 2),
('31000000-0000-0000-0000-000000000004', '41000000-0000-0000-0000-000000000015', 3),
('31000000-0000-0000-0000-000000000004', '41000000-0000-0000-0000-000000000016', 4)
on conflict (character_id, power_id) do update set sort_order = excluded.sort_order;
