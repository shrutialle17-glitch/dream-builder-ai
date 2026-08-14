import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuthQueries';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/common/ThemeToggle';
import Logo from '../../components/common/Logo';
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending, isError, error } = useForgotPassword();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data) => {
    forgotPassword(data.email, {
      onSuccess: () => setIsSubmitted(true)
    });
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
            Account Recovery
          </h2>
          <p className="text-text-secondary text-lg">
            Regain access to your workspace. Continue building market-defining startups with our AI-powered intelligence.
          </p>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-text-secondary uppercase">
            Standardizing Startup Excellence
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
              <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Reset Password</h1>
              <p className="text-text-secondary text-sm">Enter your work email to receive a reset link.</p>
            </div>
            
            {isSubmitted ? (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-text-primary text-sm font-medium text-center space-y-4">
                <p>We've sent a password reset link to your email.</p>
                <Button variant="outline" className="w-full h-11" onClick={() => setIsSubmitted(false)}>
                  Send again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {isError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                    {error?.response?.data?.message || error?.message || 'Failed to send reset link.'}
                  </div>
                )}
                <Input 
                  label="WORK EMAIL" 
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                
                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
                  {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-text-secondary">
              Remember your password?{' '}
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
