import PrimaryButton from "../../../components/Button/PrimaryButton";
import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";
import { FileText } from "lucide-react";

export default function RequestsSection({ openModal, refreshKey }) {
  const { data: requests, remove } = useCrud("/requests", [refreshKey]);

  const handleDelete = (request) => {
    const id = request.id || request.ID;
    if (!id) {
      alert("Request ID not found");
      return;
    }

    const title = request.title || `Request #${id}`;
    if (
      confirm(
        `Delete project request "${title}"? This action cannot be undone.`,
      )
    ) {
      remove(id);
    }
  };

  return (
    <Section
      title="Project Requests"
      subtitle="Track and manage custom artwork commissions"
      action={
        <PrimaryButton
          onClick={() => openModal("Request", "create")}
          icon={FileText}
        >
          New Request
        </PrimaryButton>
      }
    >
      <DataTable
        data={requests}
        onSelect={(r) => openModal("Request", "view", r)}
        onEdit={(r) => openModal("Request", "edit", r)}
        onDelete={handleDelete}
        emptyMessage="No project requests found. Clients can submit custom artwork requests here."
      />
    </Section>
  );
}
