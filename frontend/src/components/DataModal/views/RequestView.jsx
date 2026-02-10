import {
  Hash,
  User,
  Users,
  FileText,
  AlignLeft,
  Flag,
  Calendar,
} from "lucide-react";
import { ViewRow, ViewBadge, ViewDate } from "../ViewComponents";

export default function RequestView({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-0">
      <ViewRow label="ID" value={data.id} icon={Hash} />
      <ViewRow label="Client ID" value={data.client_id} icon={User} />
      <ViewRow label="Creator ID" value={data.creator_id} icon={Users} />
      <ViewRow label="Title" value={data.title} icon={FileText} />
      <ViewRow label="Details" value={data.details} icon={AlignLeft} />
      <ViewBadge
        label="Status"
        value={data.status}
        variant={data.status}
        icon={Flag}
      />
      <ViewDate label="Created At" value={data.created_at} icon={Calendar} />
    </div>
  );
}
