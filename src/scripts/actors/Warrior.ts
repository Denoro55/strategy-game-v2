import Vector from '../components/Vector';
import Actor, { IActorOptions } from './Actor';
import Game from '../core/Game';
import spriteUrl from '../../assets/actors/warrior.png';

const OPTIONS = {
  size: new Vector(70, 70)
}

class Warrior extends Actor {
  image: HTMLImageElement;

  constructor(pos: Vector, options: IActorOptions = {}) {
    super(pos, options);
    this.image = this.getImage(spriteUrl);
  }

  draw(game: Game): void {
    const { $ctx, drawer } = game;
    const { cellSize } = game.options;

    const cellOffset: Vector = drawer.getDrawCellOffset(OPTIONS.size, cellSize)

    const pos = drawer.getDrawVector(
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