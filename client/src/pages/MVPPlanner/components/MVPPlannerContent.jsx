import React from 'react';
import { Target, CheckCircle2, Circle, AlertCircle, PlayCircle, Map, Server, Compass } from 'lucide-react';

const SectionHeader = ({ title }) => (
  <h2 className="text-xl font-display font-bold text-text-primary mb-6">{title}</h2>
);

const FeatureRow = ({ feature, type }) => {
  let indicatorColor = 'bg-primary';
  if (type === 'should') indicatorColor = 'bg-success';
  if (type === 'could') indicatorColor = 'bg-warning';
  if (type === 'later') indicatorColor = 'bg-text-secondary';
  
  let complexityColor = 'text-success border-success/30 bg-success/10';
  if (feature.estimatedComplexity?.toLowerCase() === 'high') complexityColor = 'text-danger border-danger/30 bg-danger/10';
  if (feature.estimatedComplexity?.toLowerCase() === 'medium') complexityColor = 'text-warning border-warning/30 bg-warning/10';

  return (
    <div className="border-b border-border/50 last:border-0 py-3 hover:bg-background/20 transition-colors px-4 -mx-4 rounded-lg">
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <span className={`w-2 h-2 rounded-full ${indicatorColor} shrink-0`}></span>
        <h4 className="font-bold text-sm text-text-primary mr-auto">{feature.name}</h4>
        <span className={`text-[10px] uppercase font-bold tracking-wider border px-2 py-0.5 rounded-full ${complexityColor}`}>
          {feature.estimatedComplexity || 'Med'} Comp
        </span>
      </div>
      <div className="pl-5">
        <p className="text-sm text-text-secondary leading-relaxed inline">
          {feature.description}
        </p>
        <span className="text-sm text-text-secondary/50 mx-2">•</span>
        <p className="text-xs text-text-secondary/80 italic inline">
          {feature.reason}
        </p>
      </div>
    </div>
  );
};

const ReadinessScore = ({ score }) => {
  const safeScore = score || 0;
  
  let scoreColor = 'var(--color-success)';
  let bgFillClass = 'bg-success';
  if (safeScore < 50) {
    scoreColor = 'var(--color-danger)';
    bgFillClass = 'bg-danger';
  } else if (safeScore < 75) {
    scoreColor = 'var(--color-warning)';
    bgFillClass = 'bg-warning';
  }

  // Segmented horizontal bar
  const totalSegments = 20; // Each segment is 5%
  const filledSegments = Math.round((safeScore / 100) * totalSegments);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-center h-full">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold text-lg text-text-primary mb-1">Build Readiness</h3>
          <p className="text-xs text-text-secondary leading-relaxed max-w-[200px]">
            Based on feature scope density, technical complexity, and market validation.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-display font-bold" style={{ color: scoreColor }}>{safeScore}</span>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Score / 100</span>
        </div>
      </div>
      
      {/* Horizontal Segmented Bar */}
      <div className="flex gap-1 h-8 mt-2 w-full">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm ${i < filledSegments ? bgFillClass : 'bg-background border border-border/50'}`}
            style={{ 
              opacity: i < filledSegments ? 0.3 + (0.7 * (i / totalSegments)) : 1,
              boxShadow: i < filledSegments && i === filledSegments - 1 ? `0 0 10px ${scoreColor}` : 'none'
            }}
          ></div>
        ))}
      </div>
      
      <div className="flex justify-between mt-3">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Low</span>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">High</span>
      </div>
    </div>
  );
};


const MVPPlannerContent = ({ mvp }) => {
  const mustHave = mvp.mustHaveFeatures || [];
  const shouldHave = mvp.shouldHaveFeatures || [];
  const couldHave = mvp.couldHaveFeatures || [];
  const later = mvp.laterFeatures || [];
  const roadmap = mvp.roadmap || [];
  
  return (
    <div className="space-y-16">
      
      {/* 1. OBJECTIVE & READINESS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Target size={24} className="text-secondary" />
            <h2 className="text-2xl font-display font-bold text-text-primary">MVP Objective</h2>
          </div>
          <p className="text-lg text-text-primary font-medium leading-relaxed">
            {mvp.objective}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border/50">
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Core User</h4>
              <p className="text-sm text-text-secondary">{mvp.coreUser}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Core Problem</h4>
              <p className="text-sm text-text-secondary">{mvp.problem}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Core Value</h4>
              <p className="text-sm text-text-secondary">{mvp.valueProposition}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ReadinessScore score={mvp.readinessScore} />
        </div>
      </section>

      {/* 2. MoSCoW FEATURE MATRIX */}
      <section>
        <SectionHeader title="Feature Prioritization (MoSCoW)" />
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-surface border border-border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Must Have</span>
            <span className="text-sm font-bold text-text-primary ml-2">{mustHave.length}</span>
          </div>
          <div className="bg-surface border border-border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Should Have</span>
            <span className="text-sm font-bold text-text-primary ml-2">{shouldHave.length}</span>
          </div>
          <div className="bg-surface border border-border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Could Have</span>
            <span className="text-sm font-bold text-text-primary ml-2">{couldHave.length}</span>
          </div>
          <div className="bg-surface border border-border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-text-secondary"></div>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Later</span>
            <span className="text-sm font-bold text-text-primary ml-2">{later.length}</span>
          </div>
        </div>
        
        <div className="space-y-8">
          
          {/* MUST HAVE */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
              <h3 className="font-bold text-lg text-text-primary">MUST HAVE</h3>
              <span className="text-xs text-text-secondary ml-2">(Non-negotiable for launch)</span>
            </div>
            <div className="flex flex-col">
              {mustHave.map((f, i) => <FeatureRow key={i} feature={f} type="must" />)}
            </div>
          </div>

          {/* SHOULD HAVE */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <h3 className="font-bold text-lg text-text-primary">SHOULD HAVE</h3>
              <span className="text-xs text-text-secondary ml-2">(Important but not vital)</span>
            </div>
            <div className="flex flex-col">
              {shouldHave.map((f, i) => <FeatureRow key={i} feature={f} type="should" />)}
            </div>
          </div>

          {/* COULD HAVE */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <h3 className="font-bold text-lg text-text-primary">COULD HAVE</h3>
              <span className="text-xs text-text-secondary ml-2">(Nice to have, low impact if left out)</span>
            </div>
            <div className="flex flex-col">
              {couldHave.map((f, i) => <FeatureRow key={i} feature={f} type="could" />)}
            </div>
          </div>

          {/* LATER */}
          <div className="bg-surface border border-border rounded-2xl p-6 opacity-75">
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
              <div className="w-3 h-3 rounded-full bg-text-secondary"></div>
              <h3 className="font-bold text-lg text-text-primary">LATER</h3>
              <span className="text-xs text-text-secondary ml-2">(Out of scope for MVP)</span>
            </div>
            <div className="flex flex-col">
              {later.map((f, i) => <FeatureRow key={i} feature={f} type="later" />)}
            </div>
          </div>

        </div>
      </section>

      {/* 3. DEVELOPMENT ROADMAP */}
      <section>
        <SectionHeader title="Execution Roadmap" />
        <div className="bg-surface border border-border rounded-2xl p-6 relative">
          <svg className="absolute top-10 bottom-10 left-[39px] w-[2px] hidden md:block z-0" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          
          <div className="space-y-6">
            {roadmap.map((phase, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:items-start group">
                <div className="hidden md:flex flex-col items-center z-10 mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border-2 border-secondary text-secondary flex items-center justify-center font-bold text-sm shadow-[0_0_10px_var(--color-secondary-muted,rgba(168,85,247,0.3))]">
                    {idx + 1}
                  </div>
                </div>
                
                <div className="bg-background border border-border group-hover:border-secondary/30 transition-colors rounded-xl p-5 flex-grow">
                  <h4 className="font-bold text-text-primary mb-1">{phase.phase}: {phase.name}</h4>
                  <p className="text-sm text-text-secondary mb-4">{phase.focus}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {phase.features?.map((f, i) => (
                      <span key={i} className="px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-secondary" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default MVPPlannerContent;
