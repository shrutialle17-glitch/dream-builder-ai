import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const timeline = ['IDEA', 'VALIDATE', 'PLAN', 'BUILD', 'LAUNCH', 'SCALE'];

export default function FounderJourneySection() {
  const container = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = gsap.utils.toArray('.journey-node');
    
    if (prefersReducedMotion) {
      gsap.set(nodes, { opacity: 1, scale: 1 });
      gsap.set('.progress-line-active', { scaleX: 1, scaleY: 1 });
      return;
    }

    gsap.set(nodes, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        once: true
      }
    });

    tl.to(nodes, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' });

    // Scroll-scrubbed progress line
    gsap.fromTo('.progress-line-active-desktop', 
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      }
    );

    gsap.fromTo('.progress-line-active-mobile', 
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      }
    );

    // Color nodes as the line passes them
    nodes.forEach((node, i) => {
      gsap.to(node.querySelector('.journey-dot'), {
        backgroundColor: 'hsl(190 100% 42%)', // primary
        boxShadow: '0 0 10px rgba(0,184,217,0.5)',
        scrollTrigger: {
          trigger: container.current,
          start: `top ${50 - (i * 10)}%`, // Approximate trigger points
          end: `bottom center`,
          scrub: true
        }
      });
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-6 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-sm font-medium text-text-secondary tracking-widest mb-16 uppercase">The Standardized Journey</h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-[14px] left-0 w-full h-[1px] bg-border z-0" />
           <div className="progress-line-active-desktop hidden md:block absolute top-[14px] left-0 w-full h-[2px] bg-primary z-0 shadow-[0_0_10px_rgba(0,184,217,0.5)]" />
           
           {/* Connecting Line (Mobile) */}
           <div className="md:hidden absolute top-0 left-1/2 w-[1px] h-full bg-border z-0" />
           <div className="progress-line-active-mobile md:hidden absolute top-0 left-1/2 w-[2px] h-full bg-primary z-0 shadow-[0_0_10px_rgba(0,184,217,0.5)]" />
           
           {timeline.map((step, i) => (
             <div 
               key={step}
               className="journey-node relative z-10 flex flex-col items-center bg-background md:px-4 py-2 group cursor-default"
             >
                <div className="journey-dot w-3 h-3 rounded-full bg-border mb-3 transition-colors duration-300 ring-4 ring-background" />
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary tracking-wider transition-colors">{step}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
