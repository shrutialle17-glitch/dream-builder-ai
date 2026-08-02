import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorComponent({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-danger/5 border border-danger/20 rounded-2xl">
      <AlertCircle size={40} className="text-danger mb-4" />
      <h3 className="text-lg font-display font-semibold text-text-primary">{title}</h3>
      {message && <p className="text-text-secondary mt-2">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}
