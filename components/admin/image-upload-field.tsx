"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 3 * 1024 * 1024;

async function resizeImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  bitmap.close();
  return blob ?? file;
}

export function ImageUploadField({
  name,
  initialPath = "",
  required = false,
  onPathChange,
}: {
  name: string;
  initialPath?: string | null;
  required?: boolean;
  onPathChange?: (path: string) => void;
}) {
  const [path, setPath] = useState(initialPath ?? "");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  async function upload(file: File) {
    setMessage("");
    if (!allowedTypes.includes(file.type))
      return setMessage("Use uma imagem JPEG, PNG ou WebP.");
    if (file.size > maxBytes)
      return setMessage("A imagem deve ter no máximo 3 MB.");
    const client = createBrowserSupabaseClient();
    if (!client)
      return setMessage("Configure o Supabase antes de enviar imagens.");
    setBusy(true);
    setPreview(URL.createObjectURL(file));
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) throw new Error("Sua sessão expirou. Entre novamente.");
      const resized = await resizeImage(file);
      const safePath = `${user.id}/${crypto.randomUUID()}.webp`;
      const { error } = await client.storage
        .from("media")
        .upload(safePath, resized, {
          contentType: "image/webp",
          upsert: false,
        });
      if (error) throw error;
      setPath(safePath);
      onPathChange?.(safePath);
      setMessage("Imagem pronta para salvar.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
      );
      setPreview("");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!path || !window.confirm("Excluir este arquivo do armazenamento?"))
      return;
    const client = createBrowserSupabaseClient();
    setBusy(true);
    const { error } = (await client?.storage.from("media").remove([path])) ?? {
      error: new Error("Supabase não configurado"),
    };
    if (error) setMessage("Não foi possível excluir a imagem.");
    else {
      setPath("");
      onPathChange?.("");
      setPreview("");
      setMessage("Imagem excluída.");
    }
    setBusy(false);
  }
  return (
    <div className="image-upload">
      <input type="hidden" name={name} value={path} required={required} />
      <input
        className="sr-only"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <div className="upload-preview">
        {preview ? (
          <Image
            src={preview}
            alt="Prévia da imagem selecionada"
            width={900}
            height={600}
            unoptimized
          />
        ) : path ? (
          <span>
            Arquivo atual
            <br />
            <small>{path.split("/").at(-1)}</small>
          </span>
        ) : (
          <span>Nenhuma imagem selecionada</span>
        )}
      </div>
      <div className="upload-actions">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus />{" "}
          {busy ? "Enviando…" : path ? "Substituir" : "Escolher imagem"}
        </button>
        {path && (
          <button
            type="button"
            className="danger-button"
            disabled={busy}
            onClick={() => void remove()}
          >
            <Trash2 /> Excluir arquivo
          </button>
        )}
      </div>
      <small>
        JPEG, PNG ou WebP. Máximo de 3 MB. Imagens grandes são reduzidas
        automaticamente.
      </small>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
