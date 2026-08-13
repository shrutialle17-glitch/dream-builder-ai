import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

const AskDreamBuilder = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        className="group flex items-center justify-center gap-2 bg-surface border border-border shadow-lg rounded-full px-5 py-3 text-text-primary hover:border-primary transition-all duration-300 relative overflow-hidden"
        title="Project AI Assistant (Coming Soon)"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Sparkles size={18} className="text-primary group-hover:animate-pulse" />
        <span className="font-medium text-sm">Project AI</span>
      </button>
    </div>
  );
};

export default AskDreamBuilder;
