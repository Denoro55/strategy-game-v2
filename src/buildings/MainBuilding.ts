import { Game } from 'core';
import { Vector } from 'components';
import { Building } from 'instances';
import { IBuildingOptions } from 'instances/Building/types';
import spriteUrl from 'assets/images/buildings/main.png';
import spriteEnemyUrl from 'assets/images/buildings/main-enemy.png';

const OPTIONS = {
  size: new Vector(130, 130),
};

export class MainBuilding extends Building {
  image: HTMLImageElement;
  viewRange = 4;

  constructor(position: Vector, options: IBuildingOptions) {
    super(position, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteEnemyUrl
    });
  }

  setPosition(): void {
    const { pos } = this;

    const dir = this.pos.y % 2 !== 0 ? 1 : -1;

    this.posArray = [
      new Vector(pos.x, pos.y),
      new Vector(pos.x, pos.y + 1),
      new Vector(pos.x + dir, pos.y + 1),
    ]
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;

    const cellOffset: Vector = utils.draw.getCellOffset(OPTIONS.size, cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.85 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, OPTIONS.size.x, OPTIONS.size.y);
  }
}
