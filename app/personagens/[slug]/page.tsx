import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Shield, Sparkles, Swords } from "lucide-react";
import { CharacterArtwork } from "@/components/character-artwork";
import { PowerBadge } from "@/components/power-badge";
import { PublicShell } from "@/components/public-shell";
import { getCharacter } from "@/lib/data";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const character = await getCharacter((await params).slug);
  if (!character) return { title: "Personagem não encontrado" };
  return {
    title: character.name,
    description: character.shortDescription,
    openGraph: {
      title: character.name,
      description: character.shortDescription,
      images: [],
    },
    twitter: {
      title: character.name,
      description: character.shortDescription,
      images: [],
    },
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const character = await getCharacter((await params).slug);
  if (!character) notFound();
  const roleName =
    character.role === "hero"
      ? "Herói"
      : character.role === "villain"
        ? "Vilão"
        : "Outro";
  const RoleIcon =
    character.role === "hero"
      ? Shield
      : character.role === "villain"
        ? Swords
        : Sparkles;
  const hasFacts =
    character.weaknesses.length > 0 || character.curiosities.length > 0;

  return (
    <PublicShell>
      <main>
        <section
          className={`character-detail accent-${character.accent} role-${character.role}`}
        >
          <div className="page-width">
            <Link className="back-link" href="/personagens">
              <ArrowLeft size={17} /> Todos os personagens
            </Link>
            <div className="character-detail-grid">
              <div className="detail-art-frame">
                <CharacterArtwork
                  name={character.name}
                  slug={character.slug}
                  accent={character.accent}
                  imageUrl={character.imageUrl}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </div>
              <div className="character-title">
                <span className="role-label">
                  <RoleIcon aria-hidden="true" /> {roleName}
                </span>
                <h1>{character.name}</h1>
                <p>{character.shortDescription}</p>
                <div className="character-power-tags">
                  {character.powers.slice(0, 3).map((power) => (
                    <PowerBadge
                      name={power.name}
                      accent={character.accent}
                      key={power.id}
                    />
                  ))}
                </div>
                {character.groupName && (
                  <span className="group-label">
                    Grupo: {character.groupName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`character-info page-width ${character.biography ? "" : "character-info-without-bio"}`}
        >
          {character.biography && (
            <article className="bio-panel">
              <p className="section-kicker">História do personagem</p>
              <h2>Biografia</h2>
              <p>{character.biography}</p>
              {character.storySlug && (
                <Link
                  className="text-link"
                  href={`/historias/${character.storySlug}`}
                >
                  <BookOpen size={17} /> Ver história relacionada
                </Link>
              )}
            </article>
          )}
          <div className="power-panel">
            <p className="section-kicker">Habilidades conhecidas</p>
            <h2>Poderes</h2>
            <div className="power-detail-grid">
              {character.powers.map((power, index) => (
                <article className="power-item" key={power.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{power.name}</h3>
                    <p>{power.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {hasFacts && (
            <article className="facts-panel">
              {character.weaknesses.length > 0 && (
                <div>
                  <h2>Fraquezas</h2>
                  <ul>
                    {character.weaknesses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {character.curiosities.length > 0 && (
                <div>
                  <h2>Curiosidades</h2>
                  <ul>
                    {character.curiosities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </section>
      </main>
    </PublicShell>
  );
}
