export default function Section({ title, subtitle, action, children }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      <div>{children}</div>
    </div>
  );
}
