import { motion } from 'framer-motion';

export default function MetricsSection() {
  const metrics = [
    { value: "10+", label: "AI-Powered Modules" },
    { value: "50+", label: "Decision Signals" },
    { value: "1", label: "Unified Workspace" },
    { value: "∞", label: "Ideas to Explore" }
  ];

  return (
    <section className="py-24 px-6 bg-background border-b border-border">
      <div className="max-w-[1650px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:divide-x divide-border">
         {metrics.map((m, i) => (
           <motion.div 
             key={m.label}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
             className="text-center px-4"
           >
              <div className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">{m.value}</div>
              <div className="text-text-secondary text-xs font-semibold tracking-[0.15em] uppercase">{m.label}</div>
           </motion.div>
         ))}
      </div>
    </section>
  );
}
