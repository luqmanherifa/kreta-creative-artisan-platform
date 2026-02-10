import PrimaryButton from "../../../components/Button/PrimaryButton";
import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";
import { Palette } from "lucide-react";

export default function CreatorsSection({ openModal, refreshKey }) {
  const { data: creators, remove } = useCrud("/creators", [refreshKey]);

  const handleDelete = (creator) => {
    const id = creator.id || creator.ID;
    if (!id) {
      alert("Artisan ID not found");
      return;
    }

    const name = creator.username || creator.name || `ID ${id}`;
    if (confirm(`Delete artisan "${name}"? This action cannot be undone.`)) {
      remove(id);
    }
  };

  return (
    <Section
      title="Artisans Management"
      subtitle="Manage creative talents and their portfolios"
      action={
        <PrimaryButton onClick={() => openModal("Creator", "create")}>
          Add Artisan
        </PrimaryButton>
      }
    >
      <DataTable
        data={creators}
        onSelect={(c) => openModal("Creator", "view", c)}
        onEdit={(c) => openModal("Creator", "edit", c)}
        onDelete={handleDelete}
        emptyMessage="No artisans found. Add talented creators to showcase their work."
      />
    </Section>
  );
}
