import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { getScoreLabel } from '../../../constants/validation';

const ValidationScoreChart = ({ score }) => {
  const theme = useChartTheme();
  
  // Determine color based on score
  let fill = theme.primary;
  if (score >= 90) fill = theme.primary;
  else if (score >= 75) fill = theme.success;
  else if (score >= 60) fill = theme.success;
  else if (score >= 40) fill = theme.warning;
  else fill = theme.danger;

  const data = [
    {
      name: 'Score',
      value: score,
      fill: fill
    }
  ];

  const label = getScoreLabel(score);

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="75%" 
          outerRadius="100%" 
          barSize={12} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            minAngle={15}
            background={{ fill: theme.border }}
            clockWise={true}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-display font-bold text-text-primary mb-1">
          {score}
          <span className="text-lg text-text-secondary ml-1 font-sans font-medium">/100</span>
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mt-1" style={{ color: fill }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default ValidationScoreChart;
