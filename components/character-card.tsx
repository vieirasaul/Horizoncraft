import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
import { CharacterArtwork } from "@/components/character-artwork";
import { PowerBadge } from "@/components/power-badge";
import type { Character } from "@/lib/types";

export function CharacterCard({ character }: { character: Character }) {
  const roleLabel =
    character.role === "hero"
      ? "Herói"
      : character.role === "villain"
        ? "Vilão"
        : "Outro";
  return (
    <Link
      className={`collectible-card role-${character.role} accent-${character.accent}`}
      href={`/personagens/${character.slug}`}
      aria-label={`Ver personagem ${character.name}`}
    >
      <div className="collectible-topline">
        <span>Horizoncraft</span>
        <span>
          <Shield aria-hidden="true" /> {roleLabel}
        </span>
      </div>
      <CharacterArtwork
        id={character.id}
        name={character.name}
        slug={character.slug}
        accent={character.accent}
        imageUrl={character.imageUrl}
      />
      <div className="collectible-copy">
        <h3>{character.name}</h3>
        {character.powers[0] && (
          <PowerBadge
            name={character.powers[0].name}
            accent={character.accent}
          />
        )}
        <p>{character.shortDescription}</p>
        <span className="collectible-link-label">
          Ver personagem <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
