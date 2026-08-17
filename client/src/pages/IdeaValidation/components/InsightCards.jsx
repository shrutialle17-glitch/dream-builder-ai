import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';

export const ValidationStrengthCard = ({ strength }) => (
  <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-4 hover:bg-success/10 transition-colors h-full">
    <div className="bg-success/20 p-2 rounded-lg flex-shrink-0">
      <CheckCircle2 size={18} className="text-success" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-text-primary mb-1">{strength.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{strength.explanation}</p>
    </div>
  </div>
);

export const ValidationWeaknessCard = ({ weakness }) => {
  const getSeverityStyles = (severity) => {
    switch (severity?.toString().toUpperCase()) {
      case 'HIGH':
        return 'bg-danger/10 border-danger/20 text-danger';
      case 'MEDIUM':
      default:
        return 'bg-warning/10 border-warning/20 text-warning';
    }
  };

  const severity = weakness.severity || 'MEDIUM';

  return (
    <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-4 hover:bg-warning/10 transition-colors h-full">
      <div className="bg-warning/20 p-2 rounded-lg flex-shrink-0">
        <AlertTriangle size={18} className="text-warning" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-bold text-text-primary">{weakness.title}</h4>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityStyles(severity)}`}>
            {severity}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{weakness.explanation}</p>
      </div>
    </div>
  );
};

export const ValidationOpportunityCard = ({ opportunity, index }) => (
  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4 hover:bg-primary/10 transition-colors h-full">
    <div className="bg-primary/20 p-2 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9">
      <span className="text-xs font-bold font-sora text-primary">
        {(index + 1).toString().padStart(2, '0')}
      </span>
    </div>
    <div>
      <h4 className="text-sm font-bold text-text-primary mb-1">{opportunity.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{opportunity.explanation}</p>
    </div>
  </div>
);

export const ValidationRiskCard = ({ risk }) => {
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-danger/10 border-danger/20 text-danger';
      case 'MEDIUM':
        return 'bg-warning/10 border-warning/20 text-warning';
      default:
        return 'bg-secondary/10 border-secondary/20 text-secondary';
    }
  };

  return (
    <div className={`bg-surface border rounded-xl p-4 flex items-start gap-4 transition-colors h-full ${
      risk.severity === 'HIGH' ? 'border-danger/30 hover:border-danger/50' :
      risk.severity === 'MEDIUM' ? 'border-warning/30 hover:border-warning/50' :
      'border-border hover:border-primary/50'
    }`}>
      <div className={`p-2 rounded-lg flex-shrink-0 ${getSeverityStyles(risk.severity).split(' ')[0]}`}>
        <ShieldAlert size={18} className={getSeverityStyles(risk.severity).split(' ')[2]} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-bold text-text-primary">{risk.title}</h4>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getSeverityStyles(risk.severity)}`}>
            {risk.severity}
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{risk.explanation}</p>
      </div>
    </div>
  );
};

export const ValidationRecommendationCard = ({ recommendation }) => {
  const actionText = recommendation.title.toLowerCase().includes('plan') ? 'View Details' : 
                     recommendation.title.toLowerCase().includes('brand') ? 'Explore Strategy' :
                     recommendation.title.toLowerCase().includes('mvp') ? 'Plan MVP' : 'Take Action';

  return (
    <div className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/40 transition-colors flex flex-col h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp size={48} className="text-primary" />
      </div>
      <div className="text-2xl font-display font-bold text-primary/40 mb-3">
        {recommendation.number < 10 ? `0${recommendation.number}` : recommendation.number}
      </div>
      <h4 className="text-base font-bold text-text-primary mb-2 relative z-10">{recommendation.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed flex-grow relative z-10 mb-4">{recommendation.explanation}</p>
      
      <div className="mt-auto pt-4 border-t border-border/50 relative z-10">
        <span className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer transition-colors w-fit">
          {actionText}
          <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
};
