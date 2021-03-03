import { Vector } from 'components';
import { Actor, Building } from 'instances';
import { Game } from 'core';

export interface ISelected<InstanceType> {
  pos: Vector;
  instance: InstanceType;
}

export class Selector {
  game: Game;
  selected: ISelected<Actor | Building | null> = {
    pos: new Vector(0, 0),
    instance: null,
  };

  constructor(game: Game) {
    this.game = game;
  }

  select(pos: Vector): void {
    const {
      game: { actors },
    } = this;
    let instance: Actor | Building | null = null;

    const checkArray = (instances: Actor[] | Building[]) => {
      if (instance) return;

      for (let i = 0; i < instances.length; i++) {
        if (instances[i].pos.x === pos.x && instances[i].pos.y === pos.y) {
          instance = instances[i];
          break;
        }
      }
    };

    checkArray(actors);
    // checkArray(buildings);

    this.selected = {
      pos,
      instance,
    };
  }

  isSelected(): boolean {
    return !!this.selected.instance;
  }

  getSelected(): ISelected<Actor | Building | null> {
    return this.selected;
  }
}
