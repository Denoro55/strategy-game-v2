import { Vector } from 'components';
import { Actor } from 'instances';

interface IEmptyCells {
  emptyCells: Vector[],
  blockers: Actor[]
}

export const getEmptyCells = (
  cells: Vector[],
  colliders: Actor[]
): IEmptyCells => {
  const emptyCells: Vector[] = [];
  const blockers: Actor[] = [];

  cells.forEach((cell) => {
    let isEmpty = true;

    for (let i = 0; i < colliders.length; i++) {
      const instance = colliders[i];
      if (cell.x === instance.pos.x && cell.y === instance.pos.y) {
        isEmpty = false;
        blockers.push(instance);
        break;
      }
    }

    if (isEmpty) {
      emptyCells.push(cell);
    }
  });

  return {
    emptyCells,
    blockers
  };
};
