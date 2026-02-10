import { Eye, Edit, Trash2 } from "lucide-react";

export default function DataTable({
  data,
  onSelect,
  onEdit,
  onDelete,
  emptyMessage,
}) {
  if (!Array.isArray(data)) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
        Invalid data format
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No data found</p>
          <p className="text-sm text-gray-500">
            {emptyMessage || "No data available at the moment"}
          </p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const formatColumnName = (col) => {
    return col
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {formatColumnName(col)}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => {
              const rowKey = row.ID ?? row.id;
              if (!rowKey) {
                console.warn("Row without ID:", row);
              }
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-indigo-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${rowKey}-${col}`}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {String(row[col])}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {onSelect && (
                        <button
                          onClick={() => onSelect(row)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
