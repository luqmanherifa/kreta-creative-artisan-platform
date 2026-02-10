import { X } from "lucide-react";
import { modalConfig } from "./modalConfig";

export default function DataModal({ type, mode, data, onClose, onSuccess }) {
  if (!type) return null;

  const config = modalConfig[type];
  if (!config) return null;

  const { Form, View } = config;

  const getTitle = () => {
    if (mode === "create") return `Add ${type}`;
    if (mode === "edit") return `Edit ${type}`;
    if (mode === "view") return `${type} Details`;
    return type;
  };

  const getSubtitle = () => {
    if (mode === "create") return `Create a new ${type.toLowerCase()} entry`;
    if (mode === "edit") return `Update ${type.toLowerCase()} information`;
    if (mode === "view") return `View ${type.toLowerCase()} information`;
    return null;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {getTitle()}
              </h2>
              {getSubtitle() && (
                <p className="text-sm text-gray-600">{getSubtitle()}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {mode === "view" ? (
            <View data={data} />
          ) : (
            <Form
              mode={mode}
              data={data}
              onClose={onClose}
              onSuccess={() => onSuccess?.(type)}
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                form={`${type.toLowerCase()}-form`}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {mode === "create" ? "Create" : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
