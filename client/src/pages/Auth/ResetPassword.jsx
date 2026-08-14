import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useResetPassword } from '../../hooks/useAuthQueries';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/common/ThemeToggle';
import { toast } from 'sonner';
import Logo from '../../components/common/Logo';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { mutate: resetPassword, isPending, isError, error } = useResetPassword();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = (data) => {
    resetPassword(
      { token, password: data.password },
      {
        onSuccess: () => navigate('/login')
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface overflow-hidden flex-col justify-between p-12 border-r border-border">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/auth-bg.png" alt="Background" className="w-full h-full object-cover opacity-50 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        {/* Top/Logo Area placeholder to keep spacing flex */}
        <div></div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-display font-bold text-text-primary mb-4 leading-tight">
            Secure Your Workspace
          </h2>
          <p className="text-text-secondary text-lg">
            Create a strong new password to continue building market-defining startups securely.
          </p>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-text-secondary uppercase">
            Executive Grade Security
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display font-bold text-lg text-text-primary">Dream Builder AI</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-[440px] bg-surface border border-border/60 rounded-3xl shadow-xl shadow-black/10 p-8 md:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Create New Password</h1>
              <p className="text-text-secondary text-sm">Enter your new password below.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                  {error?.message || 'This reset link is invalid or has expired.'}
                </div>
              )}

              <div className="relative">
                <Input 
                  label="NEW PASSWORD" 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-9 text-text-secondary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
                {!errors.password && <p className="text-xs text-text-secondary mt-1.5 ml-1">Minimum 8 characters</p>}
              </div>
              
              <div className="relative">
                <Input 
                  label="CONFIRM PASSWORD" 
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <button 
                  type="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-9 text-text-secondary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text-secondary">
              <Link to="/login" className="text-primary font-medium hover:text-primary-hover transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center text-xs text-text-secondary flex flex-col items-center gap-4">
          <p className="uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} DREAM BUILDER AI. EXECUTIVE GRADE INTELLIGENCE.</p>
        </div>
      </div>
    </div>
  );
}
