import React from 'react';
import ModuleCard from '../components/ModuleCard';
import { Lightbulb, Dna, FileText, Box, Paintbrush, Presentation, MonitorPlay, Search } from 'lucide-react';
import { useIdeaValidation } from '../../../hooks/useIdeaValidation';

const ModuleGrid = ({ 
  projectId, 
  validation, 
  dna, 
  businessPlan, 
  mvpPlan, 
  branding, 
  pitchDeck, 
  digitalTwin, 
  marketResearch 
}) => {
  return (
    <div className="space-y-10">
      
      <div>
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ModuleCard 
            to={`/projects/${projectId}/validation`}
            title="Idea Validation"
            description="Evaluate the strength of your startup opportunity."
            icon={Lightbulb}
            accentColor="primary"
            status={validation?.status || 'NOT_STARTED'}
          />
          <ModuleCard 
            to={`/projects/${projectId}/dna`}
            title="Startup DNA"
            description="Understand the strategic DNA of your startup."
            icon={Dna}
            accentColor="secondary"
            status={dna?.status || 'NOT_STARTED'}
          />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
          Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ModuleCard 
            to={`/projects/${projectId}/business-plan`}
            title="Business Plan"
            description="Generate a comprehensive business plan."
            icon={FileText}
            accentColor="success"
            status={businessPlan?.status || (businessPlan ? 'COMPLETED' : 'NOT_STARTED')}
          />
          <ModuleCard 
            to={`/projects/${projectId}/mvp`}
            title="MVP Planner"
            description="Define and plan your Minimum Viable Product."
            icon={Box}
            accentColor="primary"
            status={mvpPlan?.status || (mvpPlan ? 'COMPLETED' : 'NOT_STARTED')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          Brand & Fundraising
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ModuleCard 
            to={`/projects/${projectId}/branding`}
            title="Branding"
            description="Create your startup's visual identity and brand voice."
            icon={Paintbrush}
            accentColor="secondary"
            status={branding ? 'COMPLETED' : 'NOT_STARTED'}
          />
          <ModuleCard 
            to={`/projects/${projectId}/pitch-deck`}
            title="Pitch Deck"
            description="Craft a compelling pitch deck for investors."
            icon={Presentation}
            accentColor="primary"
            status={pitchDeck ? 'COMPLETED' : 'NOT_STARTED'}
          />
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
          Advanced
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ModuleCard 
            to={`/projects/${projectId}/digital-twin`}
            title="Digital Twin"
            description="Simulate your startup's growth and operations."
            icon={MonitorPlay}
            accentColor="success"
            status={digitalTwin ? 'COMPLETED' : 'NOT_STARTED'}
          />
          <ModuleCard 
            to={`/projects/${projectId}/market-research`}
            title="AI Market Research"
            description="Deep dive into market trends and competitors."
            icon={Search}
            accentColor="secondary"
            status={marketResearch ? 'COMPLETED' : 'NOT_STARTED'}
          />
        </div>
      </div>

    </div>
  );
};

export default ModuleGrid;
