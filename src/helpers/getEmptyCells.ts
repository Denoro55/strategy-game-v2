import { Vector } from 'components';
import { Actor, Building } from 'instances';

interface IEmptyCells {
  emptyCells: Vector[],
  colliders: (Actor | Building)[]
}

export const getEmptyCells = (
  cells: Vector[],
  colliders: (Actor | Building)[]
): IEmptyCells => {
  const emptyCells: Vector[] = [];
  const blockers: (Actor | Building)[] = [];

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
