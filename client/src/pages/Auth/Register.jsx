import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../../hooks/useAuthQueries';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/common/ThemeToggle';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegister();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data) => {
    // Send data to backend (company name included)
    registerUser(data, {
      onSuccess: () => navigate('/login')
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
            Building Your Vision
          </h2>
          <p className="text-text-secondary text-lg">
            The elite operating system for startup validation and growth. Experience executive-grade intelligence that transforms ideas into market leaders.
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
            <img src="/assets/images/logo.png" alt="Dream Builder AI" className="h-8 w-auto object-contain" />
            <span className="font-display font-bold text-lg text-text-primary">Dream Builder AI</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-[440px] bg-surface border border-border/60 rounded-3xl shadow-xl shadow-black/10 p-8 md:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Create Account</h1>
              <p className="text-text-secondary text-sm">Join the next generation of founders.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                label="FULL NAME" 
                type="text"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input 
                label="WORK EMAIL" 
                type="email"
                placeholder="name@company.com"
                {...register('email')}
                error={errors.email?.message}
              />
              
              <Input 
                label="COMPANY NAME" 
                type="text"
                placeholder="Visionary Labs"
                {...register('company')}
                error={errors.company?.message}
              />
              
              <div className="relative">
                <Input 
                  label="PASSWORD" 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-9 text-text-secondary hover:text-text-primary focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="pt-2 pb-1">
                <p className="text-xs text-text-secondary text-center leading-relaxed">
                  By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </div>
              
              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="bg-surface px-4 text-text-secondary">Sign up with</span>
              </div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border/60 bg-background/50 text-sm font-medium text-text-primary hover:bg-border/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border/60 bg-background/50 text-sm font-medium text-text-primary hover:bg-border/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-[#0A66C2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:text-primary-hover transition-colors">
                Log In
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center text-xs text-text-secondary flex flex-col items-center gap-4">
          <div className="flex gap-4 font-medium">
            <Link to="#" className="hover:text-text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-text-primary transition-colors">Terms</Link>
            <Link to="#" className="hover:text-text-primary transition-colors">Security</Link>
            <Link to="#" className="hover:text-text-primary transition-colors">Status</Link>
          </div>
          <p className="uppercase tracking-widest text-[10px]">© 2024 DREAM BUILDER AI. EXECUTIVE GRADE INTELLIGENCE.</p>
        </div>
      </div>
    </div>
  );
}
