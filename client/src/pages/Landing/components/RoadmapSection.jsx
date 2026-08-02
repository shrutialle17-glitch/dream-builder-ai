import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const stages = [
  "Idea",
  "Validation",
  "Business",
  "Funding",
  "Launch",
  "Growth",
  "Scale",
  "Global Startup"
];

export default function RoadmapSection() {
  return (
    <section className="py-24 px-6 bg-surface border-b border-border overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold text-text-primary mb-16">The Founder Journey</h2>
        
        <div className="flex flex-col items-center">
          {stages.map((stage, index) => (
            <motion.div 
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="px-8 py-4 rounded-xl bg-background border border-border shadow-sm shadow-primary/5 text-lg font-display font-medium text-text-primary">
                {stage}
              </div>
              
              {index < stages.length - 1 && (
                <div className="h-16 w-px bg-gradient-to-b from-primary to-primary/0 my-4 relative flex justify-center">
                  <motion.div 
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 text-primary"
                  >
                    <ArrowDown size={16} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
