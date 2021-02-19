import { Vector } from 'components';
import { Game } from 'core';
import { IActorType } from './types';

export interface IActorOptions {}

class Actor {
  pos: Vector;
  options: IActorOptions;
  type: IActorType = 'actor';
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

  draw(game: Game): void {}
}

export default Actor;