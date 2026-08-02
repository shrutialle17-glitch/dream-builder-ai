import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, description, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-display font-semibold text-text-primary">{title}</h2>
            {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary focus:outline-none self-start">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-background rounded-b-2xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
