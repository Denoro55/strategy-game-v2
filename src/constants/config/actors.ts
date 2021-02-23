import { Vector } from 'components';
import { ActorNameType } from 'instances/Actor/types';

type IActorsConfig = {
  [key in ActorNameType]: Record<string, any>
}

export const ACTORS_CONFIG: IActorsConfig = {
  warrior: {
    size: new Vector(60, 60),
  },
  spearman: {
    size: new Vector(60, 60),
  },
  worker: {
    size: new Vector(60, 60),
  },
};
