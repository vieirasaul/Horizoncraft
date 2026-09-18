"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  List,
  MessageSquareQuote,
  Plus,
  Text,
  Type,
} from "lucide-react";
import type { ContentBlock } from "@/lib/types";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";

const blockLabels: Record<ContentBlock["type"], string> = {
  paragraph: "Parágrafo",
  heading: "Título intermediário",
  quote: "Citação",
  list: "Lista",
  image: "Imagem",
};
const icons = {
  paragraph: Text,
  heading: Type,
  quote: MessageSquareQuote,
  list: List,
  image: ImagePlus,
};
export function ChapterEditor({
  initialBlocks = [],
}: {
  initialBlocks?: ContentBlock[];
}) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialBlocks.length
      ? initialBlocks
      : [{ id: crypto.randomUUID(), type: "paragraph", text: "" }],
  );
  function add(type: ContentBlock["type"]) {
    setBlocks((current) => [
      ...current,
      { id: crypto.randomUUID(), type, text: "" },
    ]);
  }
  function update(id: string, changes: Partial<ContentBlock>) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? { ...block, ...changes } : block,
      ),
    );
  }
  function move(index: number, direction: -1 | 1) {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  }
  return (
    <div className="chapter-editor">
      <input type="hidden" name="content" value={JSON.stringify(blocks)} />
      <div className="editor-help">
        <strong>Editor simples</strong>
        <p>
          Use <code>**texto**</code> para negrito e <code>_texto_</code> para
          itálico. O conteúdo é salvo em blocos seguros, sem HTML.
        </p>
      </div>
      <div className="block-toolbar" aria-label="Adicionar bloco">
        {(["paragraph", "heading", "quote", "list", "image"] as const).map(
          (type) => {
            const Icon = icons[type];
            return (
              <button type="button" onClick={() => add(type)} key={type}>
                <Icon /> {blockLabels[type]}
              </button>
            );
          },
        )}
      </div>
      <div className="editor-blocks">
        {blocks.map((block, index) => (
          <div className="editor-block" key={block.id}>
            <div className="block-heading">
              <strong>{blockLabels[block.type]}</strong>
              <div className="block-heading-actions">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  aria-label="Mover bloco para cima"
                  disabled={index === 0}
                >
                  <ChevronUp />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  aria-label="Mover bloco para baixo"
                  disabled={index === blocks.length - 1}
                >
                  <ChevronDown />
                </button>
                <DeleteConfirmationDialog
                  title={`Remover ${blockLabels[block.type].toLocaleLowerCase()}?`}
                  description="O bloco será removido do editor. Salve o capítulo para aplicar a alteração."
                  triggerLabel="Remover"
                  confirmLabel="Remover"
                  onConfirm={() =>
                    setBlocks((current) =>
                      current.filter((item) => item.id !== block.id),
                    )
                  }
                />
              </div>
            </div>
            {block.type === "image" ? (
              <>
                <ImageUploadField
                  name={`chapter-image-${block.id}`}
                  initialPath={block.imageUrl}
                  onPathChange={(imageUrl) => update(block.id, { imageUrl })}
                />
                <label>
                  Texto alternativo
                  <input
                    value={block.alt ?? ""}
                    onChange={(event) =>
                      update(block.id, { alt: event.target.value })
                    }
                    placeholder="Descreva o que aparece na imagem"
                  />
                </label>
                <label>
                  Legenda
                  <input
                    value={block.caption ?? ""}
                    onChange={(event) =>
                      update(block.id, { caption: event.target.value })
                    }
                  />
                </label>
              </>
            ) : (
              <label>
                Conteúdo
                <textarea
                  rows={block.type === "paragraph" ? 5 : 3}
                  value={block.text ?? ""}
                  onChange={(event) =>
                    update(block.id, { text: event.target.value })
                  }
                  placeholder={
                    block.type === "list"
                      ? "Um item por linha"
                      : "Escreva aqui…"
                  }
                />
              </label>
            )}
          </div>
        ))}
      </div>
      <button
        className="add-block"
        type="button"
        onClick={() => add("paragraph")}
      >
        <Plus /> Adicionar parágrafo
      </button>
    </div>
  );
}
