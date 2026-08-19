import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjectQueries';
import { usePitchDeck, useGeneratePitchDeck } from '../../hooks/usePitchDeck';
import { RefreshCw, Presentation, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import PitchDeckContent from './components/PitchDeckContent';
import ModuleChat from '../../components/ui/ModuleChat';
import { askPitchDeckQuestion } from '../../services/project.api';
const PitchDeckPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { data: project } = useProject(projectId);
  
  const { data: pitchDeck, isLoading, error } = usePitchDeck(projectId);
  const { mutate: generatePitchDeck, isPending: isGenerating } = useGeneratePitchDeck(projectId);

  const handleGenerate = () => {
    generatePitchDeck(undefined, {
      onSuccess: () => toast.success('Pitch Deck generated successfully!'),
      onError: (err) => toast.error(err.message || 'Failed to generate Pitch Deck')
    });
  };

  if (isLoading && !pitchDeck) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading Investor Workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="bg-danger/10 text-danger p-6 rounded-xl border border-danger/20 max-w-md text-center">
          <h3 className="font-bold mb-2">Failed to load Pitch Deck</h3>
          <p className="text-sm opacity-80">We couldn't generate your analysis. Your startup data is safe — try again.</p>
        </div>
      </div>
    );
  }

  // Not generated yet
  if (!pitchDeck) {
    if (isGenerating) {
      return (
        <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Presentation className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Generating Pitch Deck</h3>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
              Compiling your startup strategy into an investor-ready presentation...
            </p>
            
            <div className="w-full max-w-sm space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </span>
                Aggregating startup data
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                </span>
                Structuring slide narrative
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Drafting content
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                Refining pitch
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
            <Presentation className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">Investor Workspace</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Generate an investor-ready Pitch Deck based on your Startup DNA, Idea Validation, and Business Plan.
          </p>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Presentation size={20} />
            <span>Generate Pitch Deck</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Investor Workspace</h1>
          <p className="text-text-secondary">{pitchDeck?.title || 'Your Startup Pitch Deck'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors disabled:opacity-50"
            title="Regenerate Pitch Deck"
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 2xl:col-span-9">
          <PitchDeckContent pitchDeck={pitchDeck} />
        </div>
        
        <div className="xl:col-span-4 2xl:col-span-3">
          <ModuleChat 
            moduleType="PITCH_DECK"
            title="Pitch Assistant"
            description="Have a question about your investor pitch?"
            placeholder="Ask the Pitch Assistant..."
            suggestedQuestions={[
              "How can I make my hook stronger?",
              "What is my unfair advantage?",
              "How do I explain my traction?",
            ]}
            onAskQuestion={askPitchDeckQuestion}
          />        </div>
      </div>
    </div>
  );
};

export default PitchDeckPage;
