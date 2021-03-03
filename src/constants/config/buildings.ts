import { Vector } from 'components';
import { BuildingNameType } from 'instances/Building/types';

type IBuildingsConfig = {
  [key in BuildingNameType]: Record<string, any>;
};

export const BUILDINGS_CONFIG: IBuildingsConfig = {
  main: {
    size: new Vector(130, 130),
  },
};
