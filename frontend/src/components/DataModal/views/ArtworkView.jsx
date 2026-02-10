import {
  Hash,
  User,
  FileText,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { ViewRow, ViewImage, ViewDate } from "../ViewComponents";

export default function ArtworkView({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-0">
      <ViewRow label="ID" value={data.id} icon={Hash} />
      <ViewRow label="Creator ID" value={data.creator_id} icon={User} />
      <ViewRow label="Title" value={data.title} icon={FileText} />
      <ViewRow label="Description" value={data.description} icon={FileText} />
      <ViewImage label="Artwork Preview" url={data.media_url} />
      <ViewDate label="Created At" value={data.created_at} icon={Calendar} />
    </div>
  );
}
