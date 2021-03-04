import { Instance } from 'instances';
import { BuildingNames } from 'instances/Building/enums';

export abstract class Building extends Instance {
  abstract name: BuildingNames;

  getConfig(): any {
    const { game } = this;

    return game.config.instances.buildings[this.name];
  }
}
