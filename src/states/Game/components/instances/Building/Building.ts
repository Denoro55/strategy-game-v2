import { Vector } from 'components';

import { IBuildingImages, IBuildingUpdateOptions } from './types';
import { Instance } from '../Instance';
import { BuildingNames } from '../Building/enums';

export abstract class Building extends Instance {
  abstract hp: number;
  abstract maxHp: number;
  abstract viewRange: number;
  abstract name: BuildingNames;
  abstract posArray: Vector[];
  abstract setPosition(): void;

  getPositions(): Vector[] {
    return this.posArray;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.instances.buildings[this.name];
  }

  newTurn(): void {
    // code
  }

  // TODO (d.chertenko): подумать как вынести. У актера идентичная почти
  getImage(images: IBuildingImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  update(options: IBuildingUpdateOptions): void {
    const { utils } = this.game;

    if (options.hp !== undefined) {
      this.hp = options.hp;
    }

    if (this.hp <= 0) {
      utils.instances.removeInstanceById(this.options.id);
    }
  }

  drawHealthbar(): void {
    this.game.utils.draw.drawHealthbar(this);
  }

  draw(): void {
    this.game.utils.draw.drawInstance(this, {
      yOffset: 0.35,
    });
    this.drawHealthbar();
  }
}
