import { Game } from 'core';
import { Vector } from 'components';
import { Actor } from 'instances';
import { IInstanceType } from 'instances/types';
import { ActorNames } from 'instances/Actor/enums';
import { IInstanceOptions } from 'instances/Instance/types';
import spriteUrl from 'assets/images/actors/warrior.png';
import spriteEnemyUrl from 'assets/images/actors/warrior-enemy.png';

export class Warrior extends Actor {
  type: IInstanceType = 'actor';
  image: HTMLImageElement;
  name: ActorNames = ActorNames.warrior;
  cellsForMoveRange = 3;
  viewRange = 4;
  attackRange = 1;
  maxHp = 100;
  hp = this.maxHp;
  damage = 10;

  constructor(game: Game, pos: Vector, options: IInstanceOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
  }
}
