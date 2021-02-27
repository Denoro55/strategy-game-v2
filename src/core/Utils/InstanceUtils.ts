import { Game } from 'core';
import { Actor } from 'instances';
import { IActorOptions, IActorConstructor } from 'instances/Actor/types';
import { Vector } from 'components';
import { getRandomValue } from 'helpers';

export class InstanceUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

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
