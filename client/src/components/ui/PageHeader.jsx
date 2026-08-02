export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">{title}</h1>
        {description && <p className="text-text-secondary mt-1">{description}</p>}
      </div>
      {action && (
        <div>
          <button
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}
