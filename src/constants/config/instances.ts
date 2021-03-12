import { Vector } from 'components';

import { ActorNames } from 'states/Game/components/instances/Actor/enums';
import { BuildingNames } from 'states/Game/components/instances/Building/enums';

const BASE_ACTOR_SIZE = new Vector(53, 53);

type IInstancesConfig = {
  actors: {
    [key in ActorNames]: Record<string, any>;
  };
  buildings: {
    [key in BuildingNames]: Record<string, any>;
  };
};

export const INSTANCES_CONFIG: IInstancesConfig = {
  actors: {
    [ActorNames.warrior]: {
      size: BASE_ACTOR_SIZE,
    },
    [ActorNames.spearman]: {
      size: BASE_ACTOR_SIZE,
    },
    [ActorNames.worker]: {
      size: BASE_ACTOR_SIZE,
    },
  },
  buildings: {
    [BuildingNames.main]: {
      size: new Vector(130, 130),
    },
  },
};
