import React from 'react';

const KeyUseCaseSection = ({ overview }) => {
  if (!overview?.keyUseCase) return null;

  return (
    <div className="border-l-4 border-l-primary pl-5 py-2 mb-8">
      <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Key Use Case</h3>
      <p className="text-base text-text-primary leading-relaxed font-medium">
        "{overview.keyUseCase}"
      </p>
    </div>
  );
};

export default KeyUseCaseSection;
