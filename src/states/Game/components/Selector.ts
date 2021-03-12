import { Game } from 'states';
import { Vector } from 'components';

import { AnyInstance } from './instances/types';

export interface ISelected<InstanceType> {
  pos: Vector;
  instance: InstanceType;
}

export class Selector {
  game: Game;
  selected: ISelected<AnyInstance | null> = {
    pos: new Vector(0, 0),
    instance: null,
  };

  constructor(game: Game) {
    this.game = game;
  }

  select(pos: Vector): void {
    const {
      game: { instances },
    } = this;
    let instance: AnyInstance | null = null;

    for (let i = 0; i < instances.length; i++) {
      const iterateInstance = instances[i];
      const positions = iterateInstance.getPositions();

      for (let p = 0; p < positions.length; p++) {
        if (positions[p].x === pos.x && positions[p].y === pos.y) {
          instance = iterateInstance;
          break;
        }
      }
    }

    this.selected = {
      pos,
      instance,
    };
  }

  isSelected(): boolean {
    return !!this.selected.instance;
  }

  getSelected(): ISelected<AnyInstance | null> {
    return this.selected;
  }
}
