import { Vector } from 'components';
import { isCellInCells } from 'helpers';

// point, cells (целые числа)
export const isCellsInCells = (points: Vector[], cells: Vector[], count?: number): boolean => {
  let result = 0;
  const targetCount = count !== undefined ? count : points.length;

  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i];
    if (isCellInCells(currentPoint, cells)) {
      result += 1;
    }
  }

  return result >= targetCount;
};
