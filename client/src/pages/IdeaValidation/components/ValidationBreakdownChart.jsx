import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-text-primary mb-1">{data.name}</p>
        <p className="text-sm font-bold" style={{ color: data.fill }}>
          Score: {data.score}
        </p>
      </div>
    );
  }
  return null;
};

const ValidationBreakdownChart = ({ data }) => {
  const theme = useChartTheme();

  const getBarColor = (score, name) => {
    const isInverse = name === 'Risk' || name === 'Execution Complexity';
    if (isInverse) {
      if (score >= 75) return theme.danger;
      if (score >= 50) return theme.warning;
      return theme.success;
    }
    
    if (score >= 75) return theme.success;
    if (score >= 50) return theme.warning;
    return theme.danger;
  };

  const rawData = [
    { name: 'Problem Strength', score: data.problemStrengthScore },
    { name: 'Solution Fit', score: data.solutionFitScore },
    { name: 'Market Need', score: data.marketNeedScore },
    { name: 'Target Customer', score: data.targetCustomerClarityScore },
    { name: 'Feasibility', score: data.feasibilityScore },
    { name: 'Scalability', score: data.scalabilityScore },
    { name: 'Differentiation', score: data.differentiationScore },
    { name: 'Competition', score: data.competitionScore },
    { name: 'Risk', score: data.riskScore },
    { name: 'Execution Complexity', score: data.executionComplexityScore },
  ];

  // Sort descending by score
  const sortedData = rawData.sort((a, b) => b.score - a.score).map(item => ({
    ...item,
    fill: getBarColor(item.score, item.name)
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke={theme.border} opacity={0.5} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: theme.textSecondary, fontSize: 12 }} 
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: theme.textPrimary, fontSize: 13, fontWeight: 500 }} 
            width={140}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.border, opacity: 0.2 }} />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={12}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValidationBreakdownChart;
