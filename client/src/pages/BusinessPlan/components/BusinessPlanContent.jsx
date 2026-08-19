import React from 'react';
import { Briefcase, Target, Rocket, Activity, AlertTriangle, ShieldCheck, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SectionHeader = ({ title }) => (
  <h2 className="text-xl font-display font-bold text-text-primary mb-6">{title}</h2>
);

const PriorityBadge = ({ level }) => {
  const normalizedLevel = level?.toString().toLowerCase() || 'medium';
  let colorClass = 'text-warning border-warning/30 bg-warning/10'; 
  
  if (normalizedLevel.includes('high') || normalizedLevel.includes('critical')) {
    colorClass = 'text-danger border-danger/30 bg-danger/10';
  } else if (normalizedLevel.includes('low')) {
    colorClass = 'text-success border-success/30 bg-success/10';
  }
  
  const displayLevel = normalizedLevel.toUpperCase();

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClass}`}>
      {displayLevel}
    </span>
  );
};

const BusinessPlanContent = ({ plan }) => {
  const ex = plan.executiveSummary || {};
  const model = plan.businessModel || {};
  const gtm = plan.goToMarket || {};
  const comp = plan.competitivePositioning || {};
  const metrics = plan.keyMetrics || [];
  const risks = plan.risks || [];
  const recommendations = plan.recommendations || [];

  // Chart data for Key Metrics (just mapping names and a placeholder value for visual structure)
  const chartData = metrics.map((m, i) => ({
    name: m.name,
    targetValue: 100 - (i * 15), // Visual placeholder distribution
    importance: m.importance
  }));

  return (
    <div className="space-y-16">
      
      {/* 1. EXECUTIVE SUMMARY */}
      <section>
        <SectionHeader title="Executive Summary" />
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6">
          <p className="text-lg text-text-primary font-medium leading-relaxed">
            {ex.overview}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">The Problem</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{ex.problem}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">The Solution</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{ex.solution}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Target Customer</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{ex.targetCustomer}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Business Model</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{ex.businessModel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BUSINESS MODEL & REVENUE */}
      <section>
        <SectionHeader title="Business Model & Revenue" />
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-background/20">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Primary Model</h4>
            <div className="text-lg font-display font-bold text-text-primary">{model.type}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/10">
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Revenue Stream</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Pricing Logic</th>
                  <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Importance</th>
                </tr>
              </thead>
              <tbody>
                {model.revenueStreams?.map((stream, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors">
                    <td className="p-4 align-top w-1/2">
                      <div className="font-bold text-text-primary mb-1 text-sm">{stream.name}</div>
                      <div className="text-sm text-text-secondary">{stream.description}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="inline-block bg-background border border-border/50 rounded px-2 py-1 text-xs font-medium text-text-secondary">
                        {stream.pricingLogic}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <PriorityBadge level={stream.importance} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. GO TO MARKET (Visual Pipeline) */}
      <section>
        <SectionHeader title="Go-To-Market Strategy" />
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Initial Segment</h4>
            <div className="text-lg font-medium text-text-primary">{gtm.initialSegment}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mt-12">
            {/* Native SVG connector line for desktop */}
            <svg className="hidden md:block absolute top-4 left-0 w-full h-2 z-0" preserveAspectRatio="none">
              <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            
            <div className="relative z-10 bg-background border border-border rounded-xl p-5 shadow-sm mt-4 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mx-auto border border-secondary/20 shadow-sm">1</div>
              <h4 className="font-bold text-center text-sm mb-2 text-text-primary mt-2">Acquisition</h4>
              <p className="text-xs text-center text-text-secondary">{gtm.channels?.join(', ') || 'N/A'}</p>
            </div>
            
            <div className="relative z-10 bg-background border border-border rounded-xl p-5 shadow-sm mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mx-auto border border-secondary/20 shadow-sm">2</div>
              <h4 className="font-bold text-center text-sm mb-2 text-text-primary mt-2">Sales</h4>
              <p className="text-xs text-center text-text-secondary">{gtm.salesStrategy || 'N/A'}</p>
            </div>
            
            <div className="relative z-10 bg-background border border-border rounded-xl p-5 shadow-sm mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mx-auto border border-secondary/20 shadow-sm">3</div>
              <h4 className="font-bold text-center text-sm mb-2 text-text-primary mt-2">Launch</h4>
              <p className="text-xs text-center text-text-secondary">{gtm.launchStrategy || 'N/A'}</p>
            </div>
            
            <div className="relative z-10 bg-background border border-border rounded-xl p-5 shadow-sm mt-8 md:mt-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mx-auto border border-secondary/20 shadow-sm">4</div>
              <h4 className="font-bold text-center text-sm mb-2 text-text-primary mt-2">Traction</h4>
              <p className="text-xs text-center text-text-secondary">{gtm.earlyTractionStrategy || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS */}
      <section>
        <SectionHeader title="Key Metrics & KPIs" />
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/10">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Metric</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Baseline (Industry Avg)</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Target Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors">
                  <td className="p-4 w-1/2">
                    <div className="font-bold text-text-primary text-sm mb-1">{m.name}</div>
                    <div className="text-xs text-text-secondary">{m.description}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="text-xs font-medium text-text-secondary/60 border border-border/50 bg-background rounded px-2 py-1 inline-block italic">Est. Baseline</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="text-sm font-bold text-text-primary">{m.target}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. STRATEGIC RISKS */}
      <section>
        <SectionHeader title="Business Risks & Mitigation" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((risk, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-5 hover:border-danger/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                  <ShieldCheck size={16} className="text-danger" />
                  {risk.title}
                </h4>
                <PriorityBadge level={risk.severity} />
              </div>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{risk.description}</p>
              <div className="bg-background border border-border/50 rounded-lg p-3">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Mitigation Strategy</span>
                <p className="text-xs text-text-primary leading-relaxed">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STRATEGIC RECOMMENDATIONS */}
      <section>
        <SectionHeader title="Strategic Recommendations" />
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-shrink-0">
                <PriorityBadge level={rec.priority} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-text-primary text-sm mb-1">{rec.action}</h4>
                <p className="text-sm text-text-secondary">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BusinessPlanContent;
