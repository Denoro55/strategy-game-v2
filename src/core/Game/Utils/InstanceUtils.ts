import { Game } from 'core';
import { Vector } from 'components';
import { Warrior, Spearman, Worker } from 'actors';
import { MainBuilding } from 'buildings';
import {
  IBuildingOptions,
  IBuildingConstructor,
} from 'instances/Building/types';
import { IActorOptions, IActorConstructor } from 'instances/Actor/types';
import { getRandomValue } from 'helpers';
import { Actor, Building } from 'instances';
import { OwnerType } from 'instances/types';

export class InstanceUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  getInstances = (): (Actor | Building)[] => {
    const { actors, buildings } = this.game;

    return [...actors, ...buildings];
  }

  spawnBase = (basePos: Vector, owner: OwnerType): void => {
    const { buildings } = this.game;

    this.addBuilding(MainBuilding, basePos, {
      owner,
    });

    this.addActor(Worker, new Vector(basePos.x, basePos.y + 2), {
      owner,
    });

    this.addActor(Warrior, new Vector(basePos.x - 1, basePos.y + 2), { owner });

    this.addActor(Warrior, new Vector(basePos.x + 1, basePos.y + 2), { owner });

    this.addActor(Spearman, new Vector(basePos.x - 1, basePos.y), {
      owner,
    });

    this.addActor(Spearman, new Vector(basePos.x + 1, basePos.y), {
      owner,
    });
  };

  addActor(
    ActorInstance: IActorConstructor,
    pos: Vector,
    options: Pick<IActorOptions, 'owner'>
  ): void {
    const { actors } = this.game;

    actors.push(
      new ActorInstance(this.game, pos, {
        ...options,
        id: getRandomValue(),
      })
    );
  }

  addBuilding(
    BuildingInstance: IBuildingConstructor,
    pos: Vector,
    options: Pick<IBuildingOptions, 'owner'>
  ): void {
    const { buildings } = this.game;

    buildings.push(
      new BuildingInstance(this.game, pos, {
        ...options,
        id: getRandomValue(),
      })
    );
  }

  // pos (integer)
  findInstanceByPos = (pos: Vector): Actor | Building | null => {
    const instances = this.getInstances();

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

  getInstanceById = (id: string): Actor | Building | undefined => {
    const instances = this.getInstances();

    return instances.find(
      (instance) => instance.options.id === id
    );
  };

  removeInstanceById(id: string): void {
    const { actors, buildings } = this.game;

    const actorIndex = actors.findIndex((instance) => instance.options.id === id);
    if (actorIndex !== -1) {
      actors.splice(actorIndex, 1);
      return;
    }

    const buildingIndex = buildings.findIndex((instance) => instance.options.id === id);
    if (buildingIndex !== -1) {
      buildings.splice(buildingIndex, 1);
    }
  }
}
