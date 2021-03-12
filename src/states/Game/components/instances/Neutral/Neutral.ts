import { Game } from 'states';
import { Vector } from 'components';

import { OwnerType, IInstanceOptions, IInstanceType } from '../types';

export abstract class Neutral {
  game: Game;
  pos: Vector;
  owner: OwnerType = 'neutral';
  options: IInstanceOptions;

  abstract image: HTMLImageElement;
  abstract type: IInstanceType;
  abstract getPositions(): Vector[];

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
    this.game = game;
    this.pos = position;
    this.options = options;
    this.owner = options.owner;
  }

  draw(): void {
    const { $ctx, utils } = this.game;
    const { cellSize } = this.game.config.stage;

    const cellOffset: Vector = utils.draw.getCellOffset(new Vector(60, 60), cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.5 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, 60, 60);
  }
}
