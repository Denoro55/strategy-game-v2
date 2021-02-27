export const getPercent = (
  currentValue: number,
  maxValue: number,
  unit?: number
): number => {
  const percent = currentValue / maxValue;

  return unit ? unit * percent : percent;
};
