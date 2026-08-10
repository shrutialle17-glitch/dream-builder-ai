import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import CoreModulesSection from './components/CoreModulesSection';
import AITeamSection from './components/AITeamSection';
import ProductPreviewSection from './components/ProductPreviewSection';
import FounderJourneySection from './components/FounderJourneySection';
import MetricsSection from './components/MetricsSection';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 font-sans">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1650px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo.png" alt="Dream Builder AI" className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" style={{ filter: 'var(--logo-filter)' }} />
            <span className="font-display font-bold text-lg text-text-primary tracking-tight">Dream Builder AI</span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="secondary" className="hidden sm:flex font-medium border-border/40 hover:bg-surface/50 text-text-primary bg-transparent h-9 px-4 rounded-lg">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="font-medium bg-primary text-white hover:bg-primary/90 shadow-[0_0_10px_rgba(0,184,217,0.2)] hover:shadow-[0_0_15px_rgba(0,184,217,0.4)] transition-all h-9 px-5 rounded-lg border-none">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <HeroSection isAuthenticated={isAuthenticated} />
      <FounderJourneySection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <CoreModulesSection />
      <AITeamSection />
      <MetricsSection />

      {/* Final Minimal CTA Section */}
      <section className="py-32 px-6 bg-background relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-8 tracking-tight">Your Idea Is Waiting.<br/>Let's Build It.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="w-full sm:w-auto px-10 h-12 font-semibold shadow-[0_0_15px_rgba(0,184,217,0.3)] border-none text-white">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="border-t border-border bg-background py-16 px-6">
        <div className="max-w-[1650px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/images/logo.png" alt="Dream Builder AI" className="h-8 w-auto object-contain opacity-70" style={{ filter: 'var(--logo-filter)' }} />
              <span className="font-display font-bold text-lg text-text-primary tracking-tight opacity-90">Dream Builder AI</span>
            </div>
            <p className="text-text-secondary text-sm">An operating system for building startups.</p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1650px] mx-auto border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">© {new Date().getFullYear()} Dream Builder AI. Executive Grade Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
