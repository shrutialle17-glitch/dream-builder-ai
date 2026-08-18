import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getDNAScoreDetails } from './DNAScoreRadial';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const details = getDNAScoreDetails(data.score);
    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl">
        <div className="font-bold text-text-primary text-sm mb-1">{data.name}</div>
        <div className="font-bold text-lg" style={{ color: details.color }}>
          {data.score}/100
        </div>
      </div>
    );
  }
  return null;
};

const DNABreakdownChart = ({ dimensions = [] }) => {
  // Sort dimensions by score descending for a better bar chart layout
  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedDimensions}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis 
          type="number" 
          domain={[0, 100]} 
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 500 }}
          width={130}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: 'var(--border)', opacity: 0.4 }} content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
          {sortedDimensions.map((entry, index) => {
            const details = getDNAScoreDetails(entry.score);
            return <Cell key={`cell-${index}`} fill={details.color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DNABreakdownChart;
