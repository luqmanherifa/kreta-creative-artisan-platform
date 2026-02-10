import { ExternalLink, Calendar, Hash, User, FileText } from "lucide-react";

export function ViewRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 w-40 flex-shrink-0">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex-1 text-sm text-gray-900">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );
}

export function ViewLink({ label, url, icon: Icon = ExternalLink }) {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 w-40 flex-shrink-0">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex-1 text-sm">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            <span>Open link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-gray-400 italic">Not provided</span>
        )}
      </div>
    </div>
  );
}

export function ViewBadge({ label, value, variant = "default", icon: Icon }) {
  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    creator: "bg-indigo-50 text-indigo-700 border-indigo-200",
    client: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 w-40 flex-shrink-0">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex-1">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            variants[value] || variants.default
          }`}
        >
          {value || "N/A"}
        </span>
      </div>
    </div>
  );
}

export function ViewDate({ label, value, icon: Icon = Calendar }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 w-40 flex-shrink-0">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex-1 text-sm text-gray-900">
        {formatDate(value) || (
          <span className="text-gray-400 italic">Not available</span>
        )}
      </div>
    </div>
  );
}

export function ViewImage({ label, url }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      {url ? (
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={url}
            alt={label}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className="hidden items-center justify-center h-64 text-gray-400"
            style={{ display: "none" }}
          >
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Unable to load image</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No image provided</p>
          </div>
        </div>
      )}
    </div>
  );
}
