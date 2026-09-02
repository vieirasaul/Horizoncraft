"use client";
import { useMemo, useState } from "react";
import { CharacterCard } from "@/components/character-card";
import { EmptyState } from "@/components/empty-state";
import type { Character, CharacterRole } from "@/lib/types";

const roles: Array<{ value: "all" | CharacterRole; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "hero", label: "Heróis" },
  { value: "villain", label: "Vilões" },
  { value: "other", label: "Outros" },
];
export function CharacterBrowser({ characters }: { characters: Character[] }) {
  const [role, setRole] = useState<(typeof roles)[number]["value"]>("all");
  const visible = useMemo(
    () =>
      role === "all"
        ? characters
        : characters.filter((character) => character.role === role),
    [characters, role],
  );
  const availableRoles = roles.filter(
    (item) =>
      item.value === "all" ||
      characters.some((character) => character.role === item.value),
  );
  return (
    <>
      <div
        className="filter-row"
        role="group"
        aria-label="Filtrar personagens por categoria"
      >
        {availableRoles.map((item) => (
          <button
            className={item.value === role ? "active" : ""}
            aria-pressed={item.value === role}
            onClick={() => setRole(item.value)}
            key={item.value}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="collectible-grid character-gallery">
          {visible.map((character) => (
            <CharacterCard character={character} key={character.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Ainda não há personagens nesta categoria."
          description="Novos personagens aparecerão aqui conforme a história crescer."
        />
      )}
    </>
  );
}
