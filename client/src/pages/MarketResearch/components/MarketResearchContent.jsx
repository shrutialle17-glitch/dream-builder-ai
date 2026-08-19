import React from 'react';
import { Target, Users, TrendingUp, ShieldAlert, Crosshair, HelpCircle, CheckCircle2, ChevronRight, BarChart, Flag, AlertTriangle } from 'lucide-react';

const MarketResearchContent = ({ research }) => {
  if (!research) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. MARKET SNAPSHOT */}
      <section className="bg-background border border-border rounded-lg p-1">
        <div className="bg-surface/50 rounded flex flex-col md:flex-row gap-px overflow-hidden">
          
          <div className="flex-1 bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-mono text-primary uppercase tracking-widest flex items-center gap-2"><BarChart size={12}/> Market Overview</h2>
              <span className="text-[9px] font-mono text-text-secondary uppercase border border-border px-1.5 py-0.5 bg-surface rounded">INT-REPORT-1A</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-medium text-text-primary mb-1">
              {research.marketOverview?.industry || 'Industry Analysis'}
            </h3>
            <p className="text-xs font-mono text-text-secondary uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {research.marketOverview?.category || 'General'}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg border-l border-primary/30 pl-4 py-1">
              {research.marketOverview?.summary || 'No summary available.'}
            </p>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-px bg-border">
            <div className="bg-background p-5 flex-1">
              <h4 className="text-[10px] font-mono text-emerald-400 mb-3 uppercase tracking-wide flex items-center gap-1.5"><TrendingUp size={12}/> Key Drivers</h4>
              <ul className="space-y-2">
                {research.marketOverview?.drivers?.map((driver, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                    <span className="text-emerald-400/50 shrink-0 mt-0.5">›</span>
                    <span className="leading-snug">{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-5 flex-1">
              <h4 className="text-[10px] font-mono text-danger mb-3 uppercase tracking-wide flex items-center gap-1.5"><ShieldAlert size={12}/> Challenges</h4>
              <ul className="space-y-2">
                {research.marketOverview?.challenges?.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                    <span className="text-danger/50 shrink-0 mt-0.5">›</span>
                    <span className="leading-snug">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. CUSTOMER SEGMENTS */}
      <section>
        <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-2">
          <Users size={16} className="text-secondary" />
          <h2 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Demographic Targets</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 bg-border rounded border border-border overflow-hidden">
          {research.customerSegments?.map((segment, i) => (
            <div key={i} className="bg-background p-5 hover:bg-surface transition-colors flex flex-col h-full group">
              <div className="flex items-start justify-between mb-4 border-b border-border/50 pb-3 gap-2">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide leading-tight">{segment.name}</h3>
                <span className="shrink-0 mt-0.5 text-[9px] font-mono text-secondary border border-secondary/20 bg-secondary/5 px-1.5 py-0.5 rounded">SEG-0{i+1}</span>
              </div>
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-[10px] font-mono text-text-secondary mb-2 uppercase flex items-center gap-1.5"><CheckCircle2 size={10} className="text-primary"/> Needs Profile</p>
                  <ul className="space-y-1.5">
                    {segment.needs?.map((need, j) => (
                      <li key={j} className="text-xs text-text-primary leading-snug flex items-start gap-1.5"><span className="text-primary/50 mt-0.5">·</span>{need}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-text-secondary mb-2 uppercase flex items-center gap-1.5"><AlertTriangle size={10} className="text-warning"/> Friction Points</p>
                  <ul className="space-y-1.5">
                    {segment.painPoints?.map((pain, j) => (
                      <li key={j} className="text-xs text-text-secondary leading-snug flex items-start gap-1.5"><span className="text-warning/50 mt-0.5">·</span>{pain}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-border/50">
                <p className="text-[9px] font-mono text-text-secondary mb-1.5 uppercase">Core Motivation</p>
                <p className="text-xs text-text-primary italic leading-relaxed">"{segment.buyingMotivation}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INDUSTRY TRENDS */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
          Industry Trends
        </h2>
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">
          {research.trends?.map((trend, i) => {
            let statusColor = 'text-primary bg-primary/10 border-primary/20';
            if (trend.status === 'emerging') statusColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            if (trend.status === 'declining') statusColor = 'text-danger bg-danger/10 border-danger/20';
            if (trend.status === 'established') statusColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

            return (
              <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">{trend.name}</h3>
                  <p className="text-sm text-text-secondary">{trend.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize whitespace-nowrap shrink-0 ${statusColor}`}>
                  {trend.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. POSITIONING MAP (Visual Anchor) */}
      {research.positioning && (
        <section className="bg-gradient-to-br from-primary/5 to-surface border border-primary/20 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Strategic Positioning Hypothesis</h2>
              <p className="text-sm text-text-secondary max-w-lg">
                {research.positioning.hypothesis}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Crosshair size={14} />
              Strategic Map
            </div>
          </div>
          
          <div className="relative w-full aspect-[2/1] md:aspect-[3/1] bg-background border border-border rounded-xl flex items-center justify-center overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Axes */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border -translate-y-1/2" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border -translate-x-1/2" />
            
            {/* Axis Labels */}
            {/* Y Axis (Points Up) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-primary uppercase tracking-widest bg-surface px-3 py-1.5 border border-border rounded shadow-sm z-10 flex items-center gap-1.5">
              {research.positioning.yAxis} <span className="text-secondary">↑</span>
            </div>
            
            {/* X Axis (Points Right) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-primary uppercase tracking-widest bg-surface px-3 py-1.5 border border-border rounded shadow-sm z-10 flex items-center gap-1.5">
              {research.positioning.xAxis} <span className="text-secondary">→</span>
            </div>

            {/* Target Area Highlight */}
            <div className="absolute top-[10%] right-[10%] w-1/3 h-1/3 border-2 border-dashed border-primary/40 rounded-3xl bg-primary/5 flex items-center justify-center">
              <span className="text-xs font-bold text-primary px-3 py-1 bg-background rounded-full shadow-lg">Target Opportunity</span>
            </div>
          </div>
        </section>
      )}

      {/* 5. COMPETITIVE LANDSCAPE */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
          Competitive Landscape
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-border rounded border border-border overflow-hidden">
          {research.competitors?.map((comp, i) => (
            <div key={i} className="bg-background p-5 hover:bg-surface/50 transition-colors flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <Target size={12} className="text-secondary" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">{comp.name}</h3>
                </div>
                <span className="text-[9px] font-mono text-secondary border border-secondary/20 bg-secondary/5 px-1.5 py-0.5 rounded">CMP-0{i+1}</span>
              </div>
              <p className="text-[10px] font-mono text-text-secondary uppercase mb-3 border-l-2 border-secondary/30 pl-2">{comp.positioning}</p>
              
              <div className="grid grid-cols-2 gap-px bg-border flex-1 border-t border-border mt-2">
                <div className="bg-background pt-3 pr-2">
                  <p className="text-[9px] font-mono text-emerald-400 mb-2 uppercase flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400"/> Advantages</p>
                  <ul className="space-y-1">
                    {comp.strengths?.map((s, j) => <li key={j} className="text-xs text-text-secondary flex gap-1.5 leading-snug"><span className="text-emerald-400/50">+</span>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-background pt-3 pl-3 border-l border-border/50">
                  <p className="text-[9px] font-mono text-danger mb-2 uppercase flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-danger"/> Vulnerabilities</p>
                  <ul className="space-y-1">
                    {comp.weaknesses?.map((w, j) => <li key={j} className="text-xs text-text-secondary flex gap-1.5 leading-snug"><span className="text-danger/50">-</span>{w}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-[9px] font-mono text-text-secondary mb-1.5 uppercase">Differentiation Vector</p>
                <p className="text-xs text-text-primary font-medium">{comp.differentiation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 6. SWOT ANALYSIS */}
        {research.swot && (
          <section>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4">SWOT Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-xl overflow-hidden">
              <div className="bg-surface p-4">
                <h3 className="text-sm font-bold text-emerald-400 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {research.swot.strengths?.map((s, i) => <li key={i} className="text-xs text-text-secondary leading-relaxed">• {s}</li>)}
                </ul>
              </div>
              <div className="bg-surface p-4">
                <h3 className="text-sm font-bold text-danger mb-3">Weaknesses</h3>
                <ul className="space-y-2">
                  {research.swot.weaknesses?.map((w, i) => <li key={i} className="text-xs text-text-secondary leading-relaxed">• {w}</li>)}
                </ul>
              </div>
              <div className="bg-surface p-4">
                <h3 className="text-sm font-bold text-primary mb-3">Opportunities</h3>
                <ul className="space-y-2">
                  {research.swot.opportunities?.map((o, i) => <li key={i} className="text-xs text-text-secondary leading-relaxed">• {o}</li>)}
                </ul>
              </div>
              <div className="bg-surface p-4">
                <h3 className="text-sm font-bold text-amber-500 mb-3">Threats</h3>
                <ul className="space-y-2">
                  {research.swot.threats?.map((t, i) => <li key={i} className="text-xs text-text-secondary leading-relaxed">• {t}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 6.5 OPPORTUNITY AREAS */}
        <section>
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
            Opportunity Areas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {research.opportunities?.map((opp, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 flex items-start gap-3 shadow-sm hover:border-primary/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
                  0{i + 1}
                </div>
                <p className="text-sm text-text-primary leading-relaxed pt-1.5">{opp}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. RISKS */}
        <section>
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
            Market Risks
          </h2>
          <div className="space-y-3">
            {research.risks?.map((risk, i) => {
              const isHigh = risk.impact === 'high' && risk.likelihood === 'high';
              return (
                <div key={i} className="bg-surface border border-border rounded-xl p-4 flex gap-4">
                  <div className={`w-1 shrink-0 rounded-full ${isHigh ? 'bg-danger' : 'bg-amber-500'}`} />
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="text-sm font-bold text-text-primary leading-snug">{risk.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${risk.impact === 'high' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-background text-text-secondary border-border'}`}>
                          Impact: {risk.impact}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${risk.likelihood === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-background text-text-secondary border-border'}`}>
                          Likelihood: {risk.likelihood}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <strong className="text-text-primary/70 font-mono text-[10px] uppercase tracking-wider mr-1">Mitigation:</strong> 
                      {risk.mitigation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 8. RECOMMENDATIONS */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
          Strategic Recommendations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {research.recommendations?.map((rec, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 flex flex-col">
              <div className="mb-auto">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-text-primary">{rec.title}</h3>
                  {rec.priority === 'high' && <span className="w-2 h-2 rounded-full bg-danger shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-text-secondary mb-4">{rec.reason}</p>
              </div>
              <div className="pt-3 border-t border-border mt-4">
                <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Next Action</p>
                <p className="text-xs text-primary font-medium">{rec.nextAction}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VALIDATION QUESTIONS */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          Questions To Validate
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {research.validationQuestions?.map((q, i) => (
            <li key={i} className="flex gap-3 text-sm text-text-secondary bg-background p-4 rounded-lg border border-border/50 shadow-sm">
              <span className="text-primary font-bold">{i + 1}.</span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default MarketResearchContent;
