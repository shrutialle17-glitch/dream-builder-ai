import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useLogin } from "../../hooks/useAuthQueries";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ThemeToggle from "../../components/common/ThemeToggle";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../services/auth.api";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending, isError, error } = useLogin();
  const { setContextLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 1. Send Google's token to our backend
      const res = await loginWithGoogle(credentialResponse.credential);

      // 2. Set the user in your global React Context
      setContextLogin(res.data.user, res.data.token);

      // 3. Send them to the dashboard!
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface overflow-hidden flex-col justify-between p-14 border-r border-border">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/auth-bg.png"
            alt="Background"
            className="w-full h-full object-cover opacity-100 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent"></div>
        </div>

        {/* Ambient accent glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img
            src="/assets/images/logo.png"
            alt="Dream Builder AI"
            className="h-9 w-auto object-contain"
          />
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">
            Dream Builder AI
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-md">
          <div className="h-px w-12 bg-primary mb-6"></div>
          <h2 className="text-[2.75rem] font-display font-bold text-text-primary mb-5 leading-[1.1] tracking-tight">
            Building Your Vision
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            The elite operating system for startup validation and growth.
            Experience executive-grade intelligence that transforms ideas into
            market leaders.
          </p>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60"></div>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-text-secondary uppercase whitespace-nowrap">
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
            <img
              src="/assets/images/logo.png"
              alt="Dream Builder AI"
              className="h-8 w-auto object-contain"
            />
            <span className="font-display font-bold text-lg text-text-primary">
              Dream Builder AI
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
          <div className="w-full max-w-[440px] bg-surface border border-border/60 rounded-3xl shadow-2xl shadow-black/10 p-8 md:p-10 transition-shadow">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-[1.75rem] font-display font-bold text-text-primary mb-2 tracking-tight">
                Welcome back
              </h1>
              <p className="text-text-secondary text-sm">
                Access your investor terminal and insights.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {isError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                  {error?.message || "Invalid credentials. Please try again."}
                </div>
              )}
              <Input
                label="WORK EMAIL"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="PASSWORD"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md p-0.5"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors select-none">
                  <input
                    type="checkbox"
                    className="rounded border-border/50 bg-background/50 text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <div className="flex justify-end pt-1 pb-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary font-medium hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium group"
                disabled={isPending}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isPending ? "Signing in..." : "Sign in"}
                  {!isPending && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </span>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="bg-surface px-4 text-text-secondary">
                  Log in with
                </span>
              </div>
            </div>

            {/* Social Auth */}
            <div className="grid gap-4">
              <div className="flex items-center justify-center h-11">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Login Failed")}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? "filled_black"
                      : "outline"
                  }
                  shape="pill"
                />
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-text-secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:text-primary-hover hover:underline underline-offset-2 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center text-xs text-text-secondary flex flex-col items-center gap-4">
          <div className="flex gap-4 font-medium">
            <Link to="#" className="hover:text-text-primary transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-text-primary transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-text-primary transition-colors">
              Security
            </Link>
            <Link to="#" className="hover:text-text-primary transition-colors">
              Status
            </Link>
          </div>
          <p className="uppercase tracking-widest text-[10px]">
            © 2024 DREAM BUILDER AI. EXECUTIVE GRADE INTELLIGENCE.
          </p>
        </div>
      </div>
    </div>
  );
}
