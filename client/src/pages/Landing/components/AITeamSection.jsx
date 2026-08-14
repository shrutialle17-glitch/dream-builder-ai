import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Logo from '../../../components/common/Logo';
import { Code2, Target, TrendingUp, PieChart } from 'lucide-react';

const team = [
  { role: "CTO", desc: "Architecture & Stack", Icon: Code2, pos: "top-4 left-4 md:top-[12%] md:left-[5%]" },
  { role: "CMO", desc: "GTM & Positioning", Icon: Target, pos: "top-4 right-4 md:top-[12%] md:right-[5%]" },
  { role: "CFO", desc: "Financial Modeling", Icon: PieChart, pos: "bottom-4 left-4 md:bottom-[12%] md:left-[5%]" },
  { role: "CPO", desc: "Product Strategy", Icon: TrendingUp, pos: "bottom-4 right-4 md:bottom-[12%] md:right-[5%]" }
];

export default function AITeamSection() {
  const container = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set('.core-node', { scale: 1, opacity: 1 });
      gsap.set('.agent-node', { opacity: 1, y: 0 });
      return;
    }

    gsap.set('.core-node', { scale: 0.8, opacity: 0 });
    gsap.set('.agent-node', { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        once: true,
      }
    });

    tl.to('.core-node', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' })
      .to('.agent-node', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, '-=0.4');

    // Continuous slow rotation for the orbit lines
    gsap.to('.orbit-ring', {
      rotation: 360,
      transformOrigin: '50% 50%',
      duration: 60,
      repeat: -1,
      ease: 'none'
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-6 bg-background border-b border-border overflow-hidden">
      <div className="max-w-[1650px] mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-4">Your AI Startup Team</h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-20">Specialized intelligence working together to build your startup.</p>

        <div className="relative max-w-[1000px] mx-auto h-[450px] md:h-[600px] flex items-center justify-center">
           {/* Central Node */}
           <div className="core-node relative z-20 w-48 h-48 md:w-56 md:h-56 rounded-full bg-surface/90 backdrop-blur-md border-2 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(0,184,217,0.3)] text-primary">
              <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
              <div className="text-center relative z-10">
                 <Logo className="h-12 md:h-14 mx-auto mb-3 opacity-90" />
                 <span className="font-display font-bold text-text-primary tracking-[0.2em] text-xs md:text-sm">CORE</span>
              </div>
           </div>

           {/* Connection Lines & Agent Nodes */}
           {team.map((agent, i) => (
             <div
               key={agent.role}
               className={`agent-node absolute ${agent.pos} z-30`}
             >
                <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 w-36 md:w-52 text-left shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-default hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      <agent.Icon size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="text-text-primary font-bold text-sm md:text-lg">{agent.role}</div>
                  </div>
                  <div className="text-text-secondary text-[11px] md:text-sm leading-relaxed">{agent.desc}</div>
                </div>
             </div>
           ))}

           {/* Animated SVG Lines Background */}
           <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <defs>
                <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              <circle cx="50%" cy="50%" r="40%" fill="url(#core-glow)" />
              
              <g className="orbit-ring origin-center">
                <circle cx="50%" cy="50%" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-primary/30" />
                <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="1" />
              </g>

              {/* Crosshairs */}
              <path d="M 50% 10% L 50% 90% M 10% 50% L 90% 50%" stroke="currentColor" className="text-border/40" strokeWidth="1" strokeDasharray="4 4" />
           </svg>
        </div>
      </div>
    </section>
  );
}
