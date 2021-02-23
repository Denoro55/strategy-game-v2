import { Vector } from 'components';
import { getEvenXOffset } from 'helpers';

type VariantType = '1' | '2';

export const getGeneratedCellsForMove = (variant: VariantType, pos: Vector): Vector[] => {
  const { x, y } = pos;
  const hexonOffset = getEvenXOffset(pos.y, 1, -1);

  switch (variant) {
    case '1': {
      return [
        new Vector(x - 1, y),
        new Vector(x + 1, y),
        new Vector(x, y - 1),
        new Vector(x, y + 1),
        new Vector(x + hexonOffset, y - 1),
        new Vector(x + hexonOffset, y + 1),
      ];
    }

    case '2': {
      return [
        new Vector(x - 1, y),
        new Vector(x + 1, y),
        new Vector(x - 2, y),
        new Vector(x + 2, y),
        new Vector(x, y - 2),
        new Vector(x, y + 2),
        new Vector(x + 1, y - 2),
        new Vector(x + 1, y + 2),
        new Vector(x - 1, y - 2),
        new Vector(x - 1, y + 2),
        new Vector(x + hexonOffset, y - 1),
        new Vector(x + hexonOffset, y + 1),
        new Vector(x + 1 + hexonOffset, y - 1),
        new Vector(x + 1 + hexonOffset, y + 1),
        new Vector(x + 2 + hexonOffset, y - 1),
        new Vector(x + 2 + hexonOffset, y + 1),
        new Vector(x - 1 + hexonOffset, y - 1),
        new Vector(x - 1 + hexonOffset, y + 1),
      ];
    }

    default: {
      return []
    }
  }
}