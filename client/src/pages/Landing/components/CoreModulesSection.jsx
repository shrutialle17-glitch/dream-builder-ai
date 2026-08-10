import { motion } from 'framer-motion';

export default function CoreModulesSection() {
  return (
    <section className="py-32 px-6 bg-background border-b border-border">
      <div className="max-w-[1650px] mx-auto">
        <div className="mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">Core Intelligence Modules</h2>
          <p className="text-text-secondary text-lg max-w-2xl text-center">Proprietary engines working in sync to architect your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Module: DNA Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-surface border border-border rounded-3xl p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
               <div className="w-64 h-64 border-[1px] border-primary rounded-full blur-3xl" />
            </div>
            
            <h3 className="text-3xl font-display font-bold text-text-primary mb-2 relative z-10">Startup DNA Score™</h3>
            <p className="text-text-secondary mb-12 max-w-md relative z-10">Our proprietary algorithm analyzes over 50 data points to calculate your execution readiness, market risk, and demand potential.</p>

            <div className="flex flex-col sm:flex-row gap-8 items-center bg-background border border-border rounded-2xl p-6 relative z-10">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-border border-t-primary border-r-primary rotate-45 group-hover:rotate-[225deg] transition-transform duration-1000 ease-out flex-shrink-0">
                 <div className="absolute inset-0 flex items-center justify-center -rotate-45 group-hover:-rotate-[225deg] transition-transform duration-1000 ease-out">
                   <div className="text-center">
                     <span className="text-3xl font-bold text-text-primary">87</span>
                     <span className="text-xs text-text-secondary block">/ 100</span>
                   </div>
                 </div>
              </div>
              <div className="flex-1 w-full space-y-4">
                {['Market Fit', 'Execution Risk', 'Demand Signals'].map((metric, i) => (
                  <div key={metric}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{metric}</span>
                      <span className="text-text-primary font-medium">Excellent</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-0 group-hover:w-[85%] transition-all duration-1000 delay-300" style={{ width: i === 1 ? '70%' : i === 2 ? '92%' : '85%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Standard Module 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-border rounded-3xl p-8 hover:brightness-[0.98] dark:hover:brightness-110 transition-all group"
          >
            <h3 className="text-xl font-bold text-text-primary mb-2">Market Validation</h3>
            <p className="text-text-secondary text-sm mb-8">Real-time competitor tracking and TAM/SAM/SOM generation.</p>
            <div className="h-32 bg-background rounded-xl border border-border p-4 flex flex-col justify-end group-hover:border-primary/30 transition-colors">
               <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(0,184,217,0.5)]">
                 <path d="M0,40 L20,30 L40,35 L60,15 L80,20 L100,5" fill="none" stroke="#00B8D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-dasharray-100 stroke-dashoffset-100 group-hover:stroke-dashoffset-0 transition-all duration-1000" />
               </svg>
            </div>
          </motion.div>

          {/* More modules */}
          {[
            { title: "Financial Planner", desc: "Automated 3-year revenue projections and CapTable structuring.", type: "bar" },
            { title: "Brand Architect", desc: "Generate cohesive brand identities, colors, and design systems.", type: "color" },
            { title: "Pitch Deck Gen", desc: "Investor-ready slide decks constructed from your DNA data.", type: "grid" }
          ].map((mod, i) => (
             <motion.div 
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-3xl p-8 hover:brightness-[0.98] dark:hover:brightness-110 transition-all group"
            >
              <h3 className="text-xl font-bold text-text-primary mb-2">{mod.title}</h3>
              <p className="text-text-secondary text-sm mb-8">{mod.desc}</p>
              <div className="h-24 bg-background rounded-xl border border-border p-4 flex gap-2 items-end justify-between group-hover:border-primary/30 transition-colors">
                 {mod.type === 'bar' && [40, 60, 30, 80, 50, 90].map((h, j) => <div key={j} className="w-full bg-border rounded-t-sm group-hover:bg-secondary transition-colors" style={{ height: `${h}%`, transitionDelay: `${j * 50}ms` }} />)}
                 {mod.type === 'color' && <div className="w-full h-full flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary" />
                    <div className="w-8 h-8 rounded-full bg-secondary" />
                    <div className="w-8 h-8 rounded-full bg-text-primary" />
                 </div>}
                 {mod.type === 'grid' && <div className="w-full h-full grid grid-cols-2 gap-2">
                    <div className="bg-border rounded-md group-hover:bg-primary/20 transition-colors" />
                    <div className="bg-border rounded-md group-hover:bg-primary/20 transition-colors" />
                 </div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
