import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, BarChart2, Users, AlertTriangle, Target, RefreshCw } from 'lucide-react';
import { useMarketResearch, useGenerateMarketResearch, useRegenerateMarketResearch } from '../../hooks/useMarketResearch';
import ModuleChat from '../../components/ui/ModuleChat';
import { askMarketQuestion } from '../../services/project.api';
import MarketResearchContent from './components/MarketResearchContent';

const MarketResearchPage = () => {
  const { projectId } = useParams();
  const { data: research, isLoading } = useMarketResearch(projectId);
  const { mutate: generate, isPending: isGenerating } = useGenerateMarketResearch(projectId);
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateMarketResearch(projectId);

  const pending = isGenerating || isRegenerating;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-text-secondary">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p>Loading Market Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8 animate-fade-in relative max-w-[1600px] mx-auto p-4 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">AI Market Research</h1>
          <p className="text-sm lg:text-base text-text-secondary mt-1 max-w-2xl">
            Understand the market surrounding your startup.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!research && !pending && (
            <button
              onClick={() => generate()}
              className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles size={16} />
              Generate Research
            </button>
          )}
          {research && !pending && (
            <button
              onClick={() => regenerate()}
              className="px-4 py-2 bg-surface border border-border text-text-secondary text-sm font-medium rounded-xl hover:text-text-primary transition-all flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area: 12-column Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 min-h-0">
        
        {/* Left Column: Intelligence Report */}
        <div className="xl:col-span-8 flex flex-col min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {pending ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-border bg-surface rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <BarChart2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Building Market Intelligence</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                Analyzing your startup profile, mapping the landscape, and identifying strategic opportunities...
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
                  Reviewing strategy
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                  Mapping landscape
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                  Identifying opportunities
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                  Preparing recommendations
                </div>
              </div>
            </div>
          ) : !research ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-border bg-surface rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-text-secondary/50" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Market Intelligence Found</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                Your market intelligence report has not been generated. Generate it to explore trends, competitors, and strategic positioning.
              </p>
              <button
                onClick={() => generate()}
                className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Sparkles size={16} />
                Generate Market Research
              </button>
            </div>
          ) : (
            <MarketResearchContent research={research} />
          )}
        </div>

        {/* Right Column: Market Analyst */}
        <div className="xl:col-span-4 flex flex-col min-h-0">
          <ModuleChat 
            moduleType="MARKET_RESEARCH"
            title="Market Analyst"
            description="Have a question about your market data?"
            placeholder="Ask the Market Analyst..."
            suggestedQuestions={[
              "What is my TAM vs SAM?",
              "Who is my primary competitor?",
              "What is my main competitive advantage?",
            ]}
            onAskQuestion={askMarketQuestion}
          />
        </div>

      </div>
    </div>
  );
};

export default MarketResearchPage;
