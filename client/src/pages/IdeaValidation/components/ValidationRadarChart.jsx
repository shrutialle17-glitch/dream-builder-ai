import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useChartTheme } from '../../../hooks/useChartTheme';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-text-primary mb-1">{payload[0].payload.fullSubject}</p>
        <p className="text-sm text-primary font-bold">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ValidationRadarChart = ({ data }) => {
  const theme = useChartTheme();

  const formattedData = [
    { subject: 'Problem', fullSubject: 'Problem Strength', A: data.problemStrengthScore, fullMark: 100 },
    { subject: 'Market', fullSubject: 'Market Need', A: data.marketNeedScore, fullMark: 100 },
    { subject: 'Solution', fullSubject: 'Solution Fit', A: data.solutionFitScore, fullMark: 100 },
    { subject: 'Customer', fullSubject: 'Target Customer', A: data.targetCustomerClarityScore, fullMark: 100 },
    { subject: 'Diff.', fullSubject: 'Differentiation', A: data.differentiationScore, fullMark: 100 },
    { subject: 'Comp.', fullSubject: 'Competition', A: data.competitionScore, fullMark: 100 },
    { subject: 'Feas.', fullSubject: 'Feasibility', A: data.feasibilityScore, fullMark: 100 },
    { subject: 'Scale', fullSubject: 'Scalability', A: data.scalabilityScore, fullMark: 100 },
    { subject: 'Exec.', fullSubject: 'Execution Complexity', A: data.executionComplexityScore, fullMark: 100 },
    { subject: 'Risk', fullSubject: 'Risk', A: data.riskScore, fullMark: 100 },
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="90%" data={formattedData}>
          <PolarGrid stroke={theme.border} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: theme.textSecondary, fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="A"
            stroke={theme.primary}
            fill={theme.primary}
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValidationRadarChart;
