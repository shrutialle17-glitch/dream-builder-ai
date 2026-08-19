import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjectQueries';
import { useBusinessPlan, useGenerateBusinessPlan } from '../../hooks/useBusinessPlan';
import { RefreshCw, FileText, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import BusinessPlanContent from './components/BusinessPlanContent';
import ModuleChat from '../../components/ui/ModuleChat';
import { askBusinessPlanQuestion } from '../../services/project.api';
const BusinessPlanPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { data: project } = useProject(projectId);
  
  const { data: plan, isLoading, error } = useBusinessPlan(projectId);
  const { mutate: generatePlan, isPending: isGenerating } = useGenerateBusinessPlan(projectId);

  const handleGenerate = () => {
    generatePlan(undefined, {
      onSuccess: () => toast.success('Business Plan generated successfully!'),
      onError: (err) => toast.error(err.message || 'Failed to generate Business Plan')
    });
  };

  if (isLoading && !plan) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading Business Plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="bg-danger/10 text-danger p-6 rounded-xl border border-danger/20 max-w-md text-center flex flex-col items-center">
          <h3 className="font-bold mb-2">Failed to load Business Plan</h3>
          <p className="text-sm opacity-80 mb-4">We couldn't generate your analysis. Your startup data is safe — try again.</p>
          <button 
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-surface border border-border text-text-primary font-medium rounded-lg hover:border-text-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not generated yet
  if (!plan) {
    if (isGenerating) {
      return (
        <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Drafting Business Plan</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Synthesizing your ideas into a comprehensive business strategy...
            </p>
            
            <div className="w-full max-w-sm space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </span>
                Reading startup context
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                </span>
                Structuring business model
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Planning go-to-market strategy
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Drafting final document
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <FileText className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">Business Plan</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Generate a comprehensive business plan based on your Startup Overview and Idea Validation. 
            This will cover your executive summary, business model, go-to-market strategy, and more.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <FileText size={20} />
            <span>Generate Business Plan</span>
          </button>
        </div>
      </div>
    );
  }

  // Generated Plan
  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
            <LayoutDashboard size={14} />
            Business Plan
          </h1>
          <p className="text-text-primary font-medium text-2xl font-display">{project?.name || 'Startup'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary hidden sm:inline-block">
            Last updated: {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:border-primary/50 flex items-center gap-2 transition-colors text-text-primary"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isGenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      <BusinessPlanContent plan={plan} />
      <ModuleChat 
        moduleType="BUSINESS_PLAN"
        title="Business Plan Assistant"
        description="Have a question about your business model or strategy?"
        placeholder="Ask the Business Plan Assistant..."
        suggestedQuestions={[
          "How can I improve my revenue model?",
          "What is my go-to-market strategy missing?",
          "How do I explain my cost structure?",
        ]}
        onAskQuestion={askBusinessPlanQuestion}
      />
    </div>
  );
};

export default BusinessPlanPage;
