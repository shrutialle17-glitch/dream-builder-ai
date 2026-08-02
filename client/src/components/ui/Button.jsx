export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90 focus:ring-primary',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-background focus:ring-border',
    danger: 'bg-danger text-white hover:bg-opacity-90 focus:ring-danger',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
