export default function DataTable({ data, onSelect, emptyMessage }) {
  if (!Array.isArray(data)) {
    return <p className="text-sm text-red-500">Invalid data</p>;
  }

  if (data.length === 0) {
    return (
      <p className="text-xs text-red-600">
        {emptyMessage || "No data or not allowed"}
      </p>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <table className="border w-full text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="border px-2 py-1 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => {
          const rowKey = row.ID ?? row.id;

          if (!rowKey) {
            console.warn("Row without ID:", row);
          }

          return (
            <tr
              key={rowKey}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect?.(row)}
            >
              {columns.map((col) => (
                <td key={`${rowKey}-${col}`} className="border px-2 py-1">
                  {String(row[col])}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
