import Image from "next/image";
import type { ThemeColor } from "@/lib/types";

export function CharacterArtwork({
  name,
  slug,
  accent,
  imageUrl,
  sizes = "(max-width: 700px) 100vw, 33vw",
}: {
  name: string;
  slug: string;
  accent: ThemeColor;
  imageUrl?: string | null;
  sizes?: string;
}) {
  return (
    <div
      className={`character-artwork character-artwork-${slug} accent-${accent}`}
      role="img"
      aria-label={
        imageUrl ? `Desenho de ${name}` : `Símbolo provisório de ${name}`
      }
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={`Desenho de ${name}`} fill sizes={sizes} />
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
