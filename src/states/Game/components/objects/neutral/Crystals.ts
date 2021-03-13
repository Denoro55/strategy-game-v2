import { Game } from 'states';
import { Vector } from 'components';
import spriteUrl from 'assets/images/instances/neutral/crystals.png';

import { Neutral } from '../../instances';
import { IInstanceOptions } from '../../instances/types';
import { IInstanceType } from '../../instances/types';
import { NeutralNames } from '../../instances/Neutral/enums';
import { INeutralImages } from '../../instances/Neutral/types';

export class Crystals extends Neutral {
  type: IInstanceType = 'building';
  image: HTMLImageElement;
  name: NeutralNames = NeutralNames.crystals;
  pos: Vector;

  constructor(game: Game, pos: Vector, options: IInstanceOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      default: spriteUrl,
    });
    this.pos = pos;
  }

  getImage(images: INeutralImages): HTMLImageElement {
    const image = new Image();
    image.src = images.default;

    return image;
  }

  getPositions(): Vector[] {
    return [this.pos];
  }
}
