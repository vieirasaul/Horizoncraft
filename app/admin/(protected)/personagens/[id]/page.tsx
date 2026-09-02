import { notFound } from "next/navigation";
import { CharacterForm } from "@/components/admin/character-form";
import { Notice } from "@/components/admin/notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAuthenticatedAdmin } from "@/lib/supabase/server";
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
};
export default async function EditCharacterPage({
  params,
  searchParams,
}: PageProps) {
  const { client } = await getAuthenticatedAdmin();
  if (!client) return null;
  const { data: character } = await client!
    .from("characters")
    .select("*,character_powers(powers(name,description))")
    .eq("id", (await params).id)
    .single();
  if (!character) notFound();
  const value = {
    ...character,
    powers: (character.character_powers ?? []).map(
      (relation: { powers: { name: string; description: string } }) =>
        relation.powers,
    ),
  };
  return (
    <main>
      <AdminPageHeader
        eyebrow="Editar personagem"
        title={character.name}
        description="Mantenha os detalhes e poderes deste personagem atualizados."
        backHref="/admin/personagens"
      />
      <section className="admin-content admin-form-wrap">
        <Notice error={(await searchParams).erro} />
        <CharacterForm character={value} />
      </section>
    </main>
  );
}
