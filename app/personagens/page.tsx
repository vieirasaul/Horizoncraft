import type { Metadata } from "next";
import { CharacterBrowser } from "@/components/character-browser";
import { PublicShell } from "@/components/public-shell";
import { getCharacters } from "@/lib/data";
import "../public-pages.css";

export const metadata: Metadata = {
  title: "Personagens de Horizoncraft",
  description: "Conheça os personagens publicados da história de Horizoncraft.",
};
export default async function CharactersPage() {
  const characters = await getCharacters();
  return (
    <PublicShell>
      <main className="inner-page">
        <header className="page-hero">
          <p className="section-kicker">Elenco da história</p>
          <h1>Personagens de Horizoncraft</h1>
          <p>
            Heróis, vilões e outras figuras importantes aparecerão aqui conforme
            a história crescer.
          </p>
        </header>
        <section className="page-width content-section">
          <CharacterBrowser characters={characters} />
        </section>
      </main>
    </PublicShell>
  );
}
