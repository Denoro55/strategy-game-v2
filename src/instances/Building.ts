import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType } from './types';

export interface IBuildingOptions {}

export abstract class Building {
  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IInstanceType = 'building';

  constructor(position: Vector, options: IBuildingOptions) {
    this.pos = position;
    this.options = options;
    this.setPosition();
  }

  getPositions(): Vector[] {
    return this.posArray;
  }

  getImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;

    return image;
  }

  abstract setPosition(): void;

  abstract draw(game: Game): void;
}