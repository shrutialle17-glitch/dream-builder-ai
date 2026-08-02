import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const steps = [
  "Idea", "Validation", "Business Plan", "Startup DNA", "MVP", "Pitch Deck", "Launch"
];

export default function HeroSection() {
  //const { isAuthenticated } = useAuth();
  const isAuthenticated = false;

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Premium Dark Tech Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: 'url(/assests/images/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Fade out bottom to blend with next section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-50 z-0" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border text-sm font-medium mb-8 shadow-sm backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-text-secondary">Dream Builder OS 1.0 is live</span>
          <span className="text-border mx-1">|</span>
          <Link to="/register" className="text-primary hover:underline flex items-center gap-1">
            Request Access <ArrowRight size={14} />
          </Link>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-text-primary tracking-tight leading-[1.05] mb-8"
        >
          Don't Just Plan Your Startup. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/70">
            Build It.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Dream Builder AI is the world's first AI Startup Operating System that validates ideas, analyzes markets, generates business plans, builds MVP roadmaps, creates pitch decks, simulates business outcomes, and guides founders from idea to launch—all within one intelligent platform.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 h-14 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Get Started
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-14 font-semibold bg-surface hover:bg-surface-bright border border-border">
            <Play size={18} /> Watch Demo
          </Button>
        </motion.div>

        {/* Workflow Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="hidden md:flex items-center justify-center gap-2 max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${index === steps.length - 1 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface border border-border text-text-secondary'}`}>
                {step}
              </div>
              {index < steps.length - 1 && (
                <ChevronRight size={16} className="text-text-secondary/50" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
