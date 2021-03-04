import { Instance } from 'instances';
import { Vector } from 'components';
import { BuildingNames } from 'instances/Building/enums';

export abstract class Building extends Instance {
  abstract name: BuildingNames;

  getPositions(): Vector[] {
    return this.posArray;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.instances.buildings[this.name];
  }
}
