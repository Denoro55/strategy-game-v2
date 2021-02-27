import { Vector } from 'components';
import { getEvenXOffset } from 'helpers';

export const getCellsRange = (pos: Vector, range: number): Vector[] => {
  const { x } = pos;
  const result: Vector[] = [];

  const startX = x - range;

  for (let xx = startX; xx < startX + range; xx++) {
    result.push(new Vector(xx, pos.y))
  }

  for (let xx = x + 1; xx < x + 1 + range; xx++) {
    result.push(new Vector(xx, pos.y))
  }

  const posOffset = getEvenXOffset(pos.y, 1, 0);

  let iterY = 0;

  const iterate = (yy: number) => {
    const xOffset = getEvenXOffset(yy, 0, 1);
    const xOffset2 = Math.floor(0.5 + iterY / 2);
    const xOffset3 = Math.floor(iterY / 2);
    const startX = posOffset ? xOffset2 : xOffset3;
    const startY = posOffset ? xOffset3 : xOffset2;
    for (let xx = pos.x - range + startX; xx < pos.x + range - startY; xx++) {
      result.push(new Vector(xx + xOffset, yy))
    }
  }

  for (let yy = pos.y + 1; yy < pos.y + 1 + range; yy++) {
    iterate(yy);
    iterY++;
  }

  iterY = 0;
  for (let yy = pos.y - 1; yy > pos.y - 1 - range; yy--) {
    iterate(yy);
    iterY++;
  }

  return result
};
