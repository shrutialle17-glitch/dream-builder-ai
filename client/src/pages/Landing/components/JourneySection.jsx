import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  BarChart3, 
  Dna, 
  Briefcase, 
  Palette, 
  Rocket, 
  Presentation, 
  LayoutTemplate,
  Globe2,
  Users
} from 'lucide-react';

const processCards = [
  { icon: Lightbulb, title: 'Submit Your Startup Idea', desc: 'Input your raw concept and target audience.' },
  { icon: BarChart3, title: 'AI Market Validation', desc: 'Real-time competitive analysis and market sizing.' },
  { icon: Dna, title: 'Startup DNA Score', desc: 'Predictive scoring for viability and execution risk.' },
  { icon: Briefcase, title: 'AI Business Builder', desc: 'Automated business models and financial projections.' },
  { icon: Palette, title: 'MVP & Branding', desc: 'Brand identity generation and MVP feature mapping.' },
  { icon: Rocket, title: 'Launch & Scale', desc: 'Go-to-market strategy and execution tracking.' },
];

const features = [
  { icon: Dna, title: 'Startup DNA Score', desc: 'Algorithmic viability prediction based on 50+ data points.' },
  { icon: BarChart3, title: 'Market Validation', desc: 'Automated competitor mapping and TAM/SAM/SOM calculation.' },
  { icon: Briefcase, title: 'Business Plan Generator', desc: 'Bank-ready business plans generated in seconds.' },
  { icon: Palette, title: 'Branding Generator', desc: 'Mission, vision, values, and brand voice architecture.' },
  { icon: Presentation, title: 'Pitch Deck Generator', desc: 'Investor-ready slide outlines and narrative structure.' },
  { icon: LayoutTemplate, title: 'MVP Feature Planner', desc: 'Prioritized product roadmaps and sprint planning.' },
  { icon: Globe2, title: 'Digital Twin Simulation', desc: 'Simulate business decisions before spending money.' },
  { icon: Users, title: 'Multi-Agent AI Team', desc: 'Specialized AI agents acting as your CTO, CMO, and CFO.' },
];

export default function JourneySection() {
  return (
    <section className="py-24 px-6 bg-background relative z-10 border-t border-border/50">
      <div className="max-w-[1650px] mx-auto">
        
        {/* Process Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-6">How Dream Builder AI Works</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">A deterministic, step-by-step pipeline to transform raw ideas into execution-ready business models.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 bg-surface border border-border rounded-2xl hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(0,184,217,0.1)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-background border border-border text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <card.icon size={24} />
                </div>
                <h3 className="text-xl font-display font-semibold text-text-primary mb-3">{i + 1}. {card.title}</h3>
                <p className="text-text-secondary">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">Core Modules</h2>
            <p className="text-text-secondary mt-2">Enterprise-grade tools replacing fragmented startup workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 bg-surface border border-border rounded-xl hover:bg-surface-bright transition-colors flex flex-col gap-4"
              >
                <feat.icon size={20} className="text-primary" />
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">{feat.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
