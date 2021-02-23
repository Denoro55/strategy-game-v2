import { Vector } from 'components';
import { getEvenXOffset } from 'helpers';

export const getCellsRange = (size: Vector, pos: Vector): Vector[] => {
  const { x } = pos;
  const result: Vector[] = [];

  const startX = x - size.x;

  for (let xx = startX; xx < startX + size.x; xx++) {
    result.push(new Vector(xx, pos.y))
  }

  for (let xx = x + 1; xx < x + 1 + size.x; xx++) {
    result.push(new Vector(xx, pos.y))
  }

  const posOffset = getEvenXOffset(pos.y, 1, 0);

  let iterY = 0;

  const iterate = (yy: number) => {
    const xOffset = getEvenXOffset(yy, 0, 1);
    const startX = posOffset ? Math.floor(0.5 + iterY / 2) : Math.floor(iterY / 2);
    const startY = posOffset ? Math.floor(iterY / 2) : Math.floor(0.5 + iterY / 2);
    for (let xx = pos.x - size.x + startX; xx < pos.x + size.x - startY; xx++) {
      result.push(new Vector(xx + xOffset, yy))
    }
  }

  for (let yy = pos.y + 1; yy < pos.y + 1 + size.y; yy++) {
    iterate(yy);
    iterY++;
  }

  iterY = 0;
  for (let yy = pos.y - 1; yy > pos.y - 1 - size.y; yy--) {
    iterate(yy);
    iterY++;
  }

  return result
};
