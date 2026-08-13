import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Dna, 
  FileText, 
  Box, 
  Paintbrush, 
  Presentation, 
  MonitorPlay, 
  Search,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useIdeaValidation } from '../../hooks/useIdeaValidation';
import { useQuery } from '@tanstack/react-query';
import { getStartupDNA } from '../../services/project.api';
import { useBusinessPlan } from '../../hooks/useBusinessPlan';
import { useMVPPlanner } from '../../hooks/useMVPPlanner';
import { useBranding } from '../../hooks/useBranding';
import { usePitchDeck } from '../../hooks/usePitchDeck';
import { useDigitalTwin } from '../../hooks/useDigitalTwin';
import { useMarketResearch } from '../../hooks/useMarketResearch';

const WorkspaceSidebar = ({ project, isOpen, toggleSidebar }) => {
  const { data: validation } = useIdeaValidation(project.id);
  const isValidationCompleted = validation?.status === 'COMPLETED';

  const { data: dna } = useQuery({ queryKey: ['startup-dna', project.id], queryFn: () => getStartupDNA(project.id), enabled: !!project.id });
  const isDNACompleted = dna?.status === 'COMPLETED';

  const { data: businessPlan } = useBusinessPlan(project.id);
  const isBusinessPlanCompleted = !!businessPlan;

  const { data: mvpPlan } = useMVPPlanner(project.id);
  const isMVPCompleted = !!mvpPlan;

  const { data: branding } = useBranding(project.id);
  const isBrandingCompleted = !!branding;

  const { data: pitchDeck } = usePitchDeck(project.id);
  const isPitchDeckCompleted = !!pitchDeck;

  const { data: digitalTwin } = useDigitalTwin(project.id);
  const isDigitalTwinCompleted = !!digitalTwin;

  const { data: marketResearch } = useMarketResearch(project.id);
  const isMarketResearchCompleted = !!marketResearch;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-border flex flex-col h-full transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-start gap-3 h-16 border-b border-border px-6 py-2 flex-shrink-0">
        <img src="/assets/images/logo.png" alt="Dream Builder AI" className="h-8 w-auto object-contain" />
        <span className="font-display font-bold text-lg text-text-primary tracking-tight truncate">Dream Builder AI</span>
      </div>
      <div className="p-6 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-bold text-text-primary tracking-wide uppercase truncate font-sora">{project.name}</h2>
        <p className="text-xs text-text-secondary mt-1">Startup Workspace</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-7">
        
        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Overview</h3>
          <div className="space-y-1">
            <NavItem to={`/projects/${project.id}`} icon={<LayoutDashboard size={18} />} label="Overview" end toggleSidebar={toggleSidebar} />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Intelligence</h3>
          <div className="space-y-1">
            <NavItem 
              to={`/projects/${project.id}/validation`} 
              icon={<Lightbulb size={18} />} 
              label="Idea Validation" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isValidationCompleted}
            />
            <NavItem 
              to={`/projects/${project.id}/startup-dna`} 
              icon={<Dna size={18} />} 
              label="Startup DNA" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isDNACompleted}
            />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Strategy</h3>
          <div className="space-y-1">
            <NavItem 
              to={`/projects/${project.id}/business-plan`} 
              icon={<FileText size={18} />} 
              label="Business Plan" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isBusinessPlanCompleted}
            />
            <NavItem 
              to={`/projects/${project.id}/mvp`} 
              icon={<Box size={18} />} 
              label="MVP Planner" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isMVPCompleted}
            />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Execution</h3>
          <div className="space-y-1">
            <NavItem 
              to={`/projects/${project.id}/branding`} 
              icon={<Paintbrush size={18} />} 
              label="Brand Studio" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isBrandingCompleted}
            />
            <NavItem 
              to={`/projects/${project.id}/pitch-deck`} 
              icon={<Presentation size={18} />} 
              label="Investor Workspace" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isPitchDeckCompleted}
            />
          </div>
        </div>


        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Simulation</h3>
          <div className="space-y-1">
            <NavItem 
              to={`/projects/${project.id}/digital-twin`} 
              icon={<MonitorPlay size={18} />} 
              label="Digital Twin" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isDigitalTwinCompleted}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-3">Research</h3>
          <div className="space-y-1">
            <NavItem 
              to={`/projects/${project.id}/market-research`} 
              icon={<Search size={18} />} 
              label="AI Market Research" 
              toggleSidebar={toggleSidebar} 
              isCompleted={isMarketResearchCompleted}
            />
          </div>
        </div>

      </nav>

      <div className="p-4 border-t border-border">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
        >
          <ArrowLeft size={16} />
          Back to My Startups
        </Link>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label, end, toggleSidebar, isCompleted }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => {
        if (window.innerWidth < 1024 && toggleSidebar) {
          toggleSidebar();
        }
      }}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-y border-r border-l-[3px] ${
          isActive 
            ? 'bg-primary/10 text-primary border-y-primary/20 border-r-primary/20 border-l-primary shadow-sm' 
            : 'border-transparent text-text-secondary hover:bg-surface hover:text-text-primary hover:border-y-border hover:border-r-border hover:border-l-border/50'
        }`
      }
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {isCompleted && (
        <CheckCircle2 size={14} className="text-success flex-shrink-0" />
      )}
    </NavLink>
  );
};

export default WorkspaceSidebar;
