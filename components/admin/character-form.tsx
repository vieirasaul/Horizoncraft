import { saveCharacter } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  PowerSelectField,
  type PowerOption,
} from "@/components/admin/power-select-field";
import { PublicationToggle } from "@/components/admin/publication-toggle";
import { SubmitButton } from "@/components/admin/submit-button";

type CharacterValue = {
  id?: string;
  name?: string;
  slug?: string;
  role?: string;
  short_description?: string;
  biography?: string;
  curiosities?: string[];
  image_path?: string | null;
  accent?: string;
  sort_order?: number;
  status?: string;
  powers?: PowerOption[];
};
export function CharacterForm({
  character = {},
  availablePowers,
}: {
  character?: CharacterValue;
  availablePowers: PowerOption[];
}) {
  return (
    <form action={saveCharacter} className="admin-form admin-editor-form">
      <input type="hidden" name="id" value={character.id ?? ""} />
      <div className="character-publication-toggle">
        <PublicationToggle
          defaultPublished={character.status === "published"}
        />
      </div>
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
      <div className="form-grid form-grid-three">
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
      <PowerSelectField
        powers={availablePowers}
        initialPowerIds={character.powers?.map((power) => power.id)}
      />
      <label>
        Curiosidades
        <textarea
          name="curiosities"
          defaultValue={character.curiosities?.join("\n")}
          rows={5}
          placeholder="Uma curiosidade por linha"
        />
      </label>
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
