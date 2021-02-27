import { Vector } from 'components';

// point, cells (целые числа)
export const isCellInCells = (point: Vector, cells: Vector[]): boolean => {
  for (let i = 0; i < cells.length; i++) {
    const currentCell = cells[i];
    if (point.x === currentCell.x && point.y === currentCell.y) {
      return true;
    }
  }

  return false;
};
