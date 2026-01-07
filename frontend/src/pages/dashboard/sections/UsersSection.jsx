import Section from "../../../components/Section";
import DataTable from "../../../components/DataTable";
import { useCrud } from "../../../hooks/useCrud";

export default function UsersSection({ openModal, refreshKey }) {
  const { data: users, remove } = useCrud("/users", [refreshKey]);

  return (
    <Section
      title="Users"
      action={
        <button
          className="border px-3 py-1 text-sm"
          onClick={() => openModal("User", "create")}
        >
          + Add User
        </button>
      }
    >
      <DataTable
        data={users}
        onSelect={(u) => openModal("User", "view", u)}
        onEdit={(u) => openModal("User", "edit", u)}
        onDelete={(u) => {
          const id = u.id || u.ID;
          if (id && confirm(`Hapus user ${u.username}?`)) {
            remove(id);
          }
        }}
      />
    </Section>
  );
}
