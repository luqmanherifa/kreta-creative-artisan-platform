import { Plus } from "lucide-react";

export default function PrimaryButton({
  onClick,
  icon: Icon = Plus,
  children,
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm hover:shadow-md",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md",
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 
        px-4 py-2.5 
        rounded-lg 
        font-medium text-sm 
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${variants[variant]}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}
