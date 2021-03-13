import { Game } from 'states';
import { Vector } from 'components';
import spriteUrl from 'assets/images/instances/buildings/main.png';
import spriteEnemyUrl from 'assets/images/instances/buildings/main-enemy.png';

import { Building } from '../../instances';
import { IInstanceType } from '../../instances/types';
import { BuildingNames } from '../../instances/Building/enums';
import { IInstanceOptions } from '../../instances/types';

export class MainBuilding extends Building {
  type: IInstanceType = 'building';
  name: BuildingNames = BuildingNames.main;
  image: HTMLImageElement;
  posArray: Vector[] = [];
  viewRange = 4;
  maxHp = 100;
  hp = this.maxHp;

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
    super(game, position, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
    this.setPosition();
  }

  setPosition(): void {
    const { pos } = this;

    const dir = this.pos.y % 2 !== 0 ? 1 : -1;

    this.posArray = [
      new Vector(pos.x, pos.y),
      new Vector(pos.x, pos.y + 1),
      new Vector(pos.x + dir, pos.y + 1),
    ];
  }
}
