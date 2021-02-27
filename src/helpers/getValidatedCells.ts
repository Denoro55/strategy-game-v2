import { Actor } from 'instances';
import { Vector } from 'components';
import {
  getEvenXOffset,
  getAngleBetweenPoints,
  angleToRadians,
  isPolygonInPolygon,
  createHexon,
} from 'helpers';
import { EventEmitter } from 'core/EventEmitter';

export const getValidatedCells = (
  pos: Vector,
  size: number,
  cells: Vector[],
  blockers: Actor[]
): Vector[] => {
  let validatedCells = [...cells];

  blockers.forEach((blocker) => {
    if (blocker.owner === 'player') return;

    const blockerPos = new Vector(
      blocker.pos.x + 0.5 + getEvenXOffset(blocker.pos.y, 0.5, 0),
      blocker.pos.y + 0.5
    );
    const instancePos = new Vector(
      pos.x + 0.5 + getEvenXOffset(pos.y, 0.5, 0),
      pos.y + 0.5
    );

    const angleBetween = getAngleBetweenPoints(blockerPos, instancePos);
    const distance = size;
    const rotAngle = angleToRadians(45);

    const polygonArea: Vector[] = [
      new Vector(blockerPos.x, blockerPos.y),
      new Vector(
        blockerPos.x + distance * Math.cos(angleBetween - rotAngle),
        blockerPos.y + distance * Math.sin(angleBetween - rotAngle)
      ),
      new Vector(
        blockerPos.x + distance * Math.cos(angleBetween + rotAngle),
        blockerPos.y + distance * Math.sin(angleBetween + rotAngle)
      ),
    ];

    EventEmitter.dispatch({type: 'debugArea', payload: polygonArea});

    validatedCells = validatedCells.filter((cell) => {
      if (isPolygonInPolygon(createHexon(cell), polygonArea)) {
        return false;
      }
      return true;
    });
  });

  return validatedCells;
};
