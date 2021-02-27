import { Vector } from 'components';
import { getEvenXOffset } from './getEvenXOffset';

export const isCellInRange = (
  pos: Vector,
  otherPos: Vector,
  range: number
): boolean => {
  const xDiff = Math.abs((pos.x + (getEvenXOffset(pos.y, 0, 0))) - (otherPos.x + (getEvenXOffset(otherPos.y, 0, 0))));
  const yDiff = Math.abs(pos.y - otherPos.y);
  if (xDiff > range || yDiff > range) return false;
  return true;
};
