import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SUCCESS_COOKIE } from "@/lib/admin-flash-cookie";

const successMessages = {
  "chapter-saved": "Capítulo salvo com sucesso.",
  "chapter-deleted": "Capítulo excluído com sucesso.",
  "chapter-reordered": "Ordem dos capítulos atualizada com sucesso.",
  "character-saved": "Personagem salvo com sucesso.",
  "character-reordered": "Ordem dos personagens atualizada com sucesso.",
  "character-deleted": "Personagem excluído com sucesso.",
  "power-created": "Poder criado com sucesso.",
  "power-deleted": "Poder excluído com sucesso.",
  "gallery-item-saved": "Desenho salvo com sucesso.",
  "gallery-item-deleted": "Desenho excluído com sucesso.",
} as const;

export type AdminSuccessCode = keyof typeof successMessages;

export async function setAdminSuccess(code: AdminSuccessCode) {
  const id = crypto.randomUUID();
  (await cookies()).set(ADMIN_SUCCESS_COOKIE, `${code}:${id}`, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60,
  });
}

export async function getAdminSuccess() {
  const value = (await cookies()).get(ADMIN_SUCCESS_COOKIE)?.value;
  if (!value) return null;

  const separator = value.indexOf(":");
  if (separator < 1) return null;

  const code = value.slice(0, separator) as AdminSuccessCode;
  const id = value.slice(separator + 1);
  const message = successMessages[code];

  return message && id ? { id, message } : null;
}
