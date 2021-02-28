import { Vector } from 'components';
import { Actor } from 'instances';
import { ActorNameType, IActorOptions } from 'instances/Actor/types';
import { Game } from 'core';
import spriteUrl from 'assets/images/actors/warrior.png';

export class Warrior extends Actor {
  image: HTMLImageElement;
  name: ActorNameType = 'warrior';
  cellsForMoveRange = 3;
  viewRange = 4;
  attackRange = 1;
  maxHp = 100;
  hp = this.maxHp;
  damage = 10;

  constructor(game: Game, pos: Vector, options: IActorOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteUrl,
    });
  }
}
