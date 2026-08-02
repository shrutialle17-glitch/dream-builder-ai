export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-2xl border-dashed">
      {icon && <div className="text-text-secondary mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-display font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-text-secondary mt-2 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-background border border-border text-text-primary font-medium rounded-xl hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
