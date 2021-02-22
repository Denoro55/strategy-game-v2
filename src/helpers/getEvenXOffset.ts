// сдвиг четных рядов для корректного отображения гексонов
export const getEvenXOffset = (value: number, positive = 0.5, negative = 0): number =>
  value % 2 !== 0 ? positive : negative;
