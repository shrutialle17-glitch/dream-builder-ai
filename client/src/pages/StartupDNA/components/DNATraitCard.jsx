import React from 'react';
import { getDNAScoreDetails } from './DNAScoreRadial';

const DNATraitCard = ({ trait }) => {
  const details = getDNAScoreDetails(trait.strength);
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
      <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">{trait.name}</h3>
      <span className="text-sm font-bold text-text-secondary" style={{ color: details.color }}>
        {trait.strength}%
      </span>
    </div>
  );
};

export default DNATraitCard;
