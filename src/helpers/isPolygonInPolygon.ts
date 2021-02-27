import { isPointInPolygon } from './isPointInPolygon';
import { Vector } from 'components';

export const isPolygonInPolygon = (polygon: Vector[], polygon2: Vector[]): boolean => {
  for (let i = 0; i < polygon.length; i++) {
    const polygonPoint = new Vector(polygon[i].x, polygon[i].y)
    if (isPointInPolygon(polygonPoint, polygon2)) {
      return true;
    }
  }

  return false;
};
