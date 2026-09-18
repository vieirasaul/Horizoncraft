"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";
import "./gallery-browser.css";

function GalleryArtwork({ item }: { item: GalleryItem }) {
  return (
    <div
      className={`gallery-art accent-${item.accent}`}
      role="img"
      aria-label={
        item.imageUrl ? item.title : `Arte abstrata provisória de ${item.title}`
      }
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 580px) calc(100vw - 32px), (max-width: 820px) calc(50vw - 24px), 377px"
        />
      ) : (
        <>
          <span className="gallery-orb" />
          <span className="gallery-streak streak-one" />
          <span className="gallery-streak streak-two" />
          <strong>{item.title}</strong>
        </>
      )}
    </div>
  );
}
export function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);
  if (!items.length)
    return (
      <EmptyState
        title="Os primeiros desenhos do Horizoncraft aparecerão aqui em breve."
        description="Novos desenhos serão publicados quando estiverem prontos."
      />
    );
  return (
    <>
      <div className="gallery-grid">
        {items.map((item) => (
          <button
            className="gallery-card"
            onClick={() => setSelected(item)}
            key={item.id}
            aria-label={`Ampliar ${item.title}`}
          >
            <GalleryArtwork item={item} />
            <div>
              <span>{item.relatedLabel ?? "Horizoncraft"}</span>
              <h2>{item.title}</h2>
              <p>{item.caption}</p>
            </div>
            <Maximize2 className="enlarge-icon" />
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada de ${selected.title}`}
          onClick={() => setSelected(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setSelected(null)}
            aria-label="Fechar visualização"
          >
            <X />
          </button>
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <GalleryArtwork item={selected} />
            <div>
              <span>{selected.relatedLabel}</span>
              <h2>{selected.title}</h2>
              <p>{selected.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
