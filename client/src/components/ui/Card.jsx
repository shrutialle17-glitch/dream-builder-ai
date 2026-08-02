export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="px-6 py-5 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="text-lg font-display font-semibold text-text-primary">{title}</h3>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
