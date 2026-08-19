import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, MessageSquare, 
  LayoutTemplate, BarChart3, Presentation, 
  Target, Rocket, Users, FileText, Zap
} from 'lucide-react';

const MiniSlidePreview = ({ type, isActive }) => {
  const baseColor = isActive ? 'bg-primary' : 'bg-text-secondary';
  const bgColor = isActive ? 'bg-primary/20 border-primary/40' : 'bg-surface border-border';
  
  const renderLayout = () => {
    switch(type?.toLowerCase()) {
      case 'hero':
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full gap-0.5">
            <div className={`w-3/4 h-1 rounded-sm ${baseColor} opacity-80`} />
            <div className={`w-1/2 h-0.5 rounded-sm ${baseColor} opacity-40`} />
          </div>
        );
      case 'stat-cards':
      case 'metrics':
        return (
          <div className="grid grid-cols-2 gap-0.5 h-full w-full p-0.5">
            <div className={`rounded-sm ${baseColor} opacity-40`} />
            <div className={`rounded-sm ${baseColor} opacity-40`} />
            <div className={`rounded-sm ${baseColor} opacity-40`} />
            <div className={`rounded-sm ${baseColor} opacity-40`} />
          </div>
        );
      case 'timeline':
      case 'roadmap':
        return (
          <div className="flex items-center h-full w-full p-1 relative">
            <div className={`w-full h-0.5 ${baseColor} opacity-60 rounded-full`} />
            <div className={`absolute top-1/2 left-1.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${baseColor}`} />
            <div className={`absolute top-1/2 right-1.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${baseColor}`} />
          </div>
        );
      default:
        // Text list layout
        return (
          <div className="flex flex-col h-full w-full p-1 gap-0.5">
            <div className={`w-1/2 h-0.5 rounded-sm ${baseColor} opacity-80 mb-0.5`} />
            <div className="flex items-center gap-1"><div className={`w-1 h-1 rounded-full ${baseColor}`} /><div className={`w-full h-0.5 rounded-sm ${baseColor} opacity-40`} /></div>
            <div className="flex items-center gap-1"><div className={`w-1 h-1 rounded-full ${baseColor}`} /><div className={`w-5/6 h-0.5 rounded-sm ${baseColor} opacity-40`} /></div>
            <div className="flex items-center gap-1"><div className={`w-1 h-1 rounded-full ${baseColor}`} /><div className={`w-4/5 h-0.5 rounded-sm ${baseColor} opacity-40`} /></div>
          </div>
        );
    }
  };

  return (
    <div className={`w-10 h-[22px] shrink-0 rounded border flex items-center justify-center overflow-hidden ${bgColor}`}>
      {renderLayout()}
    </div>
  );
};

const PitchDeckContent = ({ pitchDeck }) => {
  const { slides, theme } = pitchDeck;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[activeSlideIndex];

  const handleNext = () => {
    if (activeSlideIndex < slides.length - 1) setActiveSlideIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) setActiveSlideIndex(prev => prev - 1);
  };

  const renderVisualData = (type, data) => {
    if (!data || Object.keys(data).length === 0) return null;

    // Normalize data to handle stringified JSON from AI
    let normalizedData = data;
    if (typeof normalizedData === 'string') {
      try { normalizedData = JSON.parse(normalizedData); } catch (e) {}
    }
    
    if (typeof normalizedData === 'object' && normalizedData !== null && !Array.isArray(normalizedData)) {
      // If object has a single key containing a stringified array, unwrap it
      const keys = Object.keys(normalizedData);
      if (keys.length === 1) {
        let val = normalizedData[keys[0]];
        if (typeof val === 'string') {
          try { val = JSON.parse(val); } catch (e) {}
        }
        if (Array.isArray(val)) {
          normalizedData = val;
        }
      } else {
        // Parse stringified values in multiple keys
        const newObj = {};
        for (const [k, v] of Object.entries(normalizedData)) {
          if (typeof v === 'string') {
             try { newObj[k] = JSON.parse(v); } catch(e) { newObj[k] = v; }
          } else {
             newObj[k] = v;
          }
        }
        normalizedData = newObj;
      }
    }

    if (type === 'stat-cards' || type === 'metrics') {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full z-10">
          {Object.entries(normalizedData).map(([key, value], idx) => {
            const displayValue = typeof value === 'object' && value !== null ? (value.value || JSON.stringify(value)) : value;
            const displayLabel = typeof value === 'object' && value !== null && value.label ? value.label : key.replace(/([A-Z])/g, ' $1').trim();
            // Handle numeric index keys from arrays
            const finalLabel = isNaN(displayLabel) ? displayLabel : `Metric ${parseInt(displayLabel) + 1}`;
            
            return (
              <div key={idx} className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col justify-center items-center text-center overflow-hidden">
                <p className="text-[10px] lg:text-xs font-medium opacity-70 mb-1 uppercase tracking-wider">{finalLabel}</p>
                <p className="text-xl lg:text-2xl font-display font-bold leading-tight" style={{ color: theme?.primary || 'var(--primary)' }}>
                  {displayValue}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    
    if (type === 'timeline' || type === 'roadmap') {
      const items = Array.isArray(normalizedData) ? normalizedData : Object.entries(normalizedData).map(([k,v]) => ({ phase: k, details: v }));
      return (
        <div className="flex items-start gap-4 mt-8 w-full z-10 overflow-x-auto pb-4">
          {items.map((item, idx) => {
            const displayPhase = item.phase || `Phase ${idx + 1}`;
            const displayDetails = typeof item.details === 'object' && item.details !== null ? (item.details.description || item.details.title || JSON.stringify(item.details)) : item.details;
            return (
              <div key={idx} className="flex-1 min-w-[160px] bg-black/30 border border-white/10 rounded-xl p-4 relative">
                <div className="w-full h-1 bg-white/20 absolute top-0 left-0 rounded-t-xl" />
                <div className="w-1/3 h-1 absolute top-0 left-0 rounded-tl-xl" style={{ backgroundColor: theme?.primary || 'var(--primary)' }} />
                <p className="text-xs font-bold opacity-70 mb-1 mt-1 uppercase tracking-wider">{displayPhase}</p>
                <p className="text-sm lg:text-base font-medium leading-snug">{displayDetails}</p>
              </div>
            );
          })}
        </div>
      );
    }

    // Fallback simple list rendering instead of raw JSON
    return (
      <div className="mt-8 z-10 grid grid-cols-2 gap-4 w-full">
        {Object.entries(normalizedData).map(([key, value], idx) => (
          <div key={idx} className="bg-black/20 border border-white/5 rounded-lg p-4 overflow-hidden">
            <p className="text-xs opacity-60 uppercase tracking-wider mb-1 truncate">{isNaN(key) ? key.replace(/([A-Z])/g, ' $1').trim() : `Item ${parseInt(key) + 1}`}</p>
            <p className="text-lg font-medium truncate">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col h-[calc(100vh-140px)] min-h-[700px] overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Slide {activeSlideIndex + 1} / {slides.length}</span>
          <span className="text-sm font-semibold text-text-primary capitalize">{activeSlide.slideType}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} disabled={activeSlideIndex === 0} className="p-1.5 rounded bg-background border border-border disabled:opacity-50 hover:bg-surface">
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNext} disabled={activeSlideIndex === slides.length - 1} className="p-1.5 rounded bg-background border border-border disabled:opacity-50 hover:bg-surface">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Slide Nav */}
        <div className="w-48 lg:w-64 border-r border-border bg-background/30 overflow-y-auto hidden sm:block shrink-0 p-3 space-y-2">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-sm flex items-start gap-3 ${
                idx === activeSlideIndex 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'bg-surface border-border text-text-secondary hover:border-text-secondary/30 hover:text-text-primary'
              }`}
            >
              <div className="mt-0.5">
                <MiniSlidePreview type={slide.visualType || slide.slideType} isActive={idx === activeSlideIndex} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{slide.title}</p>
                <p className="text-xs opacity-70 mt-0.5 capitalize truncate">{slide.slideType}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Center Panel: Large Preview & Notes */}
        <div className="flex-1 flex flex-col bg-background/50 p-4 lg:p-8 relative overflow-y-auto items-center justify-start">
          <div 
            className="w-full aspect-video min-h-[400px] max-w-4xl rounded-2xl shadow-2xl flex flex-col p-6 lg:p-10 relative overflow-hidden transition-all duration-300 shrink-0"
            style={{ 
              backgroundColor: theme?.background || 'var(--background)',
              color: theme?.text || 'var(--text-primary)',
              border: `1px solid ${theme?.secondary || 'var(--border)'}`
            }}
          >
            {/* Slide Content Rendering */}
            <div className="mb-3 lg:mb-4 z-10 shrink-0">
              <h2 
                className="text-2xl lg:text-3xl font-display font-bold mb-1 tracking-tight leading-tight"
                style={{ color: theme?.primary || 'var(--primary)' }}
              >
                {activeSlide.title}
              </h2>
              {activeSlide.subtitle && (
                <h3 className="text-lg lg:text-xl font-medium opacity-80 leading-snug">{activeSlide.subtitle}</h3>
              )}
            </div>

            <div className="flex-1 z-10 flex flex-col justify-start w-full overflow-hidden">
              {activeSlide.keyMessage && (
                <div className="text-base lg:text-lg font-medium mb-4 py-2 px-4 rounded-xl bg-black/20 border-l-4 shrink-0" style={{ borderColor: theme?.primary || 'var(--primary)' }}>
                  {activeSlide.keyMessage}
                </div>
              )}

              {(!activeSlide.visualData || Object.keys(activeSlide.visualData).length === 0) && activeSlide.content && activeSlide.content.length > 0 && (
                <ul className="space-y-1.5 lg:space-y-2 text-sm lg:text-base overflow-y-auto pr-2">
                  {activeSlide.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme?.primary || 'var(--primary)' }}></span>
                      <span className="opacity-90 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Render dynamic visualizations */}
              {renderVisualData(activeSlide.visualType, activeSlide.visualData)}
            </div>

            {/* Subtle background element */}
            <div 
              className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: theme?.primary || 'var(--primary)' }}
            />
          </div>

          {/* Notes Section moved below slide */}
          <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left shrink-0 pb-8">
             <div className="md:col-span-2 space-y-3">
               <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                 <MessageSquare size={14} />
                 Speaker Notes
               </h4>
               <p className="text-sm text-text-secondary leading-relaxed bg-surface p-5 rounded-xl border border-border">
                 {activeSlide.speakerNotes || "No notes provided for this slide."}
               </p>
             </div>
             <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Slide Setup</h4>
                <div className="bg-surface p-5 rounded-xl border border-border space-y-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Visual Direction</p>
                    <p className="text-sm font-medium text-text-primary capitalize">
                      {activeSlide.visualType || 'Standard Text'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Slide Type</p>
                    <p className="text-sm font-medium text-text-primary capitalize">
                      {activeSlide.slideType || 'Generic'}
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PitchDeckContent;
