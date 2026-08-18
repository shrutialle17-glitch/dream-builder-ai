import React from 'react';
import { Target, Smile, MessageSquare, Compass, Hash, Palette, Type, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BrandingContent = ({ branding, startupName = 'Startup Name' }) => {
  const { 
    positioning, 
    personality, 
    voice, 
    archetype, 
    visualDirection, 
    colorPalette, 
    typography,
    taglines,
    messaging,
    dos,
    donts
  } = branding;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard`);
  };

  const renderRatingDots = (strength) => {
    // Assuming strength is out of 100
    const outOf5 = Math.round(strength / 20);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <div 
            key={val} 
            className={`w-2 h-2 rounded-full ${val <= outOf5 ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-8">
      
      {/* Visual Identity - Moved to top to be the primary visual anchor */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-6">Visual Identity</h2>
        
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Color System</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {colorPalette?.map((color, idx) => (
                <div 
                  key={idx} 
                  className="group cursor-pointer flex flex-col"
                  onClick={() => copyToClipboard(color.hex)}
                >
                  <div 
                    className="w-full h-32 md:h-48 rounded-2xl shadow-sm border border-border/50 mb-3 transition-transform group-hover:scale-[1.02] group-hover:shadow-md flex items-end p-4" 
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-mono font-medium text-text-primary">Click to copy</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-bold text-text-primary">{color.name}</p>
                    <p className="text-sm font-mono text-text-secondary uppercase mt-0.5">{color.hex}</p>
                    <p className="text-xs text-text-secondary mt-2 opacity-80">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-border">
            <div className="bg-surface/30 border-2 border-dashed border-border/50 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8 flex items-center gap-2"><Type size={16} className="text-primary"/> Typography Board</h3>
              <div className="space-y-10 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Heading Typeface</p>
                    <p className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{typography?.heading}</p>
                  </div>
                  <p 
                    className="text-5xl md:text-6xl font-bold text-text-primary truncate tracking-tight" 
                    style={{ fontFamily: typography?.heading ? `"${typography.heading}", sans-serif` : undefined }}
                  >
                    Aa
                  </p>
                  <p 
                    className="text-3xl font-bold text-text-primary/70 truncate mt-2" 
                    style={{ fontFamily: typography?.heading ? `"${typography.heading}", sans-serif` : undefined }}
                  >
                    {startupName}
                  </p>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-border/50 to-transparent my-6"></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Body Typeface</p>
                    <p className="text-xs font-mono text-text-primary bg-surface border border-border px-2 py-0.5 rounded">{typography?.body}</p>
                  </div>
                  <p 
                    className="text-lg text-text-primary leading-relaxed max-w-sm"
                    style={{ fontFamily: typography?.body ? `"${typography.body}", sans-serif` : undefined }}
                  >
                    The quick brown fox jumps over the lazy dog. A strong brand needs clear, legible typography for paragraph reading.
                  </p>
                </div>
                {typography?.reason && (
                  <p className="text-xs text-text-secondary mt-6 border-l-2 border-primary/30 pl-4 italic">
                    {typography.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] bg-background border border-border rounded-2xl p-8 shadow-inner relative">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8 flex items-center gap-2"><Palette size={16} className="text-secondary"/> Art Direction Canvas</h3>
              <div className="space-y-8 relative z-10 bg-surface/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">Mood & Vibe</p>
                  <p className="text-xl font-display font-medium text-text-primary italic">"{visualDirection?.mood}"</p>
                </div>
                <div className="h-px w-full bg-border/50"></div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-3">Design Principles</p>
                  <ul className="grid grid-cols-1 gap-2">
                    {visualDirection?.principles?.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 bg-background/50 border border-border/50 px-3 py-2 rounded-lg text-sm text-text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-px w-full bg-border/50"></div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-3">UI & Imagery Guide</p>
                  <p className="text-sm text-text-primary mb-3 leading-relaxed bg-background/50 p-3 rounded-lg border-l-2 border-l-secondary"><strong className="text-secondary font-medium block mb-1">UI Style:</strong> {visualDirection?.uiDirection}</p>
                  <p className="text-sm text-text-primary leading-relaxed bg-background/50 p-3 rounded-lg border-l-2 border-l-primary"><strong className="text-primary font-medium block mb-1">Photography:</strong> {visualDirection?.imagery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-border my-12" />

      {/* Messaging / Positioning */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-6">Positioning & Messaging</h2>
        
        <div className="space-y-8">
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-3">One-Liner</p>
            <p className="text-2xl md:text-3xl font-medium text-text-primary leading-tight">{messaging?.oneLiner}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2">Target Audience</p>
              <p className="text-base text-text-primary">{positioning?.targetAudience}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2">Value Proposition</p>
              <p className="text-base text-text-primary">{positioning?.value}</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-3">Elevator Pitch</p>
            <p className="text-lg text-text-primary leading-relaxed max-w-4xl">{messaging?.elevatorPitch}</p>
          </div>
        </div>
      </div>

      <hr className="border-border my-12" />

      {/* Brand Personality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">Personality</h2>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2">Archetype</p>
              <p className="text-xl font-bold text-primary mb-1">{archetype?.name}</p>
              <p className="text-base text-text-secondary">{archetype?.reason}</p>
            </div>
            
            <div className="space-y-5">
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2">Core Traits</p>
              {personality?.map((trait, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-text-primary text-base">{trait.trait}</span>
                    {renderRatingDots(trait.strength)}
                  </div>
                  <p className="text-sm text-text-secondary">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">Voice & Tone</h2>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-3">Tone Matrix</p>
              <div className="flex flex-wrap gap-2">
                {voice?.tone?.map((t, i) => (
                  <span key={i} className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2">Writing Style</p>
              <p className="text-base text-text-primary leading-relaxed">{voice?.style}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <p className="text-xs text-success uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                  <CheckCircle size={14}/> Words to Use
                </p>
                <ul className="text-base text-text-primary space-y-1.5">
                  {voice?.wordsToUse?.map((w, i) => <li key={i} className="flex items-center gap-2"><span className="text-success text-xs">✓</span> {w}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-danger uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                  <XCircle size={14}/> Words to Avoid
                </p>
                <ul className="text-base text-text-secondary space-y-1.5">
                  {voice?.wordsToAvoid?.map((w, i) => <li key={i} className="flex items-center gap-2 line-through opacity-70"><span className="text-danger text-xs no-underline">×</span> {w}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BrandingContent;
