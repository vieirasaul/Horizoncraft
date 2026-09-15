import { describe, expect, it } from "vitest";
import {
  getCharacterVisualKey,
  HORIZONCRAFT_STORY_ID,
  SPECIAL_MESSAGE_CHAPTER_ID,
} from "@/lib/content-identity";
import { demoCharacters, demoGallery, demoStories } from "@/lib/demo-data";
import { databaseIdSchema } from "@/lib/validation";

describe("demo content", () => {
  it("accepts the fixed database IDs used by the initial content", () => {
    expect(
      databaseIdSchema.safeParse("11000000-0000-0000-0000-000000000001")
        .success,
    ).toBe(true);
    expect(
      databaseIdSchema.safeParse("21000000-0000-0000-0000-000000000001")
        .success,
    ).toBe(true);
  });

  it("uses unique friendly URLs", () => {
    expect(new Set(demoStories.map((story) => story.slug)).size).toBe(
      demoStories.length,
    );
    expect(
      new Set(demoCharacters.map((character) => character.slug)).size,
    ).toBe(demoCharacters.length);
    expect(
      [...demoStories, ...demoCharacters].every((item) =>
        /^[a-z0-9-]+$/.test(item.slug),
      ),
    ).toBe(true);
  });

  it("keeps published chapters in reading order", () => {
    for (const story of demoStories) {
      const numbers = story.chapters.map((chapter) => chapter.chapterNumber);
      expect(numbers).toEqual(
        [...numbers].sort((first, second) => first - second),
      );
      expect(
        story.chapters.every((chapter) => chapter.status === "published"),
      ).toBe(true);
    }
  });

  it("publishes Horizoncraft with its opening chapter and confirmed heroes", () => {
    expect(demoStories.map((story) => story.slug)).toEqual(["horizoncraft"]);
    expect(demoStories[0].title).toBe("Horizoncraft");
    expect(demoStories[0].category).toBe("Aventura");
    expect(demoStories[0].chapters).toHaveLength(1);
    expect(demoStories[0].chapters[0]).toMatchObject({
      title: "Parabéns, Théo!",
      slug: "parabens-theo",
    });
    expect(demoCharacters.map((character) => character.name)).toEqual([
      "Caveira Vermelha",
      "Kauan Raio",
      "Metanic",
      "Blood Phantom",
    ]);
    expect(demoCharacters.every((character) => character.role === "hero")).toBe(
      true,
    );
    expect(demoCharacters.every((character) => character.featured)).toBe(true);
    expect(demoGallery).toEqual([]);
  });

  it("does not invent private facts for unfinished character profiles", () => {
    const profilesWithoutBiography = demoCharacters.filter(
      (character) => character.slug !== "kauan-raio",
    );
    expect(
      profilesWithoutBiography.every((character) => !character.biography),
    ).toBe(true);
    expect(
      demoCharacters.every(
        (character) =>
          character.weaknesses.length === 0 &&
          character.curiosities.length === 0,
      ),
    ).toBe(true);
  });

  it("keeps content identities and character visuals independent from slugs", () => {
    expect(demoStories[0].id).toBe(HORIZONCRAFT_STORY_ID);
    expect(demoStories[0].chapters[0].id).toBe(SPECIAL_MESSAGE_CHAPTER_ID);
    expect(
      getCharacterVisualKey(
        "31000000-0000-0000-0000-000000000001",
        "slug-alterado",
      ),
    ).toBe("caveira-vermelha");
    expect(getCharacterVisualKey("novo-personagem", "slug-original")).toBe(
      "slug-original",
    );
  });
});
