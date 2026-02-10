import { Hash, User, FileText, Globe, Calendar } from "lucide-react";
import { ViewRow, ViewLink, ViewDate } from "../ViewComponents";

export default function CreatorView({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-0">
      <ViewRow label="ID" value={data.id} icon={Hash} />
      <ViewRow label="User ID" value={data.user_id} icon={User} />
      <ViewRow label="Bio" value={data.bio} icon={FileText} />
      <ViewLink label="Website" url={data.website} icon={Globe} />
      <ViewDate label="Created At" value={data.created_at} icon={Calendar} />
    </div>
  );
}
