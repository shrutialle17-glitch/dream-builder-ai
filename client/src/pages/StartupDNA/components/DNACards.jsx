import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';

// Standardized Badge Component (Used for Risks and Recommendations)
const PriorityBadge = ({ level, type = 'positive' }) => {
  const normalizedLevel = level?.toString().toLowerCase() || 'medium';
  let colorClass = 'text-text-secondary border-border'; // Low/Neutral
  
  if (normalizedLevel.includes('medium') || normalizedLevel.includes('moderate')) {
    colorClass = 'text-warning border-warning/30';
  } else if (normalizedLevel.includes('high') || normalizedLevel.includes('strong')) {
    colorClass = type === 'positive' ? 'text-success border-success/30' : 'text-danger border-danger/30';
  }
  
  const displayLevel = normalizedLevel.includes('high') || normalizedLevel.includes('strong') ? 'HIGH' : 
                       normalizedLevel.includes('medium') || normalizedLevel.includes('moderate') ? 'MEDIUM' : 'LOW';

  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${colorClass}`}>
      {displayLevel}
    </span>
  );
};

export const DNAStrengthCard = ({ item }) => (
  <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-4 hover:bg-success/10 transition-colors h-full">
    <div className="bg-success/20 p-2 rounded-lg flex-shrink-0">
      <CheckCircle2 size={18} className="text-success" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-text-primary mb-1">{item.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
    </div>
  </div>
);

export const DNAWeaknessCard = ({ item }) => (
  <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-4 hover:bg-warning/10 transition-colors h-full">
    <div className="bg-warning/20 p-2 rounded-lg flex-shrink-0">
      <AlertTriangle size={18} className="text-warning" />
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
        <PriorityBadge level={item.severity} type="negative" />
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
    </div>
  </div>
);

export const DNAOpportunityCard = ({ item, index = 0 }) => (
  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4 hover:bg-primary/10 transition-colors h-full">
    <div className="bg-primary/20 p-2 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9">
      <span className="text-xs font-bold font-sora text-primary">
        {(index + 1).toString().padStart(2, '0')}
      </span>
    </div>
    <div>
      <h4 className="text-sm font-bold text-text-primary mb-1">{item.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
    </div>
  </div>
);

export const DNARiskCard = ({ item }) => {
  const getSeverityStyles = (severity) => {
    const s = severity?.toString().toUpperCase() || 'MEDIUM';
    switch (s) {
      case 'HIGH':
        return 'bg-danger/10 border-danger/20 text-danger';
      case 'MEDIUM':
        return 'bg-warning/10 border-warning/20 text-warning';
      default:
        return 'bg-secondary/10 border-secondary/20 text-secondary';
    }
  };

  const s = item.severity?.toString().toUpperCase() || 'MEDIUM';

  return (
    <div className={`bg-surface border rounded-xl p-4 flex items-start gap-4 transition-colors h-full ${
      s === 'HIGH' ? 'border-danger/30 hover:border-danger/50' :
      s === 'MEDIUM' ? 'border-warning/30 hover:border-warning/50' :
      'border-border hover:border-primary/50'
    }`}>
      <div className={`p-2 rounded-lg flex-shrink-0 ${getSeverityStyles(s).split(' ')[0]}`}>
        <ShieldAlert size={18} className={getSeverityStyles(s).split(' ')[2]} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityStyles(s)}`}>
            {s}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
        {item.mitigation && (
          <p className="text-text-secondary/80 text-[11px] leading-relaxed mt-2">
            <span className="font-semibold text-text-secondary">Mitigation:</span> {item.mitigation}
          </p>
        )}
      </div>
    </div>
  );
};

export const DNARecommendationCard = ({ item, index }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-border/50 last:border-0 items-start">
      <div className="font-display font-bold text-text-secondary text-sm w-6">
        {index.toString().padStart(2, '0')}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-semibold text-text-primary text-sm">{item.action}</h4>
          <PriorityBadge level={item.priority} type="positive" />
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{item.reason}</p>
      </div>
    </div>
  );
};
