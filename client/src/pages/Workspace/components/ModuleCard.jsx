import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const ModuleCard = ({ to, title, description, status = 'NOT_STARTED', icon: Icon, accentColor = 'primary' }) => {
  const getActionText = () => {
    if (status === 'NOT_STARTED') return 'Start';
    if (status === 'IN_PROGRESS') return 'Continue';
    return 'View Results';
  };

  const colorMap = {
    primary: { container: 'text-primary bg-primary/10 border-primary/20 group-hover:border-primary/40' },
    secondary: { container: 'text-secondary bg-secondary/10 border-secondary/20 group-hover:border-secondary/40' },
    success: { container: 'text-success bg-success/10 border-success/20 group-hover:border-success/40' },
  };

  const currentColors = colorMap[accentColor] || colorMap.primary;

  return (
    <Link to={to} className="block group h-full">
      <div className="bg-surface border border-border rounded-xl p-5 h-full flex flex-col hover:border-text-secondary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 relative overflow-hidden group-hover:bg-surface/80">
        
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${currentColors.container} transition-colors w-fit mb-4`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <div className="mb-5">
          <h4 className="text-text-primary font-sora font-bold text-sm mb-2">{title}</h4>
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{description}</p>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border group-hover:border-border/80 transition-colors">
          <StatusIndicator status={status} />
          <span className="text-xs font-bold text-text-primary flex items-center gap-1 group-hover:text-primary transition-colors">
            {getActionText()} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const StatusIndicator = ({ status }) => {
  const config = {
    NOT_STARTED: { label: 'Not Started', dot: 'bg-text-secondary/50', text: 'text-text-secondary' },
    IN_PROGRESS: { label: 'In Progress', dot: 'bg-primary', text: 'text-primary' },
    COMPLETED: { label: 'Completed', dot: 'bg-success', text: 'text-success' },
    NEEDS_REVIEW: { label: 'Needs Review', dot: 'bg-warning', text: 'text-warning' },
    FAILED: { label: 'Failed', dot: 'bg-danger', text: 'text-danger' },
  }[status] || { label: status, dot: 'bg-text-secondary/50', text: 'text-text-secondary' };

  if (status === 'COMPLETED') {
    return (
      <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${config.text}`}>
        <Check size={12} strokeWidth={3} /> {config.label}
      </span>
    );
  }

  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default ModuleCard;
