import { Hash, User, Mail, Shield, Calendar } from "lucide-react";
import { ViewRow, ViewBadge, ViewDate } from "../ViewComponents";

export default function UserView({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-0">
      <ViewRow label="ID" value={data.id} icon={Hash} />
      <ViewRow label="Username" value={data.username} icon={User} />
      <ViewRow label="Email" value={data.email} icon={Mail} />
      <ViewBadge
        label="Role"
        value={data.role}
        variant={data.role}
        icon={Shield}
      />
      <ViewDate label="Created At" value={data.created_at} icon={Calendar} />
    </div>
  );
}
