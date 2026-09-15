import { notFound } from "next/navigation";
import { CharacterForm } from "@/components/admin/character-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};
export default async function EditCharacterPage({
  params,
  searchParams,
}: PageProps) {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const identifier = (await params).id;
  const identifierColumn =
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(identifier)
      ? "id"
      : "slug";
  const [{ data: character }, { data: powers }] = await Promise.all([
    client
      .from("characters")
      .select(
        "*,character_powers(power_id,sort_order,powers(id,name,description))",
      )
      .eq(identifierColumn, identifier)
      .single(),
    client.from("powers").select("id,name,description").order("name"),
  ]);
  if (!character) notFound();
  const characterPowers = [...(character.character_powers ?? [])].sort(
    (first, second) => first.sort_order - second.sort_order,
  );
  const value = {
    ...character,
    powers: characterPowers.map((relation) => relation.powers),
  };
  return (
    <main>
      <AdminPageHeader
        title={character.name}
        description="Mantenha os detalhes e poderes deste personagem atualizados."
        backHref="/admin/personagens"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <CharacterForm character={value} availablePowers={powers ?? []} />
      </section>
    </main>
  );
}
