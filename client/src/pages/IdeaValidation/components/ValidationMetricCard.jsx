import React from 'react';
import { getScoreLabel, getScoreColorClass } from '../../../constants/validation';

const getInverseScoreLabel = (score, title) => {
  const labelText = title.includes('Complexity') ? 'Complexity' : 'Risk';
  if (score >= 80) return `High ${labelText}`;
  if (score >= 60) return `Moderate ${labelText}`;
  if (score >= 40) return `Manageable ${labelText}`;
  return `Low ${labelText}`;
};

const getInverseColorClass = (score) => {
  if (score >= 80) return "text-danger";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-primary";
  return "text-success";
};

const ValidationMetricCard = ({ title, score, analysis, compact = false, inverse = false }) => {
  const label = inverse ? getInverseScoreLabel(score, title) : getScoreLabel(score);
  const colorClass = inverse ? getInverseColorClass(score) : getScoreColorClass(score);

  // Derive progress bar color
  let progressBg = "bg-primary";
  if (inverse) {
    if (score >= 80) progressBg = "bg-danger";
    else if (score >= 60) progressBg = "bg-warning";
    else if (score >= 40) progressBg = "bg-primary";
    else progressBg = "bg-success";
  } else {
    if (score >= 75) progressBg = "bg-success";
    else if (score >= 40 && score < 75) progressBg = "bg-warning";
    else if (score < 40) progressBg = "bg-danger";
  }

  return (
    <div className={`group relative bg-gradient-to-br from-surface to-background border border-border/60 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 overflow-hidden ${compact ? 'p-5' : 'p-6'}`}>
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-3">
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-bold text-text-primary tracking-tight`}>{title}</h3>
        <div className="flex items-baseline gap-0.5 text-right">
          <span className={`${compact ? 'text-xl' : 'text-2xl'} font-bold font-display tracking-tight ${colorClass}`}>
            {score}
          </span>
          <span className="text-xs text-text-secondary/70 font-medium font-display">/100</span>
        </div>
      </div>
      
      <div className={`relative z-10 ${compact ? 'mb-3' : 'mb-4'}`}>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colorClass}`}>
          {label}
        </span>
      </div>
      
      <p className={`relative z-10 text-text-secondary/90 leading-relaxed ${compact ? 'text-[13px] line-clamp-3' : 'text-sm'}`} title={compact ? analysis : undefined}>
        {analysis}
      </p>
    </div>
  );
};

export default ValidationMetricCard;
