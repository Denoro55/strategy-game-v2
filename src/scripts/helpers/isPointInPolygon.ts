import { Vector } from "components";

export const isPointInPolygon = (pos: Vector, polygon: Vector[]): boolean => {
  const xp: number[] = [];
  const yp: number[] = [];

  polygon.forEach(pos => {
    xp.push(pos.x);
    yp.push(pos.y);
  })

  const { x, y } = pos;
  const npol = xp.length;
  let j = npol - 1;
  let c: number | boolean = 0;

  for (let i = 0; i < npol; i++) {
    if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
      c = !c
    }
    j = i;
  }

  return !!c;
}