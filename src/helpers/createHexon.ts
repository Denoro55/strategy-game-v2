import { getEvenXOffset } from './getEvenXOffset';
import { Vector } from 'components';

type HexonType = [
  pos: Vector,
  pos: Vector,
  pos: Vector,
  pos: Vector,
  pos: Vector,
  pos: Vector
];

export const createHexon = (pos: Vector): HexonType => {
  const eventXOffset = getEvenXOffset(pos.y);
  const xx = pos.x + eventXOffset;

  const centerX = xx + 0.5; // центр ячейки
  const partSize = 1.5 / 3; // треть ячейки

  const yy = pos.y - 0.25;

  return [
    new Vector(centerX, yy),
    new Vector(xx + 1, yy + partSize),
    new Vector(xx + 1, yy + partSize * 2),
    new Vector(centerX, yy + 1 + 0.5),
    new Vector(xx, yy + partSize * 2),
    new Vector(xx, yy + partSize),
  ];
};
