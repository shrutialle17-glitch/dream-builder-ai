import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
//import { useAuth } from '../../context/AuthContext';

import HeroSection from './components/HeroSection';
import JourneySection from './components/JourneySection';
import InteractiveDashboard from './components/InteractiveDashboard';
import ComparisonSection from './components/ComparisonSection';
import RoadmapSection from './components/RoadmapSection';

export default function Landing() {
  //const { isAuthenticated } = useAuth();
  const isAuthenticated = false;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assests/images/logo.png" alt="Dream Builder AI" className="h-10 w-auto object-contain" />
            <span className="font-display font-bold text-xl text-text-primary tracking-tight">Dream Builder AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="secondary" className="hidden sm:flex font-medium border-border hover:bg-surface">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary hidden sm:block">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="font-semibold shadow-md shadow-primary/20">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <HeroSection />
      <JourneySection />
      <InteractiveDashboard />
      <ComparisonSection />
      <RoadmapSection />

      {/* Contact & CTA Section */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-8">Ready to Build Your Startup?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="w-full sm:w-auto px-8 h-14 font-semibold shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 h-14 font-semibold bg-surface hover:bg-surface-bright border-border">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assests/images/logo.png" alt="Dream Builder AI" className="h-10 w-auto object-contain" />
              <span className="font-display font-bold text-xl text-text-primary tracking-tight">Dream Builder AI</span>
            </div>
            <p className="text-text-secondary text-sm">The world's first AI Startup Operating System.</p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Dream Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
