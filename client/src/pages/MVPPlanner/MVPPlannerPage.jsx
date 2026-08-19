import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjectQueries';
import { useMVPPlanner, useGenerateMVPPlan } from '../../hooks/useMVPPlanner';
import { RefreshCw, LayoutTemplate, Layers } from 'lucide-react';
import { toast } from 'sonner';
import MVPPlannerContent from './components/MVPPlannerContent';
import ModuleChat from '../../components/ui/ModuleChat';
import { askMVPQuestion } from '../../services/project.api';
const MVPPlannerPage = () => {
  const { projectId } = useParams();
  
  const { data: project } = useProject(projectId);
  
  const { data: mvp, isLoading, error } = useMVPPlanner(projectId);
  const { mutate: generateMVP, isPending: isGenerating } = useGenerateMVPPlan(projectId);

  const handleGenerate = () => {
    generateMVP(undefined, {
      onSuccess: () => toast.success('MVP Plan generated successfully!'),
      onError: (err) => toast.error(err.message || 'Failed to generate MVP Plan')
    });
  };

  if (isLoading && !mvp) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Drafting MVP Architecture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="bg-danger/10 text-danger p-6 rounded-xl border border-danger/20 max-w-md text-center">
          <h3 className="font-bold mb-2">Failed to load MVP Plan</h3>
          <p className="text-sm opacity-80">We couldn't generate your analysis. Your startup data is safe — try again.</p>
        </div>
      </div>
    );
  }

  // Not generated yet
  if (!mvp) {
    if (isGenerating) {
      return (
        <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
              <LayoutTemplate className="w-8 h-8 text-secondary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Drafting MVP Architecture</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Mapping out the core features and development phases for your MVP...
            </p>
            
            <div className="w-full max-w-sm space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                </span>
                Analyzing core value proposition
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '200ms' }} />
                </span>
                Prioritizing features
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Structuring development phases
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Estimating timelines
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 border border-secondary/20">
            <LayoutTemplate className="text-secondary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">MVP Planner</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Translate your startup strategy into an actionable Minimum Viable Product architecture. 
            Identify core features, technical requirements, and development phases.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-secondary text-background font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <LayoutTemplate size={20} />
            <span>Generate MVP Plan</span>
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
            <LayoutTemplate size={14} />
            MVP Architecture
          </h1>
          <p className="text-text-primary font-medium text-2xl font-display">{project?.name || 'Startup'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary hidden sm:inline-block">
            Last updated: {new Date(mvp.updatedAt).toLocaleDateString()}
          </span>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:border-secondary/50 flex items-center gap-2 transition-colors text-text-primary"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isGenerating ? 'Regenerating...' : 'Regenerate MVP'}</span>
          </button>
        </div>
      </div>

      <MVPPlannerContent mvp={mvp} />
      <ModuleChat 
        moduleType="MVP_PLANNER"
        title="Product Copilot"
        description="Have a question about your MVP features or roadmap?"
        placeholder="Ask the Product Copilot..."
        suggestedQuestions={[
          "How can I cut development time?",
          "Which feature should I drop from the MVP?",
          "What are the biggest technical risks?",
          "How do I measure success for Phase 1?"
        ]}
        onAskQuestion={askMVPQuestion}
      />
    </div>
  );
};

export default MVPPlannerPage;
