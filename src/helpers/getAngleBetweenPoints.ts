import { Vector } from 'components';

export const getAngleBetweenPoints = (obj1: Vector, obj2: Vector): number => {
	const xDiff = obj1.x - obj2.x;
	const yDiff = obj1.y - obj2.y;
	return Math.atan2(yDiff, xDiff);
}