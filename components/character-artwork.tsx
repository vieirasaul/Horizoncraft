import Image from "next/image";
import { getCharacterVisualKey } from "@/lib/content-identity";
import type { ThemeColor } from "@/lib/types";
import "./character-artwork.css";

export function CharacterArtwork({
  id,
  name,
  slug,
  accent,
  imageUrl,
  sizes = "(max-width: 700px) 100vw, 33vw",
  loading,
}: {
  id: string;
  name: string;
  slug: string;
  accent: ThemeColor;
  imageUrl?: string | null;
  sizes?: string;
  loading?: "eager" | "lazy";
}) {
  const visualKey = getCharacterVisualKey(id, slug);

  return (
    <div
      className={`character-artwork character-artwork-${visualKey} accent-${accent}`}
      role="img"
      aria-label={
        imageUrl ? `Desenho de ${name}` : `Símbolo provisório de ${name}`
      }
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Desenho de ${name}`}
          fill
          sizes={sizes}
          loading={loading}
        />
      ) : (
        <>
          <span className="art-aura" />
          <span className="art-symbol" />
          <span className="art-detail art-detail-one" />
          <span className="art-detail art-detail-two" />
          <span className="art-detail art-detail-three" />
        </>
      )}
    </div>
  );
}
