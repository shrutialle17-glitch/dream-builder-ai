import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border p-4 rounded-xl shadow-xl max-w-xs">
        <div className="font-bold text-text-primary text-sm mb-1">{data.name}</div>
        <div className="text-primary font-bold text-lg mb-2">{data.score}/100 <span className="text-xs text-text-secondary font-normal uppercase ml-1">({data.rating})</span></div>
        <p className="text-text-secondary text-xs leading-relaxed">
          {data.reason}
        </p>
      </div>
    );
  }
  return null;
};

const DNARadarChart = ({ dimensions = [] }) => {
  // We want to sort dimensions in a specific order for the radar shape, or just use as is.
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dimensions}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis 
          dataKey="name" 
          tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Startup DNA"
          dataKey="score"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="var(--primary)"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default DNARadarChart;
