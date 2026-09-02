export type PublishStatus = "draft" | "published";
export type StoryProgress = "ongoing" | "complete" | "paused";
export type CharacterRole = "hero" | "villain" | "other";
export type ThemeColor = "blue" | "red" | "yellow" | "green" | "violet";

export type ContentBlock = {
  id: string;
  type: "paragraph" | "heading" | "quote" | "list" | "image";
  text?: string;
  imageUrl?: string;
  alt?: string;
  caption?: string;
};

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  chapterNumber: number;
  status: PublishStatus;
  content: ContentBlock[];
  publishedAt: string | null;
};

export type Story = {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  category: string;
  progress: StoryProgress;
  status: PublishStatus;
  featured: boolean;
  coverUrl: string | null;
  accent: ThemeColor;
  publishedAt: string | null;
  chapters: Chapter[];
};

export type Power = { id: string; name: string; description: string };

export type Character = {
  id: string;
  slug: string;
  name: string;
  role: CharacterRole;
  shortDescription: string;
  biography: string;
  weaknesses: string[];
  curiosities: string[];
  imageUrl: string | null;
  accent: ThemeColor;
  sortOrder: number;
  featured: boolean;
  storySlug: string | null;
  groupName: string | null;
  status: PublishStatus;
  powers: Power[];
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string | null;
  relatedLabel: string | null;
  relatedType: "story" | "character" | null;
  status: PublishStatus;
  createdAt: string;
  accent: ThemeColor;
};
