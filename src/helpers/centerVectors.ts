import { Vector } from 'components';

export const centerVectors = (vectors: Vector[]): Vector[] => {
  return vectors.map(vector => new Vector(vector.x + 0.5, vector.y + 0.5))
}