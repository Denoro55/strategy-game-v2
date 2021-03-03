import { Game } from 'core';
import { Vector } from 'components';
import { IInstanceType, OwnerType } from 'instances/types';
import { IBuildingOptions, IBuildingImages } from './types';

export abstract class Building {
  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IInstanceType = 'building';
  owner: OwnerType = 'player';

  abstract viewRange: number;

  constructor(position: Vector, options: IBuildingOptions) {
    this.pos = position;
    this.options = options;
    this.owner = options.owner;
    this.setPosition();
  }

  getPositions(): Vector[] {
    return this.posArray;
  }

  getImage(images: IBuildingImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  abstract setPosition(): void;

  abstract draw(game: Game): void;
}