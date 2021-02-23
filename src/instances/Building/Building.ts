import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType, OwnerType } from 'instances/types';
import { IBuildingOptions } from './types';

export abstract class Building {
  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IInstanceType = 'building';
  owner: OwnerType = 'player';

  constructor(position: Vector, options: IBuildingOptions) {
    this.pos = position;
    this.options = options;
    this.owner = options.owner;
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