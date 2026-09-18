import { saveGalleryItem } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PublicationToggle } from "@/components/admin/publication-toggle";
import { SubmitButton } from "@/components/admin/submit-button";

type GalleryValue = {
  id?: string;
  title?: string;
  caption?: string;
  image_path?: string | null;
  related_label?: string | null;
  related_type?: string | null;
  status?: string;
};
export function GalleryForm({ item = {} }: { item?: GalleryValue }) {
  return (
    <form action={saveGalleryItem} className="admin-form admin-editor-form">
      <input type="hidden" name="id" value={item.id ?? ""} />
      <div className="form-grid">
        <label>
          Título do desenho
          <input
            name="title"
            defaultValue={item.title}
            required
            maxLength={100}
          />
        </label>
        <PublicationToggle defaultPublished={item.status === "published"} />
      </div>
      <label>
        Legenda
        <textarea
          name="caption"
          defaultValue={item.caption}
          required
          rows={4}
          maxLength={400}
        />
      </label>
      <div className="form-grid">
        <label>
          Relacionado a
          <input
            name="related_label"
            defaultValue={item.related_label ?? ""}
            placeholder="Nome da história ou personagem"
          />
        </label>
        <label>
          Tipo de relação
          <select
            name="related_type"
            defaultValue={item.related_type ?? "story"}
          >
            <option value="story">História</option>
            <option value="character">Personagem</option>
          </select>
        </label>
      </div>
      <label>Arquivo do desenho</label>
      <ImageUploadField
        name="image_path"
        initialPath={item.image_path}
        required
      />
      <div className="form-actions">
        <SubmitButton>
          {item.id ? "Salvar alterações" : "Adicionar desenho"}
        </SubmitButton>
      </div>
    </form>
  );
}
