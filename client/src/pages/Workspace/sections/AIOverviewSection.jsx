import React from 'react';
import { AlertCircle, Lightbulb, Users, TrendingUp } from 'lucide-react';

const AIOverviewSection = ({ overview }) => {
  if (!overview) return null;

  return (
    <div className="mb-10">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">AI Startup Overview</h2>
        <p className="text-xl text-text-primary font-sora font-medium leading-relaxed">
          {overview.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionBlock 
          title="PROBLEM" 
          content={overview.problem} 
          icon={AlertCircle}
          accentClass="text-danger" 
          borderClass="border-danger/30 hover:border-danger/60"
          bgClass="bg-danger/5"
        />
        <SectionBlock 
          title="SOLUTION" 
          content={overview.solution} 
          icon={Lightbulb}
          accentClass="text-primary" 
          borderClass="border-primary/30 hover:border-primary/60"
          bgClass="bg-primary/5"
        />
        <SectionBlock 
          title="TARGET CUSTOMER" 
          content={overview.targetCustomer} 
          icon={Users}
          accentClass="text-indigo-500" 
          borderClass="border-indigo-500/30 hover:border-indigo-500/60"
          bgClass="bg-indigo-500/5"
        />
        <SectionBlock 
          title="VALUE PROPOSITION" 
          content={overview.valueProposition} 
          icon={TrendingUp}
          accentClass="text-success" 
          borderClass="border-success/30 hover:border-success/60"
          bgClass="bg-success/5"
        />
      </div>
    </div>
  );
};

const SectionBlock = ({ title, content, icon: Icon, accentClass, borderClass, bgClass }) => (
  <div className={`bg-surface p-5 rounded-xl border border-border ${borderClass} transition-colors flex flex-col`}>
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-md ${bgClass} ${accentClass}`}>
        <Icon size={16} />
      </div>
      <h3 className={`text-[10px] font-bold uppercase tracking-widest ${accentClass}`}>{title}</h3>
    </div>
    <p className="text-sm text-text-primary leading-relaxed">{content}</p>
  </div>
);

export default AIOverviewSection;
