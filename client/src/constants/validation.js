export const VALIDATION_SCORE_LABELS = [
  { max: 39, label: "Weak" },
  { max: 59, label: "Needs Work" },
  { max: 74, label: "Promising" },
  { max: 89, label: "Strong Potential" },
  { max: 100, label: "Exceptional Potential" }
];

export const getScoreLabel = (score) => {
  if (score === null || score === undefined) return "Unknown";
  for (const tier of VALIDATION_SCORE_LABELS) {
    if (score <= tier.max) {
      return tier.label;
    }
  }
  return "Unknown";
};

export const getScoreColorClass = (score) => {
  if (score === null || score === undefined) return "text-text-secondary";
  if (score <= 39) return "text-danger";
  if (score <= 59) return "text-warning";
  if (score <= 89) return "text-success";
  return "text-primary";
};
