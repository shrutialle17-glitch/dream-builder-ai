import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIdeaValidation, useGenerateIdeaValidation, useRegenerateIdeaValidation } from '../../hooks/useIdeaValidation';
import { useStartupOverview } from '../../hooks/useStartupOverview';
import { useProject } from '../../hooks/useProjectQueries';
import { RefreshCw, Edit3, Info, Sparkles } from 'lucide-react';
import { getScoreLabel, getScoreColorClass } from '../../constants/validation';

import ValidationScoreChart from './components/ValidationScoreChart';
import ValidationRadarChart from './components/ValidationRadarChart';
import ValidationBreakdownChart from './components/ValidationBreakdownChart';
import ValidationMetricCard from './components/ValidationMetricCard';
import { ValidationStrengthCard, ValidationWeaknessCard, ValidationOpportunityCard, ValidationRiskCard, ValidationRecommendationCard } from './components/InsightCards';
import { ValidationLoadingState, ValidationEmptyState, ValidationErrorState } from './components/ValidationStates';
import ModuleChat from '../../components/ui/ModuleChat';
import { askValidationQuestion } from '../../services/project.api';
const IdeaValidationPage = () => {
  const { projectId } = useParams();
  
  // Data Fetching
  const { data: project } = useProject(projectId);
  const { data: overview, isLoading: isOverviewLoading } = useStartupOverview(projectId);
  const { data: validation, isLoading: isValidationLoading, refetch } = useIdeaValidation(projectId);
  
  // Mutations
  const generateMutation = useGenerateIdeaValidation(projectId);
  const regenerateMutation = useRegenerateIdeaValidation(projectId);

  // Status computation
  const isOverviewCompleted = !!overview;
  
  const status = validation?.status || 'NOT_STARTED';
  const isGenerating = status === 'GENERATING' || generateMutation.isPending || regenerateMutation.isPending;
  const isFailed = status === 'FAILED' || generateMutation.isError || regenerateMutation.isError;
  const isCompleted = status === 'COMPLETED' && !!validation?.validationScore;

  // Handlers
  const handleGenerate = () => generateMutation.mutate();
  const handleRegenerate = () => regenerateMutation.mutate();

  // Polling if status is generating (but since we block on mutation, this is just for safety if another tab initiated it)
  useEffect(() => {
    let interval;
    if (status === 'GENERATING') {
      interval = setInterval(() => {
        refetch();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, refetch]);


  // Rendering Logic
  if (isOverviewLoading || (isValidationLoading && !isGenerating)) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;
  }

  if (isGenerating) {
    return <ValidationLoadingState />;
  }

  if (isFailed) {
    return <ValidationErrorState onRetry={handleGenerate} error={generateMutation.error?.response?.data?.message || regenerateMutation.error?.response?.data?.message} />;
  }

  if (!isCompleted) {
    return <ValidationEmptyState onGenerate={handleGenerate} isOverviewCompleted={isOverviewCompleted} />;
  }

  const scoreLabel = getScoreLabel(validation.validationScore);
  const scoreColor = getScoreColorClass(validation.validationScore);

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-text-primary">
              {project?.name || 'Startup'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Idea Validation</span>
            <span>·</span>
            <span>AI-assisted assessment of your startup opportunity.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary hidden sm:inline-block">
            Last analyzed: {new Date(validation.updatedAt).toLocaleDateString()}
          </span>
          <button 
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:border-primary/50 flex items-center gap-2 transition-colors text-text-primary"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>
      </div>

      {/* 1. Validation Hero / Score */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 relative z-10 items-center">
          <div className="md:col-span-8 flex flex-col justify-center min-w-0">
            <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-2">
              Strategic Brief
            </h2>
            <h3 className="text-3xl font-display font-bold text-text-primary mb-4">
              Validation Assessment
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-2xl">
              {validation.summary || `${project?.name || 'This startup'} has a validation score of ${validation.validationScore}/100, placing it in the ${scoreLabel} tier. The foundational metrics indicate specific areas for strategic focus.`}
            </p>
            <div className="bg-background/50 border border-border/50 p-4 rounded-xl flex items-start gap-4">
              <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">
                Score is calculated deterministically based on provided parameters. Market evidence and competitor benchmarking should be cross-referenced for complete accuracy.
              </p>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-border/50 pt-8 md:pt-0 md:pl-8 min-w-0">
            <ValidationScoreChart score={validation.validationScore} />
            <div className="mt-4 flex justify-center gap-2 text-[9px] font-bold text-text-secondary uppercase tracking-widest">
              <span className="text-success">80+ Strong</span>
              <span>·</span>
              <span className="text-primary">60+ Promising</span>
              <span>·</span>
              <span className="text-warning">40+ Needs Work</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SWOT Analysis Grid */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-12">
        <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6">
          Strategic Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div>
            <h3 className="text-xs font-bold text-success uppercase tracking-widest flex items-center gap-2 mb-4">
              Strengths
            </h3>
            <div className="space-y-3">
              {validation.strengths?.map((item, idx) => (
                <ValidationStrengthCard key={idx} strength={item} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-warning uppercase tracking-widest flex items-center gap-2 mb-4">
              Weaknesses
            </h3>
            <div className="space-y-3">
              {validation.weaknesses?.map((item, idx) => (
                <ValidationWeaknessCard key={idx} weakness={item} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
              Opportunities
            </h3>
            <div className="space-y-3">
              {validation.opportunities?.map((item, idx) => (
                <ValidationOpportunityCard key={idx} opportunity={item} index={idx} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-danger uppercase tracking-widest flex items-center gap-2 mb-4">
              Risks
            </h3>
            <div className="space-y-3">
              {validation.risks?.map((item, idx) => (
                <ValidationRiskCard key={idx} risk={item} />
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* 4. Detailed Dimension Comparison */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-12 hidden md:block">
        <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6">
          Detailed Dimension Comparison
        </h2>
        <ValidationBreakdownChart data={validation} />
      </div>

      {/* 5. Detailed Assessment (Compact) */}
      <div className="mb-12">
        <h2 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-4 px-1">
          Detailed Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ValidationMetricCard compact title="Problem Strength" score={validation.problemStrengthScore} analysis={validation.problemStrengthAnalysis} />
          <ValidationMetricCard compact title="Market Need" score={validation.marketNeedScore} analysis={validation.marketNeedAnalysis} />
          <ValidationMetricCard compact title="Solution Fit" score={validation.solutionFitScore} analysis={validation.solutionFitAnalysis} />
          <ValidationMetricCard compact title="Target Customer" score={validation.targetCustomerClarityScore} analysis={validation.targetCustomerClarityAnalysis} />
          <ValidationMetricCard compact title="Differentiation" score={validation.differentiationScore} analysis={validation.differentiationAnalysis} />
          <ValidationMetricCard compact title="Competition" score={validation.competitionScore} analysis={validation.competitionAnalysis} />
          <ValidationMetricCard compact title="Feasibility" score={validation.feasibilityScore} analysis={validation.feasibilityAnalysis} />
          <ValidationMetricCard compact title="Scalability" score={validation.scalabilityScore} analysis={validation.scalabilityAnalysis} />
          <ValidationMetricCard compact title="Execution Complexity" score={validation.executionComplexityScore} analysis={validation.executionComplexityAnalysis} inverse />
          <ValidationMetricCard compact title="Risk Level" score={validation.riskScore} analysis={validation.riskAnalysis} inverse />
        </div>
      </div>



      {/* 6. Recommendations */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-text-secondary font-sora uppercase tracking-widest mb-6">
          Recommended Next Moves
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validation.recommendations?.map((item, idx) => (
            <ValidationRecommendationCard key={idx} recommendation={item} />
          ))}
        </div>
      </div>

      {/* 7. Ask Dream Builder Section */}
      <ModuleChat 
        moduleType="IDEA_VALIDATION"
        title="Validation Assistant"
        description="Have a question about your idea validation?"
        placeholder="Ask the Validation Assistant..."
        suggestedQuestions={[
          "Why is my score low?",
          "How can I improve differentiation?",
          "What is my biggest risk?",
          "What should I validate first?"
        ]}
        onAskQuestion={askValidationQuestion}
      />
    </div>
  );
};

export default IdeaValidationPage;
