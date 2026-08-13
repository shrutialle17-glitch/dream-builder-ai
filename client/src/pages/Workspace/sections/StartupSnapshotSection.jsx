import React from 'react';

const StartupSnapshotSection = ({ project, overview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <SnapshotItem label="Industry" value={project.industry || 'N/A'} accentClass="border-l-4 border-l-border" />
      <SnapshotItem label="Stage" value={project.startupStage || 'N/A'} accentClass="border-l-4 border-l-border" />
      <SnapshotItem label="Startup Category" value={overview?.startupCategory || 'Generating...'} accentClass="border-l-4 border-l-border" />
      <SnapshotItem label="Business Model" value={overview?.businessModelHypothesis || 'Generating...'} accentClass="border-l-4 border-l-border" />
    </div>
  );
};

const SnapshotItem = ({ label, value, accentClass = '' }) => (
  <div className={`flex flex-col gap-1.5 p-4 bg-surface border border-border rounded-lg ${accentClass}`}>
    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
    <span className="text-sm text-text-primary font-medium leading-snug">{value}</span>
  </div>
);

export default StartupSnapshotSection;
