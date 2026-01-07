import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";

export default function CreatorsSection({ openModal, refreshKey }) {
  const { data: creators, remove } = useCrud("/creators", [refreshKey]);

  return (
    <Section
      title="Creators"
      action={
        <button
          className="border px-3 py-1 text-sm"
          onClick={() => openModal("Creator", "create")}
        >
          + Add Creator
        </button>
      }
    >
      <DataTable
        data={creators}
        onSelect={(c) => openModal("Creator", "view", c)}
        onEdit={(c) => openModal("Creator", "edit", c)}
        onDelete={(c) => {
          const id = c.id || c.ID;
          if (!id) return alert("Creator ID tidak ditemukan");

          if (confirm(`Hapus creator "${c.username || c.id}"?`)) {
            remove(id);
          }
        }}
      />
    </Section>
  );
}
