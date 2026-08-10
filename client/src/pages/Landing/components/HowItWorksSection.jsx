import { motion } from 'framer-motion';
import { Lightbulb, Target, Activity, FileText, Code, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: "Submit Your Idea",
    desc: "Describe your vision and target market.",
    viz: "Input Interface"
  },
  {
    icon: Target,
    title: "AI Market Validation",
    desc: "Deep competitor and opportunity analysis.",
    viz: "Market Graph"
  },
  {
    icon: Activity,
    title: "Startup DNA Score",
    desc: "Proprietary metric assessing viability.",
    viz: "DNA Metric"
  },
  {
    icon: FileText,
    title: "AI Business Builder",
    desc: "Generate financial models and plans.",
    viz: "Financial Chart"
  },
  {
    icon: Code,
    title: "MVP & Branding",
    desc: "Automated feature roadmaps and assets.",
    viz: "Product UI"
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    desc: "Execution signals and growth intelligence.",
    viz: "Growth Chart"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 px-6 bg-background relative border-b border-border">
      <div className="max-w-[1650px] mx-auto">
        <div className="mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">The Operating System for Growth</h2>
          <p className="text-text-secondary text-lg max-w-2xl text-center">A unified, intelligent pipeline that replaces fragmented startup tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-surface border border-border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 hover:brightness-[0.98] dark:hover:brightness-110 hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <step.icon size={24} />
                </div>
                <span className="text-text-secondary font-display font-bold text-xl opacity-50">0{i + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
              <p className="text-text-secondary text-sm mb-8">{step.desc}</p>
              
              {/* Abstract miniature visualization */}
              <div className="h-24 rounded-lg bg-background border border-border flex flex-col justify-end p-3 overflow-hidden group-hover:border-primary/20 transition-colors relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {i % 2 === 0 ? (
                   <div className="space-y-2 w-full">
                     <div className="h-2 bg-border rounded w-3/4 group-hover:w-full transition-all duration-500 delay-100" />
                     <div className="h-2 bg-border rounded w-1/2 group-hover:w-3/4 transition-all duration-500 delay-200" />
                     <div className="h-2 bg-border rounded w-5/6 group-hover:w-4/5 transition-all duration-500 delay-300" />
                   </div>
                ) : (
                   <div className="flex items-end justify-between w-full h-full gap-1 pt-4">
                     {[40, 70, 45, 90, 65, 100].map((h, j) => (
                       <div key={j} className="w-full bg-primary/40 rounded-t-sm transition-all duration-500 group-hover:bg-primary/80" style={{ height: `${h}%`, transitionDelay: `${j * 50}ms` }} />
                     ))}
                   </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
