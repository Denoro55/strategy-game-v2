import { Vector } from 'components';
import { Actor } from 'instances';
import { ActorNameType, IActorOptions } from 'instances/Actor/types';
import { Game } from 'core';
import spriteUrl from 'assets/images/actors/spearman.png';
import spriteEnemyUrl from 'assets/images/actors/spearman-enemy.png';

export class Spearman extends Actor {
  image: HTMLImageElement;
  name: ActorNameType = 'spearman';
  cellsForMoveRange = 1;
  viewRange = 4;
  attackRange = 2;
  maxHp = 100;
  hp = this.maxHp;
  damage = 15;

  constructor(game: Game, pos: Vector, options: IActorOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
  }
}
