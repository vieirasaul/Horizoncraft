"use server";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setAdminSuccess, type AdminSuccessCode } from "@/lib/admin-flash";
import {
  getAuthenticatedAdmin,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import { databaseIdSchema } from "@/lib/validation";

const requiredText = z.string().trim().min(1);
const nullableText = z
  .string()
  .trim()
  .transform((value) => value || null);
const themeColor = z.enum(["blue", "red", "yellow", "green", "violet"]);
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9-]+$/);
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
  image_path: nullableText,
  accent: themeColor,
  status: z.enum(["draft", "published"]),
});
const powerSchema = z.object({
  name: requiredText.max(100),
  description: requiredText.max(500),
});
const chapterSchema = z.object({
  id: nullableText,
  story_id: databaseIdSchema,
  title: requiredText,
  slug: slugSchema,
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
  updateTag("stories");
  revalidatePath("/");
  revalidatePath("/capitulos");
  revalidatePath("/capitulos/[slug]", "page");
}

function revalidateCharacterPages() {
  updateTag("characters");
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/personagens");
  revalidatePath("/personagens/[slug]", "page");
  revalidatePath("/poderes");
}

function revalidatePowerPages() {
  revalidateCharacterPages();
  revalidatePath("/admin/poderes");
}

function revalidateGalleryPages() {
  updateTag("gallery");
  revalidatePath("/");
  revalidatePath("/galeria");
}

async function requireAdmin() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.client || !auth.user) redirect("/admin/login");
  return auth.client;
}

async function redirectWithSuccess(
  path: string,
  code: AdminSuccessCode,
): Promise<never> {
  await setAdminSuccess(code);
  redirect(path);
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

export async function saveChapter(formData: FormData) {
  const client = await requireAdmin();
  const currentSlug = slugSchema.safeParse(formData.get("current_slug"));
  const formPath = currentSlug.success
    ? `/admin/capitulos/${currentSlug.data}`
    : "/admin/capitulos/novo";
  const parsed = chapterSchema.safeParse(values(formData));
  if (!parsed.success) redirect(`${formPath}?erro=campos`);
  const { id, ...chapter } = parsed.data;
  const payload = {
    ...chapter,
    published_at:
      chapter.status === "published" ? new Date().toISOString() : null,
  };
  let result;
  if (id) {
    result = await client.from("chapters").update(payload).eq("id", id);
  } else {
    const { data: lastChapter, error: orderError } = await client
      .from("chapters")
      .select("chapter_number")
      .eq("story_id", chapter.story_id)
      .order("chapter_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (orderError)
      redirect(`${formPath}?erro=${encodeURIComponent(orderError.message)}`);
    result = await client.from("chapters").insert({
      ...payload,
      chapter_number: (lastChapter?.chapter_number ?? 0) + 1,
    });
  }
  if (result.error)
    redirect(`${formPath}?erro=${encodeURIComponent(result.error.message)}`);
  revalidateStoryPages();
  return redirectWithSuccess("/admin/capitulos", "chapter-saved");
}
export async function deleteChapter(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  databaseIdSchema.parse(formData.get("story_id"));
  const { error } = await client.from("chapters").delete().eq("id", id);
  if (error)
    redirect(`/admin/capitulos?erro=${encodeURIComponent(error.message)}`);
  revalidateStoryPages();
  return redirectWithSuccess("/admin/capitulos", "chapter-deleted");
}
export async function moveChapter(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  databaseIdSchema.parse(formData.get("story_id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));
  const { data: chapter, error: chapterError } = await client
    .from("chapters")
    .select("chapter_number")
    .eq("id", id)
    .single();
  if (chapterError)
    redirect(
      `/admin/capitulos?erro=${encodeURIComponent(chapterError.message)}`,
    );
  const chapterNumber = Math.max(
    1,
    chapter.chapter_number + (direction === "up" ? -1 : 1),
  );
  const { error } = await client.rpc("move_chapter", {
    target_chapter_id: id,
    new_chapter_number: chapterNumber,
  });
  if (error)
    redirect(`/admin/capitulos?erro=${encodeURIComponent(error.message)}`);
  revalidateStoryPages();
  revalidatePath("/admin/capitulos");
  return redirectWithSuccess("/admin/capitulos", "chapter-reordered");
}

export async function saveCharacter(formData: FormData) {
  const client = await requireAdmin();
  const parsed = characterSchema.safeParse(values(formData));
  const parsedPowerIds = z
    .array(databaseIdSchema)
    .max(50)
    .safeParse(formData.getAll("power_ids"));
  if (!parsed.success || !parsedPowerIds.success)
    redirect("/admin/personagens/novo?erro=campos");
  const { id, curiosities, ...fields } = parsed.data;
  const powerIds = [...new Set(parsedPowerIds.data)];
  const payload = {
    ...fields,
    curiosities: curiosities
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };
  let result;
  if (id) {
    result = await client
      .from("characters")
      .update(payload)
      .eq("id", id)
      .select("id")
      .single();
  } else {
    const { data: lastCharacter, error: orderError } = await client
      .from("characters")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (orderError)
      redirect(
        `/admin/personagens?erro=${encodeURIComponent(orderError.message)}`,
      );
    result = await client
      .from("characters")
      .insert({
        ...payload,
        sort_order: (lastCharacter?.sort_order ?? -1) + 1,
      })
      .select("id")
      .single();
  }
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
  return redirectWithSuccess("/admin/personagens", "character-saved");
}

export async function moveCharacter(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));
  const { data: characters, error: loadError } = await client
    .from("characters")
    .select("id,sort_order,updated_at")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (loadError)
    redirect(
      `/admin/personagens?erro=${encodeURIComponent(loadError.message)}`,
    );

  const currentIndex = characters.findIndex((character) => character.id === id);
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= characters.length)
    return redirectWithSuccess("/admin/personagens", "character-reordered");

  const reordered = [...characters];
  [reordered[currentIndex], reordered[targetIndex]] = [
    reordered[targetIndex],
    reordered[currentIndex],
  ];
  for (const [index, character] of reordered.entries()) {
    const { error } = await client
      .from("characters")
      .update({ sort_order: index })
      .eq("id", character.id);
    if (error)
      redirect(`/admin/personagens?erro=${encodeURIComponent(error.message)}`);
  }
  revalidateCharacterPages();
  return redirectWithSuccess("/admin/personagens", "character-reordered");
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
  return redirectWithSuccess("/admin/poderes", "power-created");
}
export async function deletePower(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  const { error } = await client.from("powers").delete().eq("id", id);
  if (error)
    redirect(`/admin/poderes?erro=${encodeURIComponent(error.message)}`);
  revalidatePowerPages();
  return redirectWithSuccess("/admin/poderes", "power-deleted");
}
export async function deleteCharacter(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  const { error } = await client.from("characters").delete().eq("id", id);
  if (error)
    redirect(`/admin/personagens?erro=${encodeURIComponent(error.message)}`);
  revalidateCharacterPages();
  return redirectWithSuccess("/admin/personagens", "character-deleted");
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
  return redirectWithSuccess("/admin/galeria", "gallery-item-saved");
}
export async function deleteGalleryItem(formData: FormData) {
  const client = await requireAdmin();
  const id = databaseIdSchema.parse(formData.get("id"));
  const path = z.string().parse(formData.get("image_path"));
  const { error } = await client.from("gallery_items").delete().eq("id", id);
  if (error)
    redirect(`/admin/galeria?erro=${encodeURIComponent(error.message)}`);
  if (path) await client.storage.from("media").remove([path]);
  revalidateGalleryPages();
  return redirectWithSuccess("/admin/galeria", "gallery-item-deleted");
}
