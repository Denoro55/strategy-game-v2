import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType } from './types';

export interface IBuildingOptions {}

class Building {
  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IInstanceType = 'building';

  constructor(position: Vector, options: IBuildingOptions) {
    this.pos = position;
    this.options = options;
  }

  getPositions(): Vector[] {
    return this.posArray;
  }

  getImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;

    return image;
  }

  draw(game: Game): void {}
}

export default Building;