import { motion } from 'framer-motion';

const timeline = ['IDEA', 'VALIDATE', 'PLAN', 'BUILD', 'LAUNCH', 'SCALE'];

export default function FounderJourneySection() {
  return (
    <section className="py-24 px-6 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-sm font-medium text-text-secondary tracking-widest mb-16 uppercase">The Standardized Journey</h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-[14px] left-0 w-full h-[1px] bg-border z-0" />
           {/* Connecting Line (Mobile) */}
           <div className="md:hidden absolute top-0 left-1/2 w-[1px] h-full bg-border z-0" />
           
           {timeline.map((step, i) => (
             <motion.div 
               key={step}
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="relative z-10 flex flex-col items-center bg-background md:px-4 py-2 group cursor-default"
             >
                <div className="w-3 h-3 rounded-full bg-border mb-3 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(0,184,217,0.5)] transition-all duration-300 ring-4 ring-background" />
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary tracking-wider transition-colors">{step}</span>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
