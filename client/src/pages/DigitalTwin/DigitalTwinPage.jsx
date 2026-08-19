import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../hooks/useProjectQueries';
import { useDigitalTwin, useSimulateScenario, useGenerateDigitalTwinInsights } from '../../hooks/useDigitalTwin';
import { RefreshCw, MonitorPlay, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import DigitalTwinContent from './components/DigitalTwinContent';
import ModuleChat from '../../components/ui/ModuleChat';
import { askDigitalTwinQuestion } from '../../services/project.api';import DigitalTwinAssumptionsForm from './components/DigitalTwinAssumptionsForm';

const DigitalTwinPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [activeScenario, setActiveScenario] = useState('base'); // base, optimistic, conservative, custom
  
  const { data: project } = useProject(projectId);
  
  const { data: digitalTwin, isLoading, error } = useDigitalTwin(projectId);
  const { mutate: simulateScenario, isPending: isSimulating } = useSimulateScenario(projectId);
  const { mutate: generateInsights, isPending: isGeneratingInsights } = useGenerateDigitalTwinInsights(projectId);

  const handleSimulate = (customAssumptions = null) => {
    simulateScenario(customAssumptions, {
      onSuccess: () => {
        toast.success('Simulation updated successfully');
        // Auto-generate insights for base scenario initially
        if (!digitalTwin?.insights?.[activeScenario]) {
          generateInsights(activeScenario);
        }
      },
      onError: (err) => toast.error(err.message || 'Simulation failed')
    });
  };

  const hasAssumptions = !!digitalTwin?.baseAssumptions;

  if (isLoading && !digitalTwin) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading Digital Twin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 flex items-center justify-center min-h-[500px]">
        <div className="bg-danger/10 text-danger p-6 rounded-xl border border-danger/20 max-w-md text-center">
          <h3 className="font-bold mb-2">We couldn't complete the simulation. Your startup data is safe — try again.</h3>
          <p className="text-sm opacity-80">Please check your connection and retry.</p>
        </div>
      </div>
    );
  }

  // Not generated yet
  if (!digitalTwin || !hasAssumptions) {
    return (
      <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <MonitorPlay className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">Digital Twin</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Your startup does not have enough business assumptions yet.
          </p>
          
          <button
            onClick={() => handleSimulate()}
            disabled={isSimulating}
            className="w-full bg-primary text-background font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Configuring Simulation...</span>
              </>
            ) : (
              <>
                <MonitorPlay size={20} />
                <span>Configure Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] px-4 xl:px-8 mx-auto pb-24 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Digital Twin</h1>
          <p className="text-text-secondary">Simulate how your startup could perform under different assumptions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimulate()}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={isSimulating ? "animate-spin" : ""} size={16} />
            <span className="text-sm font-medium hidden sm:inline">Refresh Model</span>
          </button>
          
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            <LayoutDashboard size={16} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-surface border border-border rounded-lg w-max mb-6">
        {['base', 'optimistic', 'conservative', 'custom'].map((scenario) => (
          <button
            key={scenario}
            onClick={() => setActiveScenario(scenario)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
              activeScenario === scenario 
                ? 'bg-background text-primary shadow-sm border border-border' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {scenario}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-6 items-start">
        <div className="xl:col-span-8 2xl:col-span-9 space-y-8">
          <DigitalTwinAssumptionsForm 
            twin={digitalTwin} 
            activeScenario={activeScenario} 
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />
          
          {isSimulating ? (
            <div className="p-12 border border-border rounded-2xl bg-surface flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <MonitorPlay className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Analyzing Simulation</h3>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                Running your assumptions through the deterministic engine...
              </p>
              
              <div className="w-full max-w-sm space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </span>
                  Reading assumptions
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                  </span>
                  Running model
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                  Identifying changes
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-border shrink-0" />
                  Preparing insights
                </div>
              </div>
            </div>
          ) : (
            <DigitalTwinContent 
              twin={digitalTwin} 
              activeScenario={activeScenario} 
              isGeneratingInsights={isGeneratingInsights}
              onGenerateInsights={() => generateInsights(activeScenario)}
            />
          )}
        </div>
        
        <div className="xl:col-span-4 2xl:col-span-3">
          <ModuleChat 
            moduleType="DIGITAL_TWIN"
            title="Simulation Advisor"
            description="Ask questions about your financial projections."
            placeholder="Ask the Simulation Advisor..."
            suggestedQuestions={[
              "How can I reach breakeven faster?",
              "What happens if my churn rate doubles?",
              "Are my hiring plans realistic?",
            ]}
            onAskQuestion={askDigitalTwinQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinPage;
