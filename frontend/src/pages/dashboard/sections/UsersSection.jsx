import PrimaryButton from "../../../components/Button/PrimaryButton";
import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";
import { Users } from "lucide-react";

export default function UsersSection({ openModal, refreshKey }) {
  const { data: users, remove } = useCrud("/users", [refreshKey]);

  const handleDelete = (user) => {
    const id = user.id || user.ID;
    if (!id) {
      alert("User ID not found");
      return;
    }

    if (
      confirm(`Delete user "${user.username}"? This action cannot be undone.`)
    ) {
      remove(id);
    }
  };

  return (
    <Section
      title="Users Management"
      subtitle="Manage user accounts and permissions"
      action={
        <PrimaryButton onClick={() => openModal("User", "create")}>
          Add User
        </PrimaryButton>
      }
    >
      <DataTable
        data={users}
        onSelect={(u) => openModal("User", "view", u)}
        onEdit={(u) => openModal("User", "edit", u)}
        onDelete={handleDelete}
        emptyMessage="No users found. Add your first user to get started."
      />
    </Section>
  );
}
