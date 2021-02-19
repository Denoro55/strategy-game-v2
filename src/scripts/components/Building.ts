import { Vector } from 'components';
import { Game } from 'core';
import { IActorType } from './types';

export interface IBuildingOptions {}

class Building {
  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IActorType = 'building';

  constructor(position: Vector, options: IBuildingOptions) {
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

export default Building;