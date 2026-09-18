import { saveChapter } from "@/app/admin/actions";
import { ChapterEditor } from "@/components/admin/chapter-editor";
import { PublicationToggle } from "@/components/admin/publication-toggle";
import { SubmitButton } from "@/components/admin/submit-button";
import type { ContentBlock } from "@/lib/types";
type ChapterValue = {
  id?: string;
  title?: string;
  slug?: string;
  chapter_number?: number;
  status?: string;
  content?: ContentBlock[];
};
export function ChapterForm({
  storyId,
  chapter = {},
  nextNumber = 1,
}: {
  storyId: string;
  chapter?: ChapterValue;
  nextNumber?: number;
}) {
  return (
    <form action={saveChapter} className="admin-form admin-editor-form">
      <input type="hidden" name="id" value={chapter.id ?? ""} />
      <input type="hidden" name="story_id" value={storyId} />
      <input type="hidden" name="current_slug" value={chapter.slug ?? ""} />
      <div className="form-grid form-grid-three">
        <label>
          Título
          <input name="title" defaultValue={chapter.title} required />
        </label>
        <label>
          Endereço amigável
          <input
            name="slug"
            defaultValue={chapter.slug}
            required
            pattern="[a-z0-9-]+"
          />
        </label>
        <label>
          Número
          <input
            type="number"
            name="chapter_number"
            defaultValue={chapter.chapter_number ?? nextNumber}
            min={1}
            required
          />
        </label>
      </div>
      <PublicationToggle defaultPublished={chapter.status === "published"} />
      <ChapterEditor initialBlocks={chapter.content} />
      <div className="form-actions">
        <SubmitButton>
          {chapter.id ? "Salvar capítulo" : "Criar capítulo"}
        </SubmitButton>
      </div>
    </form>
  );
}
