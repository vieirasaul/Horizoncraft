import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PublicShell } from "@/components/public-shell";
import { getCharacters } from "@/lib/data";
import type { Character, Power } from "@/lib/types";
import "../public-pages.css";

type PowerEntry = Power & {
  characters: Array<Pick<Character, "name" | "slug" | "accent">>;
};

export const metadata: Metadata = {
  title: "Poderes do Horizoncraft",
  description:
    "Conheça as habilidades dos personagens publicados em Horizoncraft.",
};

export default async function PowersPage() {
  const characters = await getCharacters();
  const powerEntries = new Map<string, PowerEntry>();

  for (const character of characters) {
    for (const power of character.powers) {
      const key = power.name.toLocaleLowerCase("pt-BR");
      const entry = powerEntries.get(key);
      const characterSummary = {
        name: character.name,
        slug: character.slug,
        accent: character.accent,
      };
      if (entry) {
        entry.characters.push(characterSummary);
      } else {
        powerEntries.set(key, {
          ...power,
          characters: [characterSummary],
        });
      }
    }
  }

  const powers = [...powerEntries.values()];

  return (
    <PublicShell>
      <main className="inner-page">
        <header className="page-hero powers-page-hero">
          <p className="section-kicker">Habilidades dos personagens</p>
          <h1>Poderes do Horizoncraft</h1>
          <p>
            Fogo, eletricidade, transformação e energia fantasmagórica são
            apenas algumas das habilidades que fazem parte desta história.
          </p>
        </header>
        <section className="page-width content-section">
          {powers.length ? (
            <div className="powers-directory">
              {powers.map((power) => (
                <article
                  className={`power-directory-card accent-${power.characters[0].accent}`}
                  key={power.name}
                >
                  <Sparkles aria-hidden="true" />
                  <h2>{power.name}</h2>
                  <p>{power.description}</p>
                  <div>
                    <small>
                      {power.characters.length === 1
                        ? "Personagem relacionado"
                        : "Personagens relacionados"}
                    </small>
                    {power.characters.map((character) => (
                      <Link
                        href={`/personagens/${character.slug}`}
                        key={character.slug}
                      >
                        {character.name} <ArrowRight aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Os poderes aparecerão aqui conforme os personagens forem surgindo."
              description="Quando uma habilidade for publicada, ela será ligada ao personagem correspondente."
            />
          )}
        </section>
      </main>
    </PublicShell>
  );
}
