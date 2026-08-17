import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const ValidationLoadingState = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Reading startup context", icon: CheckCircle2 },
    { text: "Evaluating problem strength", icon: Activity },
    { text: "Assessing solution fit", icon: Activity },
    { text: "Analyzing feasibility", icon: Activity },
    { text: "Preparing recommendations", icon: Activity }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-20 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        <Activity size={24} className="text-primary" />
      </div>
      
      <h2 className="text-xl font-display font-bold text-text-primary mb-8 tracking-wide">
        ANALYZING YOUR STARTUP
      </h2>
      
      <div className="w-full max-w-sm text-left space-y-4">
        {steps.map((s, idx) => {
          const isActive = idx === step;
          const isPast = idx < step;
          
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-4 transition-all duration-500 ${
                isPast ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${isPast ? 'bg-success/20 text-success' : isActive ? 'bg-primary/20 text-primary animate-pulse' : 'bg-surface border border-border text-text-secondary'}
              `}>
                {isPast ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <span className={`text-sm ${isPast ? 'text-text-primary font-medium' : isActive ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ValidationEmptyState = ({ onGenerate, isOverviewCompleted }) => {
  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="bg-surface border border-border p-10 rounded-2xl flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Activity size={32} className="text-primary" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
          Idea Validation
        </h2>
        
        <p className="text-text-secondary max-w-lg mb-10 leading-relaxed">
          Understand the strengths, risks, and potential of your startup idea. 
          Dream Builder will analyze your concept across 10 critical dimensions 
          and provide actionable recommendations for your next steps.
        </p>

        {isOverviewCompleted ? (
          <button 
            onClick={onGenerate}
            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            Generate Validation
          </button>
        ) : (
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex items-start gap-3 text-left max-w-md">
            <ShieldAlert size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text-primary mb-1">Overview Required</p>
              <p className="text-sm text-text-secondary">
                You must generate your Startup Overview before analyzing your idea's validation.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="border border-border rounded-xl p-5 bg-surface">
          <div className="w-full h-32 bg-border/50 rounded-lg mb-4"></div>
          <div className="h-4 w-3/4 bg-border rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-border rounded"></div>
        </div>
        <div className="border border-border rounded-xl p-5 bg-surface">
          <div className="w-full h-32 bg-border/50 rounded-lg mb-4"></div>
          <div className="h-4 w-3/4 bg-border rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-border rounded"></div>
        </div>
        <div className="border border-border rounded-xl p-5 bg-surface">
          <div className="w-full h-32 bg-border/50 rounded-lg mb-4"></div>
          <div className="h-4 w-3/4 bg-border rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-border rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const ValidationErrorState = ({ onRetry, error }) => {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-danger/10 mx-auto flex items-center justify-center mb-6">
        <ShieldAlert size={32} className="text-danger" />
      </div>
      
      <h2 className="text-xl font-display font-bold text-text-primary mb-4">
        Analysis Failed
      </h2>
      
      <p className="text-text-secondary mb-8">
        We couldn't generate your analysis. Your startup data is safe — try again.
      </p>
      
      <button 
        onClick={onRetry}
        className="px-6 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-lg hover:border-text-secondary transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
