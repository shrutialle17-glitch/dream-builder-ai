import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, ShieldCheck, TrendingUp, Target } from 'lucide-react';

const growthData = [
  { name: 'M1', value: 10 }, { name: 'M2', value: 25 }, { name: 'M3', value: 45 },
  { name: 'M4', value: 85 }, { name: 'M5', value: 140 }, { name: 'M6', value: 210 }
];

const radarData = [
  { subject: 'Market', A: 85, fullMark: 100 },
  { subject: 'Product', A: 70, fullMark: 100 },
  { subject: 'Team', A: 90, fullMark: 100 },
  { subject: 'Traction', A: 60, fullMark: 100 },
  { subject: 'Defensibility', A: 75, fullMark: 100 },
];

export default function InteractiveDashboard() {
  return (
    <section className="py-24 px-6 bg-surface relative overflow-hidden border-y border-border">
      {/* Background ambient light */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1650px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-6">Interactive AI Dashboard Preview</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">Not just text generation. Experience a Bloomberg-style command center for your startup's execution metrics.</p>
        </div>

        {/* Dashboard Window Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-2xl border border-border bg-background shadow-2xl shadow-primary/5 overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="h-12 bg-surface-bright border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/80" />
              <div className="w-3 h-3 rounded-full bg-secondary/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            <div className="mx-auto bg-background px-4 py-1 rounded-md text-xs font-mono text-text-secondary border border-border">
              project_terminal / my-startup-id / metrics
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* DNA Score Card */}
              <div className="p-5 bg-surface border border-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary flex items-center gap-2">
                    <Activity size={16} className="text-primary" /> Startup DNA Score
                  </h4>
                  <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-md">V_1.2.0</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-display font-bold text-text-primary">84</span>
                  <span className="text-success text-sm font-medium mb-1">Top 15%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[84%]" />
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface border border-border rounded-xl">
                  <ShieldCheck size={16} className="text-text-secondary mb-2" />
                  <p className="text-xs text-text-secondary mb-1">Investment Readiness</p>
                  <p className="text-lg font-semibold text-text-primary">High</p>
                </div>
                <div className="p-4 bg-surface border border-border rounded-xl">
                  <Target size={16} className="text-text-secondary mb-2" />
                  <p className="text-xs text-text-secondary mb-1">Market Confidence</p>
                  <p className="text-lg font-semibold text-text-primary">92%</p>
                </div>
              </div>
            </div>

            {/* Middle Column - Chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-surface border border-border rounded-xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-text-primary flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" /> Growth Forecast & Execution Progress
                  </h4>
                </div>
                <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252b2d" vertical={false} />
                      <XAxis dataKey="name" stroke="#869397" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#869397" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0e1416', border: '1px solid #3c494d', borderRadius: '8px' }}
                        itemStyle={{ color: '#48d7f9' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#48d7f9" strokeWidth={2} dot={{ fill: '#0e1416', stroke: '#48d7f9', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
