import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjectQueries';
import { useBranding, useGenerateBranding } from '../../hooks/useBranding';
import { RefreshCw, Paintbrush, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import BrandingContent from './components/BrandingContent';
import ModuleChat from '../../components/ui/ModuleChat';
import { askBrandingQuestion } from '../../services/project.api';
const BrandingPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { data: project } = useProject(projectId);
  
  const { data: branding, isLoading, error } = useBranding(projectId);
  const { mutate: generateBranding, isPending: isGenerating } = useGenerateBranding(projectId);

  const handleGenerate = () => {
    generateBranding(undefined, {
      onSuccess: () => toast.success('Brand Identity generated successfully!'),
      onError: (err) => toast.error(err.message || 'Failed to generate Brand Identity')
    });
  };

  if (isLoading && !branding) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading Brand Studio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="bg-danger/10 text-danger p-6 rounded-xl border border-danger/20 max-w-md text-center">
          <h3 className="font-bold mb-2">Failed to load Brand Identity</h3>
          <p className="text-sm opacity-80">We couldn't generate your analysis. Your startup data is safe — try again.</p>
        </div>
      </div>
    );
  }

  // Not generated yet
  if (!branding) {
    if (isGenerating) {
      return (
        <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Paintbrush className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Designing Brand Identity</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Translating your startup's DNA into a cohesive visual language...
            </p>
            
            <div className="w-full max-w-sm space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </span>
                Reading startup profile
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                </span>
                Establishing voice & tone
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Selecting typography
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Generating color palettes
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
            <Paintbrush className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">Brand Studio</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Translate your startup's DNA into a cohesive Brand Identity.
            This module generates your positioning, voice, typography, color palette, and visual direction.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Paintbrush size={20} />
            <span>Generate Brand Identity</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Brand Studio</h1>
          <p className="text-text-secondary">Your startup's positioning, identity, and visual language.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors disabled:opacity-50"
            title="Regenerate Brand Identity"
          >
            <RefreshCw className={isGenerating ? "animate-spin" : ""} size={16} />
            <span className="text-sm font-medium hidden sm:inline">Regenerate</span>
          </button>
          
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            <LayoutDashboard size={16} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <BrandingContent branding={branding} startupName={project?.name} />
        </div>
        
        <div className="lg:col-span-1 sticky top-6">
          <ModuleChat 
            moduleType="BRANDING"
            title="Brand Studio"
            description="Ask a question about your brand identity."
            placeholder="Ask the Brand Studio..."
            suggestedQuestions={[
              "What colors should I use?",
              "How can I make my brand more playful?",
            ]}
            onAskQuestion={askBrandingQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
