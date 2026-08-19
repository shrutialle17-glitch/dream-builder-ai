import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { IndianRupee, Users, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { useChartTheme } from '../../../hooks/useChartTheme';

const MetricCard = ({ title, value, icon, subtitle }) => (
  <div className="bg-background border border-border rounded p-4 flex flex-col relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
    <div className="flex justify-between items-start mb-6">
      <h4 className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">{title}</h4>
      <div className="text-secondary/70">
        {icon}
      </div>
    </div>
    <div className="mt-auto relative z-10">
      <p className="text-2xl md:text-3xl font-mono font-medium text-text-primary mb-1 tracking-tight">{value}</p>
      {subtitle && <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest border-t border-border/50 pt-2">{subtitle}</p>}
    </div>
  </div>
);

const DigitalTwinContent = ({ twin, activeScenario, isGeneratingInsights, onGenerateInsights }) => {
  const chartTheme = useChartTheme();
  
  const results = twin?.simulationResults?.[activeScenario];
  const insights = twin?.insights?.[activeScenario];

  if (!results) return null;

  const { monthlyData, summary } = results;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(val);

  return (
    <div className="space-y-12">
      
      {/* KPIs */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-6">Simulation Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Ending Cash" 
            value={formatCurrency(summary.endingCash)} 
            icon={<IndianRupee size={20} />} 
            subtitle="After simulated period"
          />
          <MetricCard 
            title="Ending Customers" 
            value={formatNumber(summary.endingCustomers)} 
            icon={<Users size={20} />} 
            subtitle="Total retained + acquired"
          />
          <MetricCard 
            title="Runway" 
            value={summary.runway === '12+' || summary.runway === '24+' || summary.runway === '6+' ? summary.runway + ' months' : summary.runway + ' months'} 
            icon={<TrendingUp size={20} />} 
            subtitle="Estimated survival time"
          />
          <MetricCard 
            title="Break-even" 
            value={summary.breakEvenMonth === 'Not achieved' ? 'N/A' : `Month ${summary.breakEvenMonth}`} 
            icon={<AlertTriangle size={20} />} 
            subtitle={summary.breakEvenMonth === 'Not achieved' ? 'Not profitable in period' : 'Profitable timeline'}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-background border border-border p-5 rounded relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">Revenue vs Costs</h3>
            <span className="text-[9px] font-mono text-text-secondary border border-border bg-surface px-1.5 py-0.5 rounded">12-MO OUTLOOK</span>
          </div>
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} vertical={false} />
                <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} stroke={chartTheme.textSecondary} fontSize={10} fontFamily="monospace" tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v/1000}k`} stroke={chartTheme.textSecondary} fontSize={10} fontFamily="monospace" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.surface, border: `1px solid ${chartTheme.border}`, borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: chartTheme.textPrimary }}
                  formatter={(val) => formatCurrency(val)}
                  labelFormatter={(val) => `Month ${val}`}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: chartTheme.textSecondary }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke={chartTheme.success} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="totalCosts" name="Costs" stroke={chartTheme.danger} strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background border border-border p-5 rounded relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">Cash Position</h3>
            <span className="text-[9px] font-mono text-text-secondary border border-border bg-surface px-1.5 py-0.5 rounded">TREASURY</span>
          </div>
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} vertical={false} />
                <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} stroke={chartTheme.textSecondary} fontSize={10} fontFamily="monospace" tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v/1000}k`} stroke={chartTheme.textSecondary} fontSize={10} fontFamily="monospace" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: chartTheme.surface, border: `1px solid ${chartTheme.border}`, borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: chartTheme.textPrimary }}
                  formatter={(val) => formatCurrency(val)}
                  labelFormatter={(val) => `Month ${val}`}
                />
                <Area type="monotone" dataKey="cashBalance" name="Cash Balance" stroke={chartTheme.primary} fill="url(#colorCash)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <hr className="border-border my-12" />

      {/* AI Insights */}
      <div className="bg-surface border border-border p-6 lg:p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Lightbulb size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10 border-b border-border/50 pb-4">
          <div>
            <h2 className="text-[12px] font-mono text-secondary uppercase tracking-widest mb-1 flex items-center gap-2"><span className="w-2 h-2 bg-secondary animate-pulse"/> Diagnostic Analysis</h2>
            <p className="text-xs text-text-secondary">AI-generated interpretation of simulation telemetry.</p>
          </div>
          {!insights && (
            <button 
              onClick={onGenerateInsights}
              disabled={isGeneratingInsights}
              className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded text-xs font-mono font-bold uppercase tracking-wider hover:bg-secondary/20 transition-colors flex items-center gap-2"
            >
              {isGeneratingInsights ? 'Computing...' : 'Run Diagnostics'}
            </button>
          )}
        </div>

        {!insights ? (
          <div className="p-8 border border-border border-dashed rounded bg-background/50 text-center relative z-10">
            <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">Awaiting command to execute scenario diagnostics.</p>
          </div>
        ) : (
          <div className="space-y-10 relative z-10">
            <div className="bg-background border-l-2 border-secondary p-5 rounded-r">
              <p className="text-sm font-mono text-text-primary leading-relaxed">{insights.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div>
                <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-4 border-b border-border/50 pb-2 flex items-center gap-2">Δ Key Variables</h3>
                <div className="space-y-3">
                  {insights.keyChanges?.map((change, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 bg-background border border-border rounded">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                        <span className="font-mono text-xs text-text-primary uppercase shrink-0 min-w-[140px]">{change.metric}</span>
                        <span className="font-mono text-[10px] text-secondary">{change.change}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary">{change.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-4 border-b border-border/50 pb-2 flex items-center gap-2 text-danger">! Risk Vectors</h3>
                  <div className="space-y-3">
                    {insights.risks?.map((risk, i) => (
                      <div key={i} className="bg-background p-3 border-l-2 border-danger rounded-r">
                        <p className="font-mono text-xs text-danger mb-1 uppercase">{risk.title}</p>
                        <p className="text-[10px] text-text-secondary">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-4 border-b border-border/50 pb-2 flex items-center gap-2 text-primary">★ Strategic Actions</h3>
                  <div className="space-y-3">
                    {insights.recommendations?.map((rec, i) => (
                      <div key={i} className="bg-background p-3 border-l-2 border-primary rounded-r">
                        <p className="font-mono text-xs text-primary mb-1 uppercase">{rec.title}</p>
                        <p className="text-[10px] text-text-secondary">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DigitalTwinContent;
