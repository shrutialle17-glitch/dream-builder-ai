import React, { useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useStartupOverview, useGenerateStartupOverview } from '../../hooks/useStartupOverview';
import AIOverviewSection from './sections/AIOverviewSection';
import StartupSnapshotSection from './sections/StartupSnapshotSection';
import KeyUseCaseSection from './sections/KeyUseCaseSection';
import ModuleGrid from './sections/ModuleGrid';
import OverviewLoadingState from './components/OverviewLoadingState';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStartupDNA } from '../../services/project.api';
import { useIdeaValidation } from '../../hooks/useIdeaValidation';
import { useBusinessPlan } from '../../hooks/useBusinessPlan';
import { useMVPPlanner } from '../../hooks/useMVPPlanner';
import { useBranding } from '../../hooks/useBranding';
import { usePitchDeck } from '../../hooks/usePitchDeck';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { useMarketResearch } from '../../hooks/useMarketResearch';

const StartupWorkspace = () => {
  const { project } = useOutletContext();
  
  const { 
    data: overview, 
    isLoading: isOverviewLoading, 
    error: overviewError,
    isFetched: isOverviewFetched
  } = useStartupOverview(project.id);
  
  const { 
    mutate: generateOverview, 
    isPending: isGenerating,
    error: generateError
  } = useGenerateStartupOverview(project.id);

  const { data: validation } = useIdeaValidation(project.id);
  const { data: dna } = useQuery({ queryKey: ['startup-dna', project.id], queryFn: () => getStartupDNA(project.id), enabled: !!project.id });
  const { data: businessPlan } = useBusinessPlan(project.id);
  const { data: mvpPlan } = useMVPPlanner(project.id);
  const { data: branding } = useBranding(project.id);
  const { data: pitchDeck } = usePitchDeck(project.id);
  const { data: digitalTwin } = useDigitalTwin(project.id);
  const { data: marketResearch } = useMarketResearch(project.id);

  const completedCount = [
    validation?.status === 'COMPLETED',
    dna?.status === 'COMPLETED',
    !!businessPlan,
    !!mvpPlan,
    !!branding,
    !!pitchDeck,
    !!digitalTwin,
    !!marketResearch
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedCount / 8) * 100);

  // Automatically generate if overview is missing on first fetch
  useEffect(() => {
    // If we've finished fetching the overview, have NO overview data, and aren't already generating/failed
    if (isOverviewFetched && !overview && !isGenerating && !generateError) {
      generateOverview();
    }
  }, [isOverviewFetched, overview, isGenerating, generateOverview, generateError]);

  const handleRegenerate = () => {
    generateOverview();
  };

  const showLoading = isOverviewLoading || (isGenerating && !overview);

  if (showLoading) {
    return <OverviewLoadingState />;
  }

  // If there's an error generating and no existing overview, show the retry state
  if (!overview && generateError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-500 w-8 h-8" />
        </div>
        <h3 className="text-xl font-sora font-bold text-text-primary mb-2">Generation Failed</h3>
        <p className="text-text-secondary mb-6 max-w-md">
          Your startup was created, but the AI overview couldn't be generated.
        </p>
        <button 
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Retrying...' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(8,145,178,0.5)]"></span>
            <h1 className="text-3xl font-bold text-text-primary font-sora">{project.name}</h1>
            {project.startupStage && (
              <span className="ml-2 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
                {project.startupStage}
              </span>
            )}
          </div>
          <p className="text-base text-text-secondary max-w-2xl pl-5.5">{project.description}</p>
        </div>
        
        {overview && (
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              AI Workspace Ready
            </div>
            <button 
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Regenerating...' : 'Regenerate Overview'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left / Main Column */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <StartupSnapshotSection project={project} overview={overview} />
          
          <AIOverviewSection overview={overview} />
        </div>

        {/* Right / Command Panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Progress Widget */}
          <div className="p-6 bg-surface border border-border rounded-xl">
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-xs font-bold text-text-primary font-sora uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                Startup Progress
              </h2>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                  {completedCount} / 8 Modules
                </span>
                <span className="text-lg font-bold text-text-primary leading-none">{progressPercent}%</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden flex">
              <div className="h-full bg-success transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Key Use Case Widget */}
          <KeyUseCaseSection overview={overview} />

          {/* AI Recommendation Widget */}
          {overview && (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl flex flex-col">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">
                AI Recommendation
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Your startup has a clearly defined target customer and problem. Validate the market before moving to detailed business planning.
              </p>
              <Link to={`/projects/${project.id}/validation`} className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 text-center shadow-lg shadow-primary/20">
                Start Idea Validation →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="my-10 border-t border-border"></div>

      <ModuleGrid 
        projectId={project.id} 
        validation={validation}
        dna={dna}
        businessPlan={businessPlan}
        mvpPlan={mvpPlan}
        branding={branding}
        pitchDeck={pitchDeck}
        digitalTwin={digitalTwin}
        marketResearch={marketResearch}
      />
      
    </div>
  );
};

export default StartupWorkspace;
