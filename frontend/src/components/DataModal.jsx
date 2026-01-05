export default function DataModal({ title, data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 w-[500px] max-h-[80vh] overflow-auto">
        <h3 className="font-semibold mb-2">{title}</h3>

        <pre className="text-xs bg-gray-100 p-2">
          {JSON.stringify(data, null, 2)}
        </pre>

        <button className="mt-2 border px-3 py-1" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
