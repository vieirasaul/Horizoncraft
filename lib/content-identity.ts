export const SPECIAL_MESSAGE_STORY_ID = "11000000-0000-0000-0000-000000000001";

const CHARACTER_VISUAL_KEYS: Record<string, string> = {
  "31000000-0000-0000-0000-000000000001": "caveira-vermelha",
  "31000000-0000-0000-0000-000000000002": "kauan-raio",
  "31000000-0000-0000-0000-000000000003": "metanic",
  "31000000-0000-0000-0000-000000000004": "blood-phantom",
};

export function getCharacterVisualKey(id: string, fallbackSlug: string) {
  return CHARACTER_VISUAL_KEYS[id] ?? fallbackSlug;
}
