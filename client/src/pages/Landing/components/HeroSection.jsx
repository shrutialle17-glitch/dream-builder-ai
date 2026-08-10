import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';

const STAGES = [
  { id: 'idea', label: '01 IDEA', image: '/assets/images/hero/idea.png' },
  { id: 'market', label: '02 VALIDATION', image: '/assets/images/hero/market.png' },
  { id: 'dna', label: '03 DNA SCORE', image: '/assets/images/hero/dna.png' },
  { id: 'plan', label: '04 BUSINESS PLAN', image: '/assets/images/hero/plan.png' },
  { id: 'mvp', label: '05 MVP', image: '/assets/images/hero/mvp.png' },
  { id: 'launch', label: '06 LAUNCH', image: '/assets/images/hero/launch.png' },
];

export default function HeroSection({ isAuthenticated }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-background overflow-hidden pt-20">
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0 bg-background">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeIndex}
            src={STAGES[activeIndex].image}
            alt={STAGES[activeIndex].label}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
            style={{ opacity: 'var(--hero-opacity)' }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      
      {/* Main Content */}
      <div className="relative z-20 max-w-[1650px] mx-auto px-6 w-full flex-1 flex flex-col justify-center items-center text-center pb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-display font-bold text-text-primary mb-6 leading-tight tracking-tight"
        >
          Don't Just Plan Your Startup.<br />
          <span className="text-primary">Build It.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-10 font-light"
        >
          The operating system for building startups. Executive-grade intelligence that transforms ideas into market leaders.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button size="lg" className="w-full sm:w-auto px-10 h-14 font-medium text-lg text-white shadow-[0_0_15px_rgba(0,184,217,0.3)] hover:shadow-[0_0_25px_rgba(0,184,217,0.5)] transition-all">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto px-10 h-14 font-medium text-lg bg-surface/50 backdrop-blur-md border-border hover:bg-surface text-text-primary transition-all">
            View Demo
          </Button>
        </motion.div>
      </div>

      {/* Pipeline Indicator */}
      <div className="absolute bottom-0 left-0 w-full z-30 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-[1650px] mx-auto px-6 h-16 flex items-center justify-center overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-8 md:space-x-12 min-w-max">
            {STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`relative flex items-center h-16 text-sm font-semibold tracking-wider transition-colors ${
                  activeIndex === idx ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {stage.label}
                {activeIndex === idx && (
                  <motion.div
                    layoutId="activeStage"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_-2px_10px_rgba(0,184,217,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
