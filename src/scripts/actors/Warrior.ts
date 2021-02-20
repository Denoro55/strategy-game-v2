import { Vector } from 'components';
import { Actor } from 'instances';
import { IActorOptions } from 'instances/Actor';
import { Game } from 'core';
import spriteUrl from 'assets/actors/warrior.png';

const OPTIONS = {
  size: new Vector(60, 60)
}

class Warrior extends Actor {
  image: HTMLImageElement;

  constructor(pos: Vector, options: IActorOptions = {}) {
    super(pos, options);
    this.image = this.getImage(spriteUrl);
  }

  getCellsForMove(): Vector[] {
    const { x, y } = this.pos;

    return [
      new Vector(x - 1, y),
      new Vector(x + 1, y),
      new Vector(x, y - 1),
      new Vector(x, y + 1),
      new Vector(x + 1, y - 1),
      new Vector(x + 1, y + 1)
    ]
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;

    const cellOffset: Vector = utils.getDrawCellOffset(OPTIONS.size, cellSize)

    const pos = utils.getDrawVector(
      new Vector(
        (this.pos.x + 0.5 - cellOffset.x), 
        (this.pos.y + 0.5 - cellOffset.y)
      ),
      this.pos
    )

    $ctx.drawImage(this.image, pos.x, pos.y, OPTIONS.size.x, OPTIONS.size.y);
  }
}

export default Warrior;