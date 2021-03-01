import { Game } from 'core';
import { Vector } from 'components';
import { Warrior, Spearman, Worker } from 'actors';
import { MainBuilding } from 'buildings';
import { IActorOptions, IActorConstructor } from 'instances/Actor/types';
import { getRandomValue } from 'helpers';
import { Actor } from 'instances';
import { OwnerType } from 'instances/types';

export class InstanceUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  spawnBase = (basePos: Vector, owner: OwnerType): void => {
    const { buildings } = this.game;

    buildings.push(new MainBuilding(basePos, { owner }));

    this.addActor(Worker, new Vector(basePos.x, basePos.y + 2), {
      owner,
    });

    this.addActor(
      Warrior,
      new Vector(basePos.x - 1, basePos.y + 2),
      { owner }
    );

    this.addActor(
      Warrior,
      new Vector(basePos.x + 1, basePos.y + 2),
      { owner }
    );

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

  getActorById = (id: string): Actor | undefined => {
    const { actors } = this.game;

    return actors.find((actor) => actor.options.id === id);
  };

  removeActorById(id: string): void {
    const { actors } = this.game;

    const actorIndex = actors.findIndex((actor) => actor.options.id === id);
    if (actorIndex !== -1) {
      actors.splice(actorIndex, 1);
    }
  }
}
