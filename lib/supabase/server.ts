import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createServerClient } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Components cannot set cookies. */
        }
      },
    },
  });
}

export const getAuthenticatedAdmin = cache(
  async function getAuthenticatedAdmin() {
    const client = await createServerSupabaseClient();
    if (!client) return { client: null, user: null };
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return { client, user: null };
    const { data: profile } = await client
      .from("profiles")
      .select("is_admin, display_name")
      .eq("id", user.id)
      .single();
    return { client, user: profile?.is_admin ? user : null, profile };
  },
);
