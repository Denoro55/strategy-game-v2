import { Game } from 'states';
import { Vector } from 'components';

import { NeutralNames } from './enums';
import { INeutralImages } from './types';
import { Instance } from '../Instance';
import { OwnerType, IInstanceOptions } from '../types';

export abstract class Neutral extends Instance {
  owner: OwnerType = 'neutral';
  abstract name: NeutralNames;

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
    super(game, position, options);
  }

  getImage(images: INeutralImages): HTMLImageElement {
    const image = new Image();
    image.src = images.default;

    return image;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.instances.neutrals[this.name];
  }

  draw(): void {
    this.game.utils.draw.drawInstance(this, {
      yOffset: 0,
    });
  }
}
