import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const traditional = [
  "Gives static answers",
  "One prompt at a time",
  "No memory of your business",
  "No execution capabilities"
];

const dreambuilder = [
  "Builds actual startups",
  "End-to-End automated workflows",
  "Deep Startup Intelligence context",
  "Continuous guidance & action",
  "Future Vision simulation"
];

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-background relative border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">Why Dream Builder AI</h2>
          <p className="text-xl text-text-secondary">Stop talking to chatbots. Start using an Operating System.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional AI */}
          <div className="p-8 rounded-2xl bg-surface border border-border">
            <h3 className="text-xl font-semibold text-text-secondary mb-6">Traditional AI Tools</h3>
            <ul className="space-y-4">
              {traditional.map((item) => (
                <li key={item} className="flex items-center gap-3 text-text-secondary">
                  <X size={20} className="text-danger flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dream Builder AI */}
          <div className="p-8 rounded-2xl bg-surface border-2 border-primary/30 relative overflow-hidden shadow-[0_0_40px_rgba(0,184,217,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                Dream Builder AI
              </h3>
              <ul className="space-y-4">
                {dreambuilder.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                    <Check size={20} className="text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
