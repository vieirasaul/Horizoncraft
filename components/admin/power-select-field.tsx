"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";

export type PowerOption = {
  id: string;
  name: string;
  description: string;
};

export function PowerSelectField({
  powers,
  initialPowerIds = [],
}: {
  powers: PowerOption[];
  initialPowerIds?: string[];
}) {
  const validInitialIds = initialPowerIds.filter((id) =>
    powers.some((power) => power.id === id),
  );
  const [selectedIds, setSelectedIds] = useState(validInitialIds);
  const [nextPowerId, setNextPowerId] = useState("");
  const selectedPowers = useMemo(
    () =>
      selectedIds.flatMap((id) => {
        const power = powers.find((item) => item.id === id);
        return power ? [power] : [];
      }),
    [powers, selectedIds],
  );
  const availablePowers = powers.filter(
    (power) => !selectedIds.includes(power.id),
  );

  function addPower() {
    if (!nextPowerId || selectedIds.includes(nextPowerId)) return;
    setSelectedIds((current) => [...current, nextPowerId]);
    setNextPowerId("");
  }

  function removePower(id: string) {
    setSelectedIds((current) => current.filter((item) => item !== id));
  }

  return (
    <fieldset className="power-picker">
      <legend>Poderes</legend>
      <p>Escolha um poder já cadastrado e clique em adicionar.</p>
      {powers.length ? (
        <>
          <div className="power-picker-controls">
            <select
              aria-label="Escolher poder"
              value={nextPowerId}
              onChange={(event) => setNextPowerId(event.target.value)}
            >
              <option value="">Selecione um poder</option>
              {availablePowers.map((power) => (
                <option value={power.id} key={power.id}>
                  {power.name}
                </option>
              ))}
            </select>
            <button
              className="admin-secondary"
              type="button"
              disabled={!nextPowerId}
              onClick={addPower}
            >
              <Plus aria-hidden="true" /> Adicionar
            </button>
          </div>
          {selectedPowers.length ? (
            <ul className="selected-powers">
              {selectedPowers.map((power) => (
                <li key={power.id}>
                  <input type="hidden" name="power_ids" value={power.id} />
                  <span>
                    <strong>{power.name}</strong>
                    <small>{power.description}</small>
                  </span>
                  <DeleteConfirmationDialog
                    title={`Remover “${power.name}” deste personagem?`}
                    description="O poder será retirado deste personagem quando você salvar as alterações."
                    triggerLabel="Remover"
                    confirmLabel="Remover poder"
                    triggerIcon={<X aria-hidden="true" />}
                    showTriggerLabel={false}
                    triggerAriaLabel={`Remover ${power.name} deste personagem`}
                    onConfirm={() => removePower(power.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="power-picker-empty">
              Nenhum poder adicionado a este personagem.
            </p>
          )}
        </>
      ) : (
        <p className="power-picker-empty">
          Nenhum poder foi cadastrado ainda.{" "}
          <Link href="/admin/poderes">Cadastrar o primeiro poder</Link>
        </p>
      )}
    </fieldset>
  );
}
