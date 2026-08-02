import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${icon ? 'pl-10 pr-4' : 'px-4'} py-2.5 bg-background border ${error ? 'border-danger focus:ring-danger' : 'border-border focus:ring-primary'} rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
