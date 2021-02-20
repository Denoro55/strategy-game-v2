import { Vector } from 'components';

export const getEmptyCells = (cells: Vector[], colliders: Vector[]): Vector[] => {
  const emptyCells: Vector[] = [];

  cells.forEach(cell => {
    let isEmpty = true;

    for (let i = 0; i < colliders.length; i++) {
      const instancePos = colliders[i];
      if (cell.x === instancePos.x && cell.y === instancePos.y) {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      emptyCells.push(cell)
    }
  })

  return emptyCells;
}