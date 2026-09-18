"use client";

import { useState } from "react";

export function PublicationToggle({
  defaultPublished = false,
}: {
  defaultPublished?: boolean;
}) {
  const [published, setPublished] = useState(defaultPublished);

  return (
    <div className="publication-toggle-field">
      <span className="publication-toggle-label">Publicação</span>
      <input
        type="hidden"
        name="status"
        value={published ? "published" : "draft"}
      />
      <button
        className={`publication-toggle ${published ? "is-published" : "is-draft"}`}
        type="button"
        role="switch"
        aria-checked={published}
        onClick={() => setPublished((current) => !current)}
      >
        <span className="publication-toggle-copy">
          <strong>{published ? "Publicado" : "Rascunho"}</strong>
          <small>
            {published ? "Visível para os leitores" : "Salvo apenas no painel"}
          </small>
        </span>
        <span className="publication-toggle-track" aria-hidden="true">
          <span className="publication-toggle-thumb" />
        </span>
      </button>
    </div>
  );
}
