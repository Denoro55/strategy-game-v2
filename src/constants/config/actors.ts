import { Vector } from 'components';
import { ActorNameType } from 'instances/Actor/types';

type IActorsConfig = {
  [key in ActorNameType]: Record<string, any>;
};

const BASE_ACTOR_SIZE = new Vector(53, 53);

export const ACTORS_CONFIG: IActorsConfig = {
  warrior: {
    size: BASE_ACTOR_SIZE,
  },
  spearman: {
    size: BASE_ACTOR_SIZE,
  },
  worker: {
    size: BASE_ACTOR_SIZE,
  },
};
