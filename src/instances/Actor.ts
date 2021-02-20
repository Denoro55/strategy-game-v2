import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType } from './types';

export interface IActorOptions {}

abstract class Actor {
  pos: Vector;
  options: IActorOptions;
  type: IInstanceType = 'actor';
  canTurn = true;

  constructor(position: Vector, options: IActorOptions) {
    this.pos = position;
    this.options = options;
  }

  getImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;

    return image;
  }

  getPositions(): Vector[] {
    return [new Vector(this.pos.x, this.pos.y)]
  }

  abstract getCellsForMove(): Vector[]

  abstract draw(game: Game): void
}

export default Actor;