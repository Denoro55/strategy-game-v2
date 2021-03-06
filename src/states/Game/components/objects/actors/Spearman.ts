import { Game } from 'states';
import { Vector } from 'components';
import spriteUrl from 'assets/images/instances/actors/spearman.png';
import spriteEnemyUrl from 'assets/images/instances/actors/spearman-enemy.png';

import { Actor } from '../../instances';
import { IInstanceType } from '../../instances/types';
import { IInstanceOptions } from '../../instances/types';
import { ActorNames } from '../../instances/Actor/enums';

export class Spearman extends Actor {
  type: IInstanceType = 'actor';
  image: HTMLImageElement;
  name: ActorNames = ActorNames.spearman;
  cellsForMoveRange = 1;
  viewRange = 4;
  attackRange = 2;
  maxHp = 100;
  hp = this.maxHp;
  damage = 15;

  constructor(game: Game, pos: Vector, options: IInstanceOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
  }
}
