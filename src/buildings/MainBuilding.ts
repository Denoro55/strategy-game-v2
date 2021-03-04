import { Game } from 'core';
import { Vector } from 'components';
import { Building } from 'instances';
import { IInstanceType } from 'instances/types';
import { BuildingNames } from 'instances/Building/enums';
import { IInstanceOptions } from 'instances/Instance/types';
import spriteUrl from 'assets/images/buildings/main.png';
import spriteEnemyUrl from 'assets/images/buildings/main-enemy.png';

export class MainBuilding extends Building {
  type: IInstanceType = 'building';
  name: BuildingNames = BuildingNames.main;
  image: HTMLImageElement;
  viewRange = 4;
  maxHp = 100;
  hp = this.maxHp;

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
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

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;
    const config = this.getConfig();

    const cellOffset: Vector = utils.draw.getCellOffset(config.size, cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.85 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, config.size.x, config.size.y);

    this.drawHealthbar();
  }
}
