import { Actor, Building } from 'states/Game/components/instances';
import { Game } from 'states';
import { Vector } from 'components';
import { getRandomValue } from 'helpers';
import { MainBuilding } from 'states/Game/components/objects/buildings';

import { Warrior, Spearman, Worker } from '../objects/actors';
import { IInstanceConstructor, IInstanceOptions } from '../instances/types';
import { Instance, Neutral } from '../instances';
import { OwnerType } from '../instances/types';

export class InstanceUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  spawnBase = (basePos: Vector, owner: OwnerType): void => {
    this.addInstance(MainBuilding, basePos, {
      owner,
    });

    this.addInstance(Worker, new Vector(basePos.x, basePos.y + 2), {
      owner,
    });

    this.addInstance(Warrior, new Vector(basePos.x - 1, basePos.y + 2), {
      owner,
    });
    this.addInstance(Warrior, new Vector(basePos.x + 1, basePos.y + 2), {
      owner,
    });

    this.addInstance(Spearman, new Vector(basePos.x - 1, basePos.y), {
      owner,
    });

    this.addInstance(Spearman, new Vector(basePos.x + 1, basePos.y), {
      owner,
    });
  };

  addInstance(
    Instance: IInstanceConstructor<Instance>,
    pos: Vector,
    options: Pick<IInstanceOptions, 'owner'>
  ): void {
    const { actors, buildings, neutrals } = this.game;

    const opts: IInstanceOptions = {
      ...options,
      id: getRandomValue(),
    };
    const args: [game: Game, pos: Vector, opts: IInstanceOptions] = [this.game, pos, opts];

    if (Instance.prototype instanceof Actor) {
      actors.push(new Instance(...args) as Actor);
    }

    if (Instance.prototype instanceof Building) {
      buildings.push(new Instance(...args) as Building);
    }

    if (Instance.prototype instanceof Neutral) {
      neutrals.push(new Instance(...args) as Neutral);
    }
  }

  // pos (integer)
  findInstanceByPos = (pos: Vector): Instance | null => {
    const instances = this.getAllInstances();

    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];
      const positions = instance.getPositions();

      for (let p = 0; p < positions.length; p++) {
        if (positions[p].x === pos.x && positions[p].y === pos.y) {
          return instance;
        }
      }
    }

    return null;
  };

  getAllInstances = (): Instance[] => {
    const { actors, buildings, neutrals } = this.game;

    return [...actors, ...buildings, ...neutrals];
  };

  getPlayerInstances = (): (Actor | Building)[] => {
    const { actors, buildings } = this.game;

    return [...actors, ...buildings];
  };

  getInstanceById = (id: string): Instance | undefined => {
    const instances = this.getAllInstances();

    return instances.find((instance) => instance.options.id === id);
  };

  removeInstanceById(id: string): void {
    const { actors, buildings } = this.game;

    const iter = (instances: Instance[]) => {
      const index = instances.findIndex(
        (instance) => instance.options.id === id
      );
      if (index !== -1) {
        instances.splice(index, 1);
      }
    };

    iter(actors);
    iter(buildings);
  }
}
