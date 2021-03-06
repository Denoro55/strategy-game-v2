import { Instance } from 'states/Game/components/instances';
import { Vector } from 'components';
import {
  getEvenXOffset,
  getAngleBetweenPoints,
  angleToRadians,
  isPolygonInPolygon,
  createHexon,
} from 'helpers';

// заблокировать ячейки за блокерами (врагами)
export const getValidatedCells = (
  pos: Vector,
  size: number,
  cells: Vector[],
  blockers: Instance[]
): Vector[] => {
  let validatedCells = [...cells];

  blockers.forEach((blocker) => {
    if (blocker.owner === 'neutral') return;
    if (blocker.owner === 'player' || blocker.type === 'building') return;

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

    validatedCells = validatedCells.filter((cell) => {
      if (isPolygonInPolygon(createHexon(cell), polygonArea)) {
        return false;
      }
      return true;
    });
  });

  return validatedCells;
};
