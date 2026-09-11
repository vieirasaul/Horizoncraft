"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getAuthenticatedAdmin,
  createServerSupabaseClient,
} from "@/lib/supabase/server";

const requiredText = z.string().trim().min(1);
const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null);
const themeColor = z.enum(["blue", "red", "yellow", "green", "violet"]);
const databaseId = z
  .string()
  .regex(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i);
const storySchema = z.object({
  id: nullableText,
  title: requiredText,
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  synopsis: requiredText,
  category: requiredText,
  progress: z.enum(["ongoing", "complete", "paused"]),
  status: z.enum(["draft", "published"]),
  accent: themeColor,
  cover_path: nullableText,
});
const characterSchema = z.object({
  id: nullableText,
  name: requiredText,
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  role: z.enum(["hero", "villain", "other"]),
  short_description: requiredText,
  biography: z.string().trim(),
  curiosities: z.string(),
  group_name: nullableText,
  story_slug: nullableText,
  image_path: nullableText,
  accent: themeColor,
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["draft", "published"]),
});
const powerSchema = z.object({
  name: requiredText.max(100),
  description: requiredText.max(500),
});
const chapterSchema = z.object({
  id: nullableText,
  story_id: z.string().uuid(),
  title: requiredText,
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  chapter_number: z.coerce.number().int().min(1),
  status: z.enum(["draft", "published"]),
  content: z.string().transform((value, context) => {
    try {
      return JSON.parse(value);
    } catch {
      context.addIssue({ code: "custom", message: "Conteúdo inválido" });
      return z.NEVER;
    }
  }),
});

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function revalidateStoryPages() {
  revalidatePath("/");
  revalidatePath("/historias");
  revalidatePath("/historias/[slug]", "page");
  revalidatePath("/historias/[slug]/[chapterSlug]", "page");
}

function revalidateCharacterPages() {
  revalidatePath("/");
  revalidatePath("/personagens");
  revalidatePath("/personagens/[slug]", "page");
  revalidatePath("/poderes");
}

function revalidatePowerPages() {
  revalidateCharacterPages();
  revalidatePath("/admin/poderes");
}

function revalidateGalleryPages() {
  revalidatePath("/");
  revalidatePath("/galeria");
}

async function requireAdmin() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.client || !auth.user) redirect("/admin/login");
  return auth.client;
}

export async function signIn(formData: FormData) {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(8) })
    .safeParse(values(formData));
  if (!parsed.success) redirect("/admin/login?erro=campos");
  const client = await createServerSupabaseClient();
  if (!client) redirect("/admin/login?erro=configuracao");
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error) redirect("/admin/login?erro=credenciais");
  const {
    data: { user },
  } = await client.auth.getUser();
  const { data: profile } = await client
    .from("profiles")
    .select("is_admin")
    .eq("id", user?.id ?? "")
    .single();
  if (!profile?.is_admin) {
    await client.auth.signOut();
    redirect("/admin/login?erro=permissao");
  }
  redirect("/admin");
}
export async function signOut() {
  const client = await createServerSupabaseClient();
  await client?.auth.signOut();
  redirect("/admin/login");
}

export async function saveStory(formData: FormData) {
  const client = await requireAdmin();
  const parsed = storySchema.safeParse(values(formData));
  if (!parsed.success) redirect("/admin/historias/nova?erro=campos");
  const { id, ...story } = parsed.data;
  const payload = {
    ...story,
    featured: formData.get("featured") === "on",
    published_at:
      story.status === "published" ? new Date().toISOString() : null,
  };
  const result = id
    ? await client.from("stories").update(payload).eq("id", id)
    : await client.from("stories").insert(payload);
  if (result.error)
    redirect(
      `/admin/historias?erro=${encodeURIComponent(result.error.message)}`,
    );
  revalidateStoryPages();
  redirect("/admin/historias?sucesso=historia-salva");
}
export async function deleteStory(formData: FormData) {
  const client = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const { error } = await client.from("stories").delete().eq("id", id);
  if (error)
    redirect(`/admin/historias?erro=${encodeURIComponent(error.message)}`);
  revalidateStoryPages();
  redirect("/admin/historias?sucesso=historia-excluida");
}

export async function saveChapter(formData: FormData) {
  const client = await requireAdmin();
  const parsed = chapterSchema.safeParse(values(formData));
  if (!parsed.success)
    redirect(
      `/admin/historias/${formData.get("story_id")}/capitulos/novo?erro=campos`,
    );
  const { id, ...chapter } = parsed.data;
  const payload = {
    ...chapter,
    published_at:
      chapter.status === "published" ? new Date().toISOString() : null,
  };
  const result = id
    ? await client.from("chapters").update(payload).eq("id", id)
    : await client.from("chapters").insert(payload);
  if (result.error)
    redirect(
      `/admin/historias/${chapter.story_id}?erro=${encodeURIComponent(result.error.message)}`,
    );
  revalidateStoryPages();
  redirect(`/admin/historias/${chapter.story_id}?sucesso=capitulo-salvo`);
}
export async function deleteChapter(formData: FormData) {
  const client = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const storyId = z.string().uuid().parse(formData.get("story_id"));
  const { error } = await client.from("chapters").delete().eq("id", id);
  if (error)
    redirect(
      `/admin/historias/${storyId}?erro=${encodeURIComponent(error.message)}`,
    );
  revalidateStoryPages();
  redirect(`/admin/historias/${storyId}?sucesso=capitulo-excluido`);
}
export async function moveChapter(formData: FormData) {
  const client = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const storyId = z.string().uuid().parse(formData.get("story_id"));
  const chapterNumber = z.coerce
    .number()
    .int()
    .min(1)
    .parse(formData.get("chapter_number"));
  const { error } = await client.rpc("move_chapter", {
    target_chapter_id: id,
    new_chapter_number: chapterNumber,
  });
  if (error)
    redirect(
      `/admin/historias/${storyId}?erro=${encodeURIComponent(error.message)}`,
    );
  revalidateStoryPages();
  revalidatePath(`/admin/historias/${storyId}`);
  redirect(`/admin/historias/${storyId}?sucesso=ordem-atualizada`);
}

export async function saveCharacter(formData: FormData) {
  const client = await requireAdmin();
  const parsed = characterSchema.safeParse(values(formData));
  const parsedPowerIds = z
    .array(databaseId)
    .max(50)
    .safeParse(formData.getAll("power_ids"));
  if (!parsed.success || !parsedPowerIds.success)
    redirect("/admin/personagens/novo?erro=campos");
  const { id, curiosities, ...fields } = parsed.data;
  const powerIds = [...new Set(parsedPowerIds.data)];
  const payload = {
    ...fields,
    featured: formData.get("featured") === "on",
    curiosities: curiosities
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };
  const result = id
    ? await client
        .from("characters")
        .update(payload)
        .eq("id", id)
        .select("id")
        .single()
    : await client.from("characters").insert(payload).select("id").single();
  if (result.error)
    redirect(
      `/admin/personagens?erro=${encodeURIComponent(result.error.message)}`,
    );
  const characterId = result.data.id;
  const { error: deletePowersError } = await client
    .from("character_powers")
    .delete()
    .eq("character_id", characterId);
  if (deletePowersError) {
    revalidateCharacterPages();
    redirect(
      `/admin/personagens?erro=${encodeURIComponent(deletePowersError.message)}`,
    );
  }
  if (powerIds.length) {
    const { error: relationError } = await client
      .from("character_powers")
      .insert(
        powerIds.map((powerId, index) => ({
          character_id: characterId,
          power_id: powerId,
          sort_order: index + 1,
        })),
      );
    if (relationError) {
      revalidateCharacterPages();
      redirect(
        `/admin/personagens?erro=${encodeURIComponent(relationError.message)}`,
      );
    }
  }
  revalidateCharacterPages();
  redirect("/admin/personagens?sucesso=personagem-salvo");
}

export async function createPower(formData: FormData) {
  const client = await requireAdmin();
  const parsed = powerSchema.safeParse(values(formData));
  if (!parsed.success) redirect("/admin/poderes?erro=campos");

  const { data: existingPowers, error: lookupError } = await client
    .from("powers")
    .select("name");
  if (lookupError)
    redirect(`/admin/poderes?erro=${encodeURIComponent(lookupError.message)}`);

  const normalizedName = parsed.data.name.toLocaleLowerCase("pt-BR");
  const alreadyExists = existingPowers?.some(
    (power) => power.name.trim().toLocaleLowerCase("pt-BR") === normalizedName,
  );
  if (alreadyExists) redirect("/admin/poderes?erro=poder-existente");

  const { error } = await client.from("powers").insert(parsed.data);
  if (error?.code === "23505") redirect("/admin/poderes?erro=poder-existente");
  if (error)
    redirect(`/admin/poderes?erro=${encodeURIComponent(error.message)}`);

  revalidatePowerPages();
  redirect("/admin/poderes?sucesso=poder-criado");
}
export async function deleteCharacter(formData: FormData) {
  const client = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const { error } = await client.from("characters").delete().eq("id", id);
  if (error)
    redirect(`/admin/personagens?erro=${encodeURIComponent(error.message)}`);
  revalidateCharacterPages();
  redirect("/admin/personagens?sucesso=personagem-excluido");
}

export async function saveGalleryItem(formData: FormData) {
  const client = await requireAdmin();
  const parsed = z
    .object({
      id: nullableText,
      title: requiredText,
      caption: requiredText,
      image_path: requiredText,
      related_label: nullableText,
      related_type: z.enum(["story", "character"]).nullable().catch(null),
      accent: themeColor,
      status: z.enum(["draft", "published"]),
    })
    .safeParse(values(formData));
  if (!parsed.success) redirect("/admin/galeria/novo?erro=campos");
  const { id, ...payload } = parsed.data;
  const result = id
    ? await client.from("gallery_items").update(payload).eq("id", id)
    : await client.from("gallery_items").insert(payload);
  if (result.error)
    redirect(`/admin/galeria?erro=${encodeURIComponent(result.error.message)}`);
  revalidateGalleryPages();
  redirect("/admin/galeria?sucesso=imagem-salva");
}
export async function deleteGalleryItem(formData: FormData) {
  const client = await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const path = z.string().parse(formData.get("image_path"));
  const { error } = await client.from("gallery_items").delete().eq("id", id);
  if (error)
    redirect(`/admin/galeria?erro=${encodeURIComponent(error.message)}`);
  if (path) await client.storage.from("media").remove([path]);
  revalidateGalleryPages();
  redirect("/admin/galeria?sucesso=imagem-excluida");
}
