import Image from "next/image";
import type { ThemeColor } from "@/lib/types";
import "./cover-art.css";

export function CoverArt({
  title,
  accent = "blue",
  imageUrl,
  className = "",
  label = "História Horizoncraft",
  subtitle = "Heróis, poderes e aventuras",
}: {
  title: string;
  accent?: ThemeColor;
  imageUrl?: string | null;
  className?: string;
  label?: string;
  subtitle?: string;
}) {
  if (imageUrl)
    return (
      <div className={`cover-art ${className}`}>
        <Image
          src={imageUrl}
          alt={`Capa de ${title}`}
          fill
          sizes="(max-width: 700px) 90vw, 380px"
        />
      </div>
    );
  return (
    <div
      className={`cover-art cover-${accent} ${className}`}
      role="img"
      aria-label={`Arte abstrata provisória para ${title}`}
    >
      <span className="cover-halftone" />
      <span className="cover-block cover-block-one" />
      <span className="cover-block cover-block-two" />
      <span className="cover-star">★</span>
      <span className="cover-lightning" />
      <small>{label}</small>
      <strong>{title}</strong>
      <em>{subtitle}</em>
    </div>
  );
}
