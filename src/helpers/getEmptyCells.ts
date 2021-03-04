import { Vector } from 'components';
import { Instance } from 'instances';

interface IEmptyCells {
  emptyCells: Vector[],
  colliders: Instance[]
}

export const getEmptyCells = (
  cells: Vector[],
  colliders: Instance[]
): IEmptyCells => {
  const emptyCells: Vector[] = [];
  const blockers: Instance[] = [];

  cells.forEach((cell) => {
    let isEmpty = true;

    let loop = true;
    for (let i = 0; i < colliders.length && loop; i++) {
      const instance = colliders[i];

      const positions = instance.getPositions();

      for (let p = 0; p < positions.length; p++) {
        const cellPos = positions[p];
        if (cell.x === cellPos.x && cell.y === cellPos.y) {
          isEmpty = false;
          blockers.push(instance);
          loop = false;
          break;
        }
      }
    }

    if (isEmpty) {
      emptyCells.push(cell);
    }
  });

  return {
    emptyCells,
    colliders: blockers
  };
};
