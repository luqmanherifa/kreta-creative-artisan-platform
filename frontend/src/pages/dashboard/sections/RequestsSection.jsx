import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";

export default function RequestsSection({ openModal, refreshKey }) {
  const { data: requests, remove } = useCrud("/requests", [refreshKey]);

  return (
    <Section
      title="Requests"
      action={
        <button
          className="border px-3 py-1 text-sm"
          onClick={() => openModal("Request", "create")}
        >
          + Add Request
        </button>
      }
    >
      <DataTable
        data={requests}
        onSelect={(r) => openModal("Request", "view", r)}
        onEdit={(r) => openModal("Request", "edit", r)}
        onDelete={(r) => {
          const id = r.id || r.ID;
          if (!id) return alert("Request ID tidak ditemukan");

          if (confirm(`Hapus request "${r.title}"?`)) {
            remove(id);
          }
        }}
      />
    </Section>
  );
}
