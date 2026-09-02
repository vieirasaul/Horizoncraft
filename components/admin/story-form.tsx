import { saveStory } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";

type StoryValue = {
  id?: string;
  title?: string;
  slug?: string;
  synopsis?: string;
  category?: string;
  progress?: string;
  status?: string;
  accent?: string;
  cover_path?: string | null;
  featured?: boolean;
};
export function StoryForm({ story = {} }: { story?: StoryValue }) {
  return (
    <form action={saveStory} className="admin-form admin-editor-form">
      <input type="hidden" name="id" value={story.id ?? ""} />
      <div className="form-grid">
        <label>
          Título
          <input
            name="title"
            defaultValue={story.title}
            required
            maxLength={100}
            placeholder="A grande aventura"
          />
        </label>
        <label>
          Endereço amigável
          <input
            name="slug"
            defaultValue={story.slug}
            required
            pattern="[a-z0-9-]+"
            placeholder="a-grande-aventura"
          />
          <small>Use letras minúsculas, números e hífens.</small>
        </label>
      </div>
      <label>
        Sinopse
        <textarea
          name="synopsis"
          defaultValue={story.synopsis}
          required
          rows={5}
          maxLength={600}
          placeholder="Conte o que torna esta história especial…"
        />
      </label>
      <div className="form-grid form-grid-three">
        <label>
          Categoria
          <input
            name="category"
            defaultValue={story.category}
            required
            placeholder="Aventura"
          />
        </label>
        <label>
          Situação da história
          <select name="progress" defaultValue={story.progress ?? "ongoing"}>
            <option value="ongoing">Em andamento</option>
            <option value="complete">Concluída</option>
            <option value="paused">Em pausa</option>
          </select>
        </label>
        <label>
          Publicação
          <select name="status" defaultValue={story.status ?? "draft"}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Cor principal</legend>
        <div className="color-options">
          <label>
            <input
              type="radio"
              name="accent"
              value="blue"
              defaultChecked={!story.accent || story.accent === "blue"}
            />
            <span className="swatch-blue" /> Azul
          </label>
          <label>
            <input
              type="radio"
              name="accent"
              value="red"
              defaultChecked={story.accent === "red"}
            />
            <span className="swatch-red" /> Vermelho
          </label>
          <label>
            <input
              type="radio"
              name="accent"
              value="yellow"
              defaultChecked={story.accent === "yellow"}
            />
            <span className="swatch-yellow" /> Amarelo
          </label>
          <label>
            <input
              type="radio"
              name="accent"
              value="green"
              defaultChecked={story.accent === "green"}
            />
            <span className="swatch-green" /> Verde
          </label>
          <label>
            <input
              type="radio"
              name="accent"
              value="violet"
              defaultChecked={story.accent === "violet"}
            />
            <span className="swatch-violet" /> Violeta
          </label>
        </div>
      </fieldset>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={story.featured}
        />{" "}
        Mostrar esta história em destaque na página inicial
      </label>
      <label>Capa da história</label>
      <ImageUploadField name="cover_path" initialPath={story.cover_path} />
      <div className="form-actions">
        <SubmitButton>
          {story.id ? "Salvar alterações" : "Salvar história"}
        </SubmitButton>
      </div>
    </form>
  );
}
