// сдвиг четных рядов для корректного отображения гексонов
export const getEvenXOffset = (value: number): number => value % 2 !== 0 ? 0.5 : 0;