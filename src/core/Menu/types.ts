import { Vector } from 'components';

export interface IGameInitOptions {
  player: {
    startPosition: Vector;
  };
  enemy: {
    startPosition: Vector;
  };
}
