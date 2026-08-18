import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export const getDNAScoreDetails = (score) => {
  if (score >= 90) return { label: 'EXCEPTIONAL', color: 'var(--success)' };
  if (score >= 75) return { label: 'STRONG', color: 'var(--success)' };
  if (score >= 60) return { label: 'PROMISING', color: 'var(--primary)' };
  if (score >= 40) return { label: 'DEVELOPING', color: 'var(--warning)' };
  return { label: 'WEAK', color: 'var(--danger)' };
};

const DNAScoreRadial = ({ score = 0 }) => {
  const details = getDNAScoreDetails(score);

  const data = [
    {
      name: 'Score',
      value: score,
      fill: details.color,
    },
  ];

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Chart */}
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            {/* Background track */}
            <RadialBar
              minAngle={360}
              background={{ fill: 'var(--border)' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold text-text-primary" style={{ color: details.color }}>
            {score}
          </span>
          <span className="text-sm font-medium text-text-secondary/70">/100</span>
        </div>
        <span
          className="text-[10px] font-bold tracking-[0.2em] mt-1"
          style={{ color: details.color }}
        >
          {details.label}
        </span>
      </div>
    </div>
  );
};

export default DNAScoreRadial;
