import { Game } from 'core';
import { Vector } from 'components';
import { Building } from 'instances';
import { IBuildingOptions, BuildingNameType } from 'instances/Building/types';
import spriteUrl from 'assets/images/buildings/main.png';
import spriteEnemyUrl from 'assets/images/buildings/main-enemy.png';

export class MainBuilding extends Building {
  image: HTMLImageElement;
  viewRange = 4;
  name: BuildingNameType = 'main';
  maxHp = 100;
  hp = this.maxHp;

  constructor(game: Game, position: Vector, options: IBuildingOptions) {
    super(game, position, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl,
    });
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
