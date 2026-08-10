import { motion } from 'framer-motion';

export default function ProductPreviewSection() {
  return (
    <section className="py-32 px-6 bg-background border-b border-border overflow-hidden">
      <div className="max-w-[1650px] mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">One Workspace.<br/>Your Entire Startup.</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-20">Stop switching between 15 different tools. Manage ideation, validation, financials, and launch in one executive dashboard.</p>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-surface shadow-[0_30px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
           {/* Fake Mac Header */}
           <div className="h-8 bg-background border-b border-border flex items-center px-4 gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
             <div className="w-3 h-3 rounded-full bg-green-500/80" />
           </div>
           
           {/* Dashboard Content Fake UI */}
           <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-background">
              <div className="md:col-span-3 space-y-4">
                 <div className="h-32 bg-surface rounded-xl border border-border p-4 flex flex-col justify-between group hover:border-primary/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">AI</div>
                    <div>
                      <div className="text-text-primary font-bold text-xl">87/100</div>
                      <div className="text-text-secondary text-xs">DNA Score</div>
                    </div>
                 </div>
                 <div className="h-48 bg-surface rounded-xl border border-border p-4 group hover:border-primary/30 transition-colors">
                    <div className="text-text-primary text-sm mb-4">Task Roadmap</div>
                    <div className="space-y-3">
                       <div className="h-2 bg-border rounded w-full group-hover:bg-primary/50 transition-colors" />
                       <div className="h-2 bg-border rounded w-3/4 group-hover:bg-primary/50 transition-colors" />
                       <div className="h-2 bg-border rounded w-5/6 group-hover:bg-primary/50 transition-colors" />
                    </div>
                 </div>
              </div>
              <div className="md:col-span-9 space-y-6">
                 <div className="h-48 bg-surface rounded-xl border border-border p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="text-text-primary text-sm mb-2 relative z-10">Market Growth Projection</div>
                    <svg viewBox="0 0 100 30" className="w-full h-full absolute bottom-0 left-0 pt-10" preserveAspectRatio="none">
                      <path d="M0,30 L20,20 L40,26 L60,10 L80,15 L100,2 L100,30 Z" fill="rgba(0,184,217,0.1)" className="transition-all duration-1000 group-hover:fill-primary/20" />
                      <path d="M0,30 L20,20 L40,26 L60,10 L80,15 L100,2" fill="none" stroke="#00B8D9" strokeWidth="1" className="stroke-dasharray-100 stroke-dashoffset-100 group-hover:stroke-dashoffset-0 transition-all duration-1000 delay-100" />
                    </svg>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-surface rounded-xl border border-border p-4 group hover:border-primary/30 transition-colors">
                       <div className="text-text-primary text-sm mb-4">Competitor Analysis</div>
                       <div className="flex gap-2">
                          <div className="w-10 h-10 rounded-lg bg-border group-hover:bg-primary/20 transition-colors" />
                          <div className="w-10 h-10 rounded-lg bg-border group-hover:bg-primary/20 transition-colors" />
                          <div className="w-10 h-10 rounded-lg bg-border group-hover:bg-primary/20 transition-colors" />
                       </div>
                    </div>
                    <div className="h-32 bg-surface rounded-xl border border-border p-4 group hover:border-primary/30 transition-colors">
                       <div className="text-text-primary text-sm mb-4">Revenue Model</div>
                       <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                          <div className="w-0 group-hover:w-[60%] h-full bg-primary transition-all duration-1000" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
