import { Vector } from 'components';
import { Building } from 'instances';
import { Game } from 'core';
import spriteUrl from 'assets/buildings/main.png';

const OPTIONS = {
  size: new Vector(180, 180)
}

class MainBuilding extends Building {
  image: HTMLImageElement;
  posArray: Vector[] = [];

  constructor(position: Vector, options = {}) {
    super(position, options);
    this.image = this.getImage(spriteUrl);
    this.setPosition();
  }

  setPosition(): void {
    const { pos } = this;

    this.posArray = [
      new Vector(pos.x, pos.y),
      new Vector(pos.x, pos.y + 1),
      new Vector(pos.x + 1, pos.y + 1)
    ]
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.options;

    const cellOffset: Vector = utils.getDrawCellOffset(OPTIONS.size, cellSize)

    const pos = utils.getDrawVector(
      new Vector(
        (this.pos.x + 0.5 - cellOffset.x), 
        (this.pos.y + 0.85 - cellOffset.y)
      ),
      this.pos
    )

    $ctx.drawImage(this.image, pos.x, pos.y, OPTIONS.size.x, OPTIONS.size.y);
  }
}

export default MainBuilding