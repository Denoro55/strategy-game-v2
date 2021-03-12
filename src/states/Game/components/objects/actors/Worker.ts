import { Game } from 'states';
import { Vector } from 'components';
import spriteUrl from 'assets/images/actors/worker.png';
import spriteEnemyUrl from 'assets/images/actors/worker-enemy.png';

import { Actor } from '../../instances';
import { IInstanceType } from '../../instances/types';
import { ActorNames } from '../../instances/Actor/enums';
import { IInstanceOptions } from '../../instances/types';

export class Worker extends Actor {
  type: IInstanceType = 'actor';
  image: HTMLImageElement;
  name: ActorNames = ActorNames.worker;
  cellsForMoveRange = 1;
  viewRange = 4;
  attackRange = 1;
  maxHp = 100;
  hp = this.maxHp;
  damage = 3;

  constructor(game: Game, pos: Vector, options: IInstanceOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
  }
}
