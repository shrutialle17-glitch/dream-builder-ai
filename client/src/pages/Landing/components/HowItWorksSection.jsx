import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
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
  const container = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gsap.utils.toArray('.step-card');
    
    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.set('.viz-bar', { width: '100%' });
      gsap.set('.viz-chart-bar', { height: (i, target) => target.dataset.h + '%' });
      return;
    }

    gsap.set(cards, { opacity: 0, y: 60 });

    // Scrubbed timeline: as you scroll, it plays through the stagger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 60%',
        end: 'bottom 80%', // The animation finishes when the bottom of section hits 80%
        scrub: 0.5, // Smooth scrubbing
      }
    });

    cards.forEach((card, i) => {
      // Each card fades in sequentially
      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        onStart: () => {
          // Trigger internal animations once the card starts revealing
          const bars = card.querySelectorAll('.viz-bar');
          if (bars.length) {
            gsap.fromTo(bars,
              { width: '0%' },
              { width: (idx, target) => target.dataset.w, duration: 1, stagger: 0.15, ease: 'power2.out' }
            );
          }

          const chartBars = card.querySelectorAll('.viz-chart-bar');
          if (chartBars.length) {
            gsap.fromTo(chartBars,
              { height: '0%' },
              { height: (idx, target) => target.dataset.h + '%', duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }
            );
          }
        }
      }, i * 0.4); // Overlapping sequence
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-6 bg-background relative border-b border-border">
      <div className="max-w-[1650px] mx-auto">
        <div className="mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">The Operating System for Growth</h2>
          <p className="text-text-secondary text-lg max-w-2xl text-center">A unified, intelligent pipeline that replaces fragmented startup tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div 
              key={i}
              className="step-card group relative bg-surface/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(0,184,217,0.15)] hover:border-primary/40 overflow-hidden"
            >
              {/* Premium Glow effect */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <step.icon size={22} />
                  </div>
                  <span className="text-text-secondary font-display font-bold text-xl opacity-30 group-hover:opacity-60 transition-opacity">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-white transition-colors">{step.title}</h3>
                <p className="text-text-secondary text-sm mb-8 leading-relaxed">{step.desc}</p>
                
                {/* Abstract miniature visualization */}
                <div className="h-24 rounded-xl bg-background/50 border border-white/5 flex flex-col justify-end p-4 overflow-hidden group-hover:border-primary/20 transition-colors relative shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {i % 2 === 0 ? (
                     <div className="space-y-2 w-full relative z-10">
                       <div className="viz-bar h-1.5 bg-border rounded-full group-hover:bg-primary/60 transition-colors duration-500" data-w="75%" />
                       <div className="viz-bar h-1.5 bg-border rounded-full group-hover:bg-primary/40 transition-colors duration-500" data-w="50%" />
                       <div className="viz-bar h-1.5 bg-border rounded-full group-hover:bg-primary/80 transition-colors duration-500" data-w="85%" />
                     </div>
                  ) : (
                     <div className="flex items-end justify-between w-full h-full gap-1.5 pt-4 relative z-10">
                       {[40, 70, 45, 90, 65, 100].map((h, j) => (
                         <div key={j} className="viz-chart-bar w-full bg-border rounded-t-sm group-hover:bg-primary/70 transition-colors duration-500" data-h={h} />
                       ))}
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
