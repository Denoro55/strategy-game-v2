import { Vector } from 'components';
import { AnyInstance } from 'states/Game/components/instances/types';

interface IEmptyCells {
  emptyCells: Vector[];
  colliders: AnyInstance[];
}

export const getEmptyCells = (
  cells: Vector[],
  colliders: AnyInstance[]
): IEmptyCells => {
  const emptyCells: Vector[] = [];
  const blockers: AnyInstance[] = [];

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
    colliders: blockers,
  };
};
