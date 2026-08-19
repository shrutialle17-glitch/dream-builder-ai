import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

const DigitalTwinAssumptionsForm = ({ twin, activeScenario, onSimulate, isSimulating }) => {
  const isCustom = activeScenario === 'custom';
  
  // Use the appropriate assumptions based on scenario
  const getAssumptionsForScenario = () => {
    switch (activeScenario) {
      case 'optimistic': return twin.optimisticAssumptions;
      case 'conservative': return twin.conservativeAssumptions;
      case 'custom': return twin.customAssumptions || twin.baseAssumptions;
      default: return twin.baseAssumptions;
    }
  };

  const initialAssumptions = getAssumptionsForScenario();
  
  const [formData, setFormData] = useState(initialAssumptions);

  // Sync when scenario changes
  useEffect(() => {
    setFormData(getAssumptionsForScenario());
  }, [activeScenario, twin]);

  const handleChange = (e) => {
    if (!isCustom) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCustom) {
      onSimulate(formData);
    }
  };

  const inputFields = [
    { name: 'startingCustomers', label: 'Starting Customers', step: 1 },
    { name: 'monthlyCustomerGrowth', label: 'Monthly Customer Growth (%)', step: 0.1 },
    { name: 'arpu', label: 'Avg Revenue Per Customer (₹)', step: 1 },
    { name: 'conversionRate', label: 'Conversion Rate (%)', step: 0.1 },
    { name: 'cac', label: 'Customer Acquisition Cost (₹)', step: 1 },
    { name: 'monthlyMarketingSpend', label: 'Monthly Marketing Spend (₹)', step: 100 },
    { name: 'monthlyOperatingCost', label: 'Monthly Operating Cost (₹)', step: 100 },
    { name: 'customerRetention', label: 'Customer Retention (%)', step: 0.1 },
    { name: 'initialCapital', label: 'Initial Capital (₹)', step: 1000 },
    { name: 'simulationDuration', label: 'Simulation Duration (Months)', step: 1 }
  ];

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          Business Assumptions
        </h3>
        {isCustom && (
          <button 
            onClick={handleSubmit}
            disabled={isSimulating}
            className="px-4 py-1.5 bg-primary text-background text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Run Simulation
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={formData?.[field.name] ?? ''}
                onChange={handleChange}
                disabled={!isCustom}
                step={field.step}
                className={`w-full px-3 py-2 bg-background border ${isCustom ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary' : 'border-transparent opacity-70'} rounded-lg text-text-primary text-sm transition-all outline-none`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinAssumptionsForm;
