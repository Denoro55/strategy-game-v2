import { Vector, Actor, Building } from 'components';
import { Game } from 'core';

interface ISelected {
  pos: Vector;
  instance: Actor | Building | null
}

class Selector {
  game: Game;
  selected: ISelected = {
    pos: new Vector(0, 0),
    instance: null
  }

  constructor(game: Game) {
    this.game = game;
  }

  select(pos: Vector): void {
    const { game: { actors, buildings } } = this;
    let instance: Actor | Building | null = null;

    const checkArray = (instances: Actor[] | Building[]) => {
      if (instance) return;

      for (let i = 0; i < instances.length; i++) {
        if (instances[i].pos.x === pos.x && instances[i].pos.y === pos.y) {
          instance = instances[i];
          break;
        }
      }
    }

    checkArray(actors);
    // checkArray(buildings);

    this.selected = {
      pos,
      instance
    }

    console.log(this.selected);
  }

  isSelected(): boolean {
    return !!this.selected.instance
  }

  getSelected(): ISelected {
    return this.selected;
  }
}

export default Selector;