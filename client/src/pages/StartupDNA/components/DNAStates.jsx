import React from 'react';
import { Network, Sparkles, RefreshCcw } from 'lucide-react';

export const DNALoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32 max-w-lg mx-auto text-center animate-in fade-in duration-500">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 relative">
      <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-ping" />
      <Network className="w-8 h-8 text-primary relative z-10 animate-pulse" />
    </div>
    <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
      Analyzing Startup DNA
    </h2>
    <p className="text-text-secondary text-sm mb-12">
      Deconstructing your strategic profile across 10 core dimensions...
    </p>
    
    <div className="w-full space-y-4 text-left">
      <div className="flex items-center gap-4 text-sm text-text-primary">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="flex-1">Reading startup profile</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-text-primary opacity-80">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
        <span className="flex-1">Evaluating strategic dimensions</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-text-primary opacity-60">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
        <span className="flex-1">Building DNA profile</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-text-primary opacity-40">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
        <span className="flex-1">Generating recommendations</span>
      </div>
    </div>
  </div>
);

export const DNAEmptyState = ({ onGenerate, isOverviewMissing }) => (
  <div className="flex flex-col items-center justify-center py-32 max-w-lg mx-auto text-center animate-in fade-in duration-500">
    <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mb-8 shadow-sm">
      <Network className="w-10 h-10 text-primary opacity-80" />
    </div>
    <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
      {isOverviewMissing ? 'Startup Overview Required' : 'Startup DNA'}
    </h2>
    <p className="text-text-secondary text-base leading-relaxed mb-8">
      {isOverviewMissing 
        ? "Before we can analyze your Startup DNA, you need to complete the Startup Overview module. This gives Dream Builder AI the foundation it needs to assess your strategic position."
        : "Your startup has a unique strategic fingerprint. Let Dream Builder AI analyze your core dimensions to uncover your true startup profile, strengths, and risks."}
    </p>
    
    <button
      onClick={onGenerate}
      className="px-6 py-3 bg-primary text-background font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center gap-2"
    >
      <Sparkles className="w-5 h-5" />
      {isOverviewMissing ? 'Go to Startup Overview' : 'Generate Startup DNA'}
    </button>
  </div>
);

export const DNAErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
    <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6">
      <Network className="w-8 h-8 text-danger" />
    </div>
    <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
      Analysis Failed
    </h2>
    <p className="text-text-secondary mb-8 max-w-md">
      We couldn't generate your Startup DNA right now. This is usually a temporary issue.
    </p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-lg text-text-primary hover:text-primary hover:border-primary/50 transition-colors"
    >
      <RefreshCcw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);
