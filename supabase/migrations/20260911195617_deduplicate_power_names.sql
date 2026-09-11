-- Keep the oldest record for each power name and preserve every character link.
create temporary table power_dedup_map on commit drop as
select duplicate_id, canonical_id
from (
  select
    id as duplicate_id,
    first_value(id) over power_name_group as canonical_id,
    row_number() over power_name_group as duplicate_position
  from public.powers
  window power_name_group as (
    partition by lower(btrim(name))
    order by created_at, id
  )
) ranked_powers
where duplicate_position > 1;

insert into public.character_powers (character_id, power_id, sort_order)
select
  character_powers.character_id,
  power_dedup_map.canonical_id,
  min(character_powers.sort_order)
from public.character_powers
join power_dedup_map
  on power_dedup_map.duplicate_id = character_powers.power_id
group by character_powers.character_id, power_dedup_map.canonical_id
on conflict (character_id, power_id) do update
set sort_order = least(
  public.character_powers.sort_order,
  excluded.sort_order
);

delete from public.powers
using power_dedup_map
where powers.id = power_dedup_map.duplicate_id;

update public.powers
set name = btrim(name)
where name <> btrim(name);

create unique index if not exists powers_name_normalized_unique_idx
  on public.powers (lower(name));
