import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";

export default function ArtworksSection({ openModal, refreshKey }) {
  const { data: artworks, remove } = useCrud("/artworks", [refreshKey]);

  return (
    <Section
      title="Artworks"
      action={
        <button
          className="border px-3 py-1 text-sm"
          onClick={() => openModal("Artwork", "create")}
        >
          + Add Artwork
        </button>
      }
    >
      <DataTable
        data={artworks}
        onSelect={(a) => openModal("Artwork", "view", a)}
        onEdit={(a) => openModal("Artwork", "edit", a)}
        onDelete={(a) => {
          const id = a.id || a.ID;
          if (!id) return alert("Artwork ID tidak ditemukan");

          if (confirm(`Hapus artwork "${a.title}"?`)) {
            remove(id);
          }
        }}
      />
    </Section>
  );
}
