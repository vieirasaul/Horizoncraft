import { saveCharacter } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";

type CharacterValue = {
  id?: string;
  name?: string;
  slug?: string;
  role?: string;
  short_description?: string;
  biography?: string;
  weaknesses?: string[];
  curiosities?: string[];
  group_name?: string | null;
  story_slug?: string | null;
  image_path?: string | null;
  accent?: string;
  sort_order?: number;
  featured?: boolean;
  status?: string;
  powers?: Array<{ name: string; description: string }>;
};
export function CharacterForm({
  character = {},
}: {
  character?: CharacterValue;
}) {
  return (
    <form action={saveCharacter} className="admin-form admin-editor-form">
      <input type="hidden" name="id" value={character.id ?? ""} />
      <div className="form-grid">
        <label>
          Nome do personagem
          <input
            name="name"
            defaultValue={character.name}
            required
            maxLength={100}
          />
        </label>
        <label>
          Endereço amigável
          <input
            name="slug"
            defaultValue={character.slug}
            required
            pattern="[a-z0-9-]+"
            placeholder="nome-do-personagem"
          />
        </label>
      </div>
      <div className="form-grid form-grid-four">
        <label>
          Categoria
          <select name="role" defaultValue={character.role ?? "hero"}>
            <option value="hero">Herói</option>
            <option value="villain">Vilão</option>
            <option value="other">Outro</option>
          </select>
        </label>
        <label>
          Cor principal
          <select name="accent" defaultValue={character.accent ?? "blue"}>
            <option value="blue">Azul</option>
            <option value="red">Vermelho</option>
            <option value="yellow">Amarelo</option>
            <option value="green">Verde</option>
            <option value="violet">Violeta</option>
          </select>
        </label>
        <label>
          Ordem de exibição
          <input
            type="number"
            name="sort_order"
            min={0}
            defaultValue={character.sort_order ?? 0}
          />
        </label>
        <label>
          Publicação
          <select name="status" defaultValue={character.status ?? "draft"}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>
      </div>
      <label>
        Descrição curta
        <textarea
          name="short_description"
          defaultValue={character.short_description}
          required
          rows={3}
          maxLength={260}
        />
      </label>
      <label>
        Biografia
        <textarea
          name="biography"
          defaultValue={character.biography}
          rows={7}
          placeholder="Pode ser preenchida quando houver mais detalhes confirmados."
        />
      </label>
      <div className="form-grid">
        <label>
          Poderes
          <textarea
            name="powers"
            defaultValue={character.powers
              ?.map((power) => `${power.name}: ${power.description}`)
              .join("\n")}
            rows={6}
            placeholder="Nome do poder: descrição do poder"
          />
          <small>
            Escreva um poder por linha, separando nome e descrição com
            dois-pontos.
          </small>
        </label>
        <label>
          Fraquezas
          <textarea
            name="weaknesses"
            defaultValue={character.weaknesses?.join("\n")}
            rows={6}
            placeholder="Uma fraqueza por linha"
          />
        </label>
      </div>
      <label>
        Curiosidades
        <textarea
          name="curiosities"
          defaultValue={character.curiosities?.join("\n")}
          rows={5}
          placeholder="Uma curiosidade por linha"
        />
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={character.featured}
        />
        Mostrar este personagem em destaque na página inicial
      </label>
      <div className="form-grid">
        <label>
          Grupo relacionado
          <input name="group_name" defaultValue={character.group_name ?? ""} />
        </label>
        <label>
          Endereço da história relacionada
          <input
            name="story_slug"
            defaultValue={character.story_slug ?? ""}
            placeholder="a-grande-aventura"
          />
        </label>
      </div>
      <label>Desenho do personagem</label>
      <ImageUploadField name="image_path" initialPath={character.image_path} />
      <div className="form-actions">
        <SubmitButton>
          {character.id ? "Salvar alterações" : "Adicionar personagem"}
        </SubmitButton>
      </div>
    </form>
  );
}
