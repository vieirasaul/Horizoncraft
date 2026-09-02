import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { demoCharacters, demoGallery, demoStories } from "@/lib/demo-data";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Character, ContentBlock, GalleryItem, Story } from "@/lib/types";

type StoryRow = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  category: string;
  progress: Story["progress"];
  status: Story["status"];
  featured: boolean;
  cover_path: string | null;
  accent: Story["accent"];
  published_at: string | null;
  chapters?: Array<{
    id: string;
    slug: string;
    title: string;
    chapter_number: number;
    status: "draft" | "published";
    content: ContentBlock[];
    published_at: string | null;
  }>;
};

function mapStory(row: StoryRow): Story {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    synopsis: row.synopsis,
    category: row.category,
    progress: row.progress,
    status: row.status,
    featured: row.featured,
    coverUrl: null,
    accent: row.accent,
    publishedAt: row.published_at,
    chapters: (row.chapters ?? []).map((chapter) => ({
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      chapterNumber: chapter.chapter_number,
      status: chapter.status,
      content: chapter.content ?? [],
      publishedAt: chapter.published_at,
    })),
  };
}

async function signMediaPath(
  client: SupabaseClient,
  path: string | null | undefined,
) {
  if (!path) return null;
  if (path.startsWith("https://")) return path;
  const { data, error } = await client.storage
    .from("media")
    .createSignedUrl(path, 60 * 60);
  return error ? null : data.signedUrl;
}

export async function getStories(): Promise<Story[]> {
  noStore();
  const client = createPublicSupabaseClient();
  if (!client) return demoStories;
  const { data, error } = await client
    .from("stories")
    .select("*, chapters(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("chapter_number", { referencedTable: "chapters", ascending: true });
  if (error) {
    console.error("Could not load stories:", error.message);
    return [];
  }
  return Promise.all(
    (data as StoryRow[]).map(async (row) => {
      const story = mapStory(row);
      story.coverUrl = await signMediaPath(client, row.cover_path);
      story.chapters = await Promise.all(
        story.chapters.map(async (chapter) => ({
          ...chapter,
          content: await Promise.all(
            chapter.content.map(async (block) =>
              block.type === "image" && block.imageUrl
                ? {
                    ...block,
                    imageUrl:
                      (await signMediaPath(client, block.imageUrl)) ??
                      undefined,
                  }
                : block,
            ),
          ),
        })),
      );
      return story;
    }),
  );
}

export async function getStory(slug: string) {
  return (await getStories()).find((story) => story.slug === slug) ?? null;
}

export async function getCharacters(): Promise<Character[]> {
  noStore();
  const client = createPublicSupabaseClient();
  if (!client) return demoCharacters;
  const { data, error } = await client
    .from("characters")
    .select("*, character_powers(powers(*))")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("sort_order", {
      referencedTable: "character_powers",
      ascending: true,
    })
    .order("name");
  if (error) {
    console.error("Could not load characters:", error.message);
    return [];
  }
  return (await Promise.all(
    data.map(async (row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      role: row.role,
      shortDescription: row.short_description,
      biography: row.biography,
      weaknesses: row.weaknesses ?? [],
      curiosities: row.curiosities ?? [],
      imageUrl: await signMediaPath(client, row.image_path),
      accent: row.accent,
      sortOrder: row.sort_order ?? 0,
      featured: row.featured ?? false,
      storySlug: row.story_slug,
      groupName: row.group_name,
      status: row.status,
      powers: (row.character_powers ?? []).map(
        (relation: {
          powers: { id: string; name: string; description: string };
        }) => relation.powers,
      ),
    })),
  )) as Character[];
}

export async function getCharacter(slug: string) {
  return (
    (await getCharacters()).find((character) => character.slug === slug) ?? null
  );
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  noStore();
  const client = createPublicSupabaseClient();
  if (!client) return demoGallery;
  const { data, error } = await client
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load gallery:", error.message);
    return [];
  }
  return (await Promise.all(
    data.map(async (row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption,
      imageUrl: await signMediaPath(client, row.image_path),
      relatedLabel: row.related_label,
      relatedType: row.related_type,
      status: row.status,
      createdAt: row.created_at,
      accent: row.accent,
    })),
  )) as GalleryItem[];
}
