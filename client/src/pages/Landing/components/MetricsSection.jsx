import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function MetricsSection() {
  const container = useRef(null);
  
  const metrics = [
    { target: 10, suffix: "+", label: "AI-Powered Modules" },
    { target: 50, suffix: "+", label: "Decision Signals" },
    { target: 1, suffix: "", label: "Unified Workspace" },
    { target: null, suffix: "∞", label: "Ideas to Explore" }
  ];

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = gsap.utils.toArray('.metric-item');
    
    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      items.forEach(item => {
        const numEl = item.querySelector('.metric-num');
        if (numEl && numEl.dataset.target) {
          numEl.innerText = numEl.dataset.target;
        }
      });
      return;
    }

    gsap.set(items, { opacity: 0, y: 30 });

    ScrollTrigger.batch(items, {
      start: 'top 85%',
      once: true,
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          onStart() {
            elements.forEach(el => {
              const numEl = el.querySelector('.metric-num');
              if (numEl && numEl.dataset.target) {
                const targetVal = parseFloat(numEl.dataset.target);
                gsap.fromTo(numEl, 
                  { innerText: 0 },
                  { innerText: targetVal, duration: 1.5, ease: 'power2.out', snap: { innerText: 1 } }
                );
              }
            });
          }
        });
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 bg-background border-b border-border">
      <div className="max-w-[1650px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:divide-x divide-border">
         {metrics.map((m, i) => (
           <div 
             key={m.label}
             className="metric-item text-center px-4"
           >
              <div className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
                {m.target !== null ? (
                  <span className="metric-num" data-target={m.target}>0</span>
                ) : null}
                <span>{m.suffix}</span>
              </div>
              <div className="text-text-secondary text-xs font-semibold tracking-[0.15em] uppercase">{m.label}</div>
           </div>
         ))}
      </div>
    </section>
  );
}
