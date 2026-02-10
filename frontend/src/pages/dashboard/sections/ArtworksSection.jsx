import PrimaryButton from "../../../components/Button/PrimaryButton";
import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";
import { ImagePlus } from "lucide-react";

export default function ArtworksSection({ openModal, refreshKey }) {
  const { data: artworks, remove } = useCrud("/artworks", [refreshKey]);

  const handleDelete = (artwork) => {
    const id = artwork.id || artwork.ID;
    if (!id) {
      alert("Artwork ID not found");
      return;
    }

    const title = artwork.title || `Artwork #${id}`;
    if (confirm(`Delete "${title}"? This action cannot be undone.`)) {
      remove(id);
    }
  };

  return (
    <Section
      title="Artworks Gallery"
      subtitle="Browse and manage creative works"
      action={
        <PrimaryButton
          onClick={() => openModal("Artwork", "create")}
          icon={ImagePlus}
        >
          Add Artwork
        </PrimaryButton>
      }
    >
      <DataTable
        data={artworks}
        onSelect={(a) => openModal("Artwork", "view", a)}
        onEdit={(a) => openModal("Artwork", "edit", a)}
        onDelete={handleDelete}
        emptyMessage="No artworks found. Start adding custom creative works to your gallery."
      />
    </Section>
  );
}
