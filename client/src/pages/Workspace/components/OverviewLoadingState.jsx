import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const OverviewLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-display font-bold text-text-primary mb-2">Building Your Startup Profile</h3>
      <p className="text-text-secondary max-w-md mx-auto mb-8">Dream Builder is structuring your idea...</p>
      
      <div className="w-full max-w-sm space-y-3 text-left">
        <LoadingStep text="Understanding your idea" status="done" />
        <LoadingStep text="Structuring the problem" status="loading" />
        <LoadingStep text="Defining the solution" status="pending" />
        <LoadingStep text="Building startup profile" status="pending" />
      </div>
    </div>
  );
};

const LoadingStep = ({ text, status }) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      {status === 'done' && (
        <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-3 h-3 text-success" />
        </span>
      )}
      {status === 'loading' && (
        <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </span>
      )}
      {status === 'pending' && (
        <span className="w-4 h-4 rounded-full bg-border shrink-0" />
      )}
      <span className={status === 'done' ? 'text-text-primary font-medium' : status === 'loading' ? 'text-primary font-medium' : 'text-text-secondary'}>
        {text}
      </span>
    </div>
  );
};

export default OverviewLoadingState;
