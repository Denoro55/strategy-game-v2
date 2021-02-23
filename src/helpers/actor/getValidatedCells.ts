import { ValidatorType } from 'instances/Actor/types';
import { Vector } from 'components';
import { IValidator } from 'helpers/actor/types';
import { validateCells } from 'helpers/actor';
import { getEvenXOffset } from 'helpers';

export const getValidatedCells = (
  type: ValidatorType,
  pos: Vector,
  cells: Vector[]
): Vector[] => {
  const { x, y } = pos;
  const hexonOffset = getEvenXOffset(pos.y, 0, -1);

  switch (type) {
    case '2': {
      const validators: IValidator[] = [
        {
          blocker: new Vector(x + 1, y),
          deps: [
            new Vector(x + 2, y),
            new Vector(x + 2 + hexonOffset, y + 1),
            new Vector(x + 2 + hexonOffset, y - 1),
          ],
        },
        {
          blocker: new Vector(x - 1, y),
          deps: [
            new Vector(x - 2, y),
            new Vector(x - 1 + hexonOffset, y + 1),
            new Vector(x - 1 + hexonOffset, y - 1),
          ],
        },
        {
          blocker: new Vector(x + 1 + hexonOffset, y + 1),
          deps: [
            new Vector(x + 1, y + 2),
            new Vector(x, y + 2),
            new Vector(x + 2 + hexonOffset, y + 1),
          ],
        },
        {
          blocker: new Vector(x + hexonOffset, y + 1),
          deps: [
            new Vector(x - 1, y + 2),
            new Vector(x, y + 2),
            new Vector(x - 1 + hexonOffset, y + 1),
          ],
        },
        {
          blocker: new Vector(x + 1 + hexonOffset, y - 1),
          deps: [
            new Vector(x + 1, y - 2),
            new Vector(x, y - 2),
            new Vector(x + 2 + hexonOffset, y - 1),
          ],
        },
        {
          blocker: new Vector(x + hexonOffset, y - 1),
          deps: [
            new Vector(x - 1, y - 2),
            new Vector(x, y - 2),
            new Vector(x - 1 + hexonOffset, y - 1),
          ],
        },
      ];

      return validateCells(validators, cells);
    }

    default: {
      return cells;
    }
  }
};
