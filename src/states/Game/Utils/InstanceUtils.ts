import { Game } from 'states';
import { Vector } from 'components';
import { getRandomValue } from 'helpers';

import { Warrior, Spearman, Worker } from '../actors';
import { MainBuilding } from '../buildings';
import { IInstanceConstructor } from '../instances/Instance/Instance';
import { IInstanceOptions } from '../instances/Instance/types';
import { Instance } from '../instances';
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

    this.addInstance(Warrior, new Vector(basePos.x - 1, basePos.y + 2), { owner });
    this.addInstance(Warrior, new Vector(basePos.x + 1, basePos.y + 2), { owner });

    this.addInstance(Spearman, new Vector(basePos.x - 1, basePos.y), {
      owner,
    });

    this.addInstance(Spearman, new Vector(basePos.x + 1, basePos.y), {
      owner,
    });
  };
  
  addInstance(
    Instance: IInstanceConstructor,
    pos: Vector,
    options: Pick<IInstanceOptions, 'owner'>
  ): void {
    const { instances } = this.game;

    instances.push(
      new Instance(this.game, pos, {
        ...options,
        id: getRandomValue(),
      })
    );
  }

  // pos (integer)
  findInstanceByPos = (pos: Vector): Instance | null => {
    const { instances } = this.game;

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

  getInstanceById = (id: string): Instance | undefined => {
    const { instances } = this.game;

    return instances.find(
      (instance) => instance.options.id === id
    );
  };

  removeInstanceById(id: string): void {
    const { instances } = this.game;

    const actorIndex = instances.findIndex((instance) => instance.options.id === id);
    if (actorIndex !== -1) {
      instances.splice(actorIndex, 1);
    }
  }
}
