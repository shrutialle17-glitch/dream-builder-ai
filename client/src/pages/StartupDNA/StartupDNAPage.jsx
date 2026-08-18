import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useStartupOverview } from '../../hooks/useStartupOverview';
import { useStartupDNA, useGenerateStartupDNA, useRegenerateStartupDNA } from '../../hooks/useStartupDNA';
import { askDNAQuestion } from '../../services/project.api';
import { DNALoadingState, DNAEmptyState, DNAErrorState } from './components/DNAStates';
import DNARadarChart from './components/DNARadarChart';
import DNATraitCard from './components/DNATraitCard';
import { DNAStrengthCard, DNAWeaknessCard, DNARiskCard, DNAOpportunityCard, DNARecommendationCard } from './components/DNACards';
import ModuleChat from '../../components/ui/ModuleChat';
import { RefreshCw } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const StartupDNAPage = () => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  // Use custom hooks
  const { data: overview } = useStartupOverview(projectId);
  const { data: dna, isLoading, isError, error } = useStartupDNA(projectId);
  
  const generateMutation = useGenerateStartupDNA(projectId);
  const regenerateMutation = useRegenerateStartupDNA(projectId);

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleRegenerateClick = () => {
    setIsRegenerateModalOpen(true);
  };

  const confirmRegenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        setIsRegenerateModalOpen(false);
      }
    });
  };


  const isGenerating = generateMutation.isPending || regenerateMutation.isPending;
  const isOverviewMissing = !overview;

  if (isGenerating) {
    return <DNALoadingState />;
  }

  if (isError) {
    if (error?.response?.data?.code === 'OVERVIEW_REQUIRED' || isOverviewMissing) {
      return (
        <DNAEmptyState 
          onGenerate={() => navigate(`/projects/${projectId}/overview`)} 
          isOverviewMissing={true} 
        />
      );
    }
    if (error?.response?.status === 404) {
      return <DNAEmptyState onGenerate={handleGenerate} isOverviewMissing={false} />;
    }
    return <DNAErrorState onRetry={() => queryClient.invalidateQueries(['startup-dna', projectId])} />;
  }

  if (!dna || dna.status !== 'COMPLETED') {
    return <DNAEmptyState onGenerate={handleGenerate} isOverviewMissing={false} />;
  }

  // Safely handle dimensions if they are an object or array
  let sortedDimensions = [];
  if (Array.isArray(dna.dimensions)) {
    sortedDimensions = [...dna.dimensions].sort((a, b) => b.score - a.score);
  } else if (dna.dimensions && typeof dna.dimensions === 'object') {
    sortedDimensions = Object.entries(dna.dimensions)
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score);
  }

  const strongestDim = sortedDimensions.length > 0 ? sortedDimensions[0] : null;
  const weakestDim = sortedDimensions.length > 0 ? sortedDimensions[sortedDimensions.length - 1] : null;
  const watchDim = sortedDimensions.length > 2 ? sortedDimensions[Math.floor(sortedDimensions.length / 2)] : null;

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">Startup DNA</h1>
          <p className="text-text-primary font-medium">Strategic profile of your startup</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-secondary hidden sm:inline-block">
            Last generated: {new Date(dna.updatedAt).toLocaleDateString()}
          </span>
          <button
            onClick={handleRegenerateClick}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md text-xs font-bold text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate DNA
          </button>
        </div>
      </div>

      {/* 1. DIAGNOSTIC SCORECARD HUB */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
        {/* Left: Identity */}
        <div className="xl:col-span-5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Diagnostic Complete</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight mb-6">
            {dna.profileName}
          </h2>
          <p className="text-base text-text-secondary leading-relaxed border-l-4 border-l-border pl-4">
            {dna.profileDescription}
          </p>
        </div>
        
        {/* Right: Radar Scorecard */}
        <div className="xl:col-span-7 bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
           <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="w-full md:w-1/2 h-64 md:h-[300px]">
               <DNARadarChart dimensions={dna.dimensions} />
             </div>
             <div className="w-full md:w-1/2 flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center py-2 border-b border-border mb-2">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Dimension</span>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Score</span>
                </div>
                {sortedDimensions.map((dim, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm font-medium text-text-primary">{dim.name}</span>
                    <span className="text-sm font-bold font-display text-primary">{dim.score}/100</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* 2. STRATEGIC INDICATORS */}
      <div className="bg-background border border-border rounded-xl p-6 mb-16 shadow-sm">
        <h2 className="text-[10px] font-bold text-text-secondary font-sora uppercase tracking-widest mb-4">
          Strategic Trait Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-2">
          {dna.traits?.map((trait, idx) => (
            <DNATraitCard key={idx} trait={trait} />
          ))}
        </div>
      </div>

      {/* 4. WHAT THE SCORE TELLS US */}
      {(strongestDim || weakestDim) && (
        <div className="mb-16">
          <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6 border-b border-border pb-2">
            What The Score Tells Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strongestDim && (
              <div>
                <h3 className="text-[10px] font-bold text-success uppercase tracking-widest mb-2">Strongest</h3>
                <div className="text-base font-medium text-text-primary mb-1">{strongestDim.name}</div>
                <div className="text-2xl font-bold font-display text-text-primary mb-2">{strongestDim.score}</div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This is the core strategic advantage of your startup model. Capitalize on it heavily in early stages.
                </p>
              </div>
            )}
            {watchDim && (
              <div>
                <h3 className="text-[10px] font-bold text-warning uppercase tracking-widest mb-2">Watch</h3>
                <div className="text-base font-medium text-text-primary mb-1">{watchDim.name}</div>
                <div className="text-2xl font-bold font-display text-text-primary mb-2">{watchDim.score}</div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  A balanced dimension that requires monitoring. Ensure it does not degrade as the product scales.
                </p>
              </div>
            )}
            {weakestDim && (
              <div>
                <h3 className="text-[10px] font-bold text-danger uppercase tracking-widest mb-2">Weakest</h3>
                <div className="text-base font-medium text-text-primary mb-1">{weakestDim.name}</div>
                <div className="text-2xl font-bold font-display text-text-primary mb-2">{weakestDim.score}</div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The primary strategic constraint. This area introduces the highest structural risk and requires immediate mitigation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SWOT GRID */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-16">
        <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6">
          Strategic Landscape
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div>
            <h3 className="text-xs font-bold text-success uppercase tracking-widest flex items-center gap-2 mb-4">Core Strengths</h3>
            <div className="space-y-3">
              {dna.strengths?.map((item, idx) => (
                <DNAStrengthCard key={idx} item={item} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-warning uppercase tracking-widest flex items-center gap-2 mb-4">Structural Weaknesses</h3>
            <div className="space-y-3">
              {dna.weaknesses?.map((item, idx) => (
                <DNAWeaknessCard key={idx} item={item} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">Market Opportunities</h3>
            <div className="space-y-3">
              {dna.opportunities?.map((item, idx) => (
                <DNAOpportunityCard key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-danger uppercase tracking-widest flex items-center gap-2 mb-4">Strategic Risks</h3>
            <div className="space-y-3">
              {dna.risks?.map((item, idx) => (
                <DNARiskCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. STRATEGIC RECOMMENDATIONS */}
      <div className="mb-16">
        <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6 border-b border-border pb-2">
          Recommended Next Moves
        </h2>
        <div className="flex flex-col">
          {dna.recommendations?.map((item, idx) => (
            <DNARecommendationCard key={idx} item={item} index={idx + 1} />
          ))}
        </div>
      </div>
      
      {/* 7. ASK DREAM BUILDER (Compact) */}
      <ModuleChat 
        moduleType="STARTUP_DNA"
        title="DNA Analyst"
        description="Have a question about your startup's strategic profile?"
        placeholder="Ask the DNA Analyst..."
        suggestedQuestions={[
          "What is my weakest dimension?",
          "How can I capitalize on my strengths?",
          "What strategic risks should I prioritize?",
        ]}
        onAskQuestion={askDNAQuestion}
      />
      
      <ConfirmDialog
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        onConfirm={confirmRegenerate}
        title="Regenerate DNA"
        message="Regenerating will replace the current Startup DNA analysis. Are you sure you want to proceed?"
        confirmText="Regenerate"
        isDestructive={false}
        isPending={regenerateMutation.isPending}
      />
    </div>
  );
};

export default StartupDNAPage;
