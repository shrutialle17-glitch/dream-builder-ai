import { motion } from 'framer-motion';

const team = [
  { role: "CTO", desc: "Architecture & Stack", pos: "top-10 left-4 md:top-20 md:left-20" },
  { role: "CMO", desc: "GTM & Positioning", pos: "top-10 right-4 md:top-20 md:right-20" },
  { role: "CFO", desc: "Financial Modeling", pos: "bottom-10 left-4 md:bottom-20 md:left-20" },
  { role: "CPO", desc: "Product Strategy", pos: "bottom-10 right-4 md:bottom-20 md:right-20" }
];

export default function AITeamSection() {
  return (
    <section className="py-32 px-6 bg-background border-b border-border overflow-hidden">
      <div className="max-w-[1650px] mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">Your AI Startup Team</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-20">Specialized intelligence working together to build your startup.</p>

        <div className="relative max-w-[1650px] mx-auto h-[400px] md:h-[500px] flex items-center justify-center">
           {/* Central Node */}
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             className="relative z-20 w-40 h-40 md:w-48 md:h-48 rounded-full bg-surface border border-primary flex items-center justify-center shadow-[0_0_40px_rgba(0,184,217,0.15)]"
           >
              <div className="text-center">
                 <img src="/assets/images/logo.png" alt="Logo" className="h-10 md:h-12 mx-auto mb-2 opacity-80" style={{ filter: 'var(--logo-filter)' }} />
                 <span className="font-display font-bold text-text-primary tracking-widest text-xs md:text-sm">CORE</span>
              </div>
           </motion.div>

           {/* Connection Lines & Agent Nodes */}
           {team.map((agent, i) => (
             <motion.div
               key={agent.role}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 + (i * 0.1) }}
               className={`absolute ${agent.pos} z-10`}
             >
                <div className="bg-surface border border-border rounded-xl p-3 md:p-4 w-32 md:w-40 text-center md:text-left shadow-lg hover:border-primary/50 transition-colors group cursor-default">
                  <div className="text-primary font-bold text-base md:text-lg mb-1">{agent.role}</div>
                  <div className="text-text-secondary text-[10px] md:text-xs leading-tight">{agent.desc}</div>
                </div>
             </motion.div>
           ))}

           {/* Animated SVG Lines Background */}
           <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none">
              <circle cx="50%" cy="50%" r="180" fill="none" stroke="#00B8D9" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_60s_linear_infinite]" />
              <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />
           </svg>
        </div>
      </div>
    </section>
  );
}
