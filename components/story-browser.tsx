"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { EmptyState } from "@/components/empty-state";
import type { Story, StoryProgress } from "@/lib/types";

const filters: Array<{ value: "all" | StoryProgress; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "ongoing", label: "Em andamento" },
  { value: "complete", label: "Concluídas" },
  { value: "paused", label: "Em pausa" },
];
const progressLabels: Record<StoryProgress, string> = {
  ongoing: "Em andamento",
  complete: "Concluída",
  paused: "Em pausa",
};

export function StoryBrowser({ stories }: { stories: Story[] }) {
  const [filter, setFilter] =
    useState<(typeof filters)[number]["value"]>("all");
  const visibleStories = useMemo(
    () =>
      filter === "all"
        ? stories
        : stories.filter((story) => story.progress === filter),
    [filter, stories],
  );
  return (
    <>
      <div
        className="filter-row"
        role="group"
        aria-label="Filtrar histórias por estado"
      >
        {filters.map((item) => (
          <button
            className={filter === item.value ? "active" : ""}
            onClick={() => setFilter(item.value)}
            key={item.value}
            aria-pressed={filter === item.value}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visibleStories.length ? (
        <div className="story-list">
          {visibleStories.map((story) => (
            <article className="story-list-card" key={story.id}>
              <CoverArt
                title={story.title}
                accent={story.accent}
                imageUrl={story.coverUrl}
              />
              <div>
                <div className="card-labels">
                  <span className="tag">{story.category}</span>
                  <span className={`status status-${story.progress}`}>
                    {progressLabels[story.progress]}
                  </span>
                </div>
                <h2>{story.title}</h2>
                <p>{story.synopsis}</p>
                <div className="story-meta">
                  <span>
                    {story.chapters.length}{" "}
                    {story.chapters.length === 1
                      ? "capítulo publicado"
                      : "capítulos publicados"}
                  </span>
                  <span>
                    {story.publishedAt
                      ? new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(story.publishedAt))
                      : story.category}
                  </span>
                </div>
                <Link className="text-link" href={`/historias/${story.slug}`}>
                  Conhecer a história <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma história por aqui"
          description="Tente outro filtro ou volte em breve para encontrar uma nova aventura."
        />
      )}
    </>
  );
}
