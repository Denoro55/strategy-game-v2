import { Game } from 'states';
import { Vector } from 'components';
import { IInstanceOptions } from '../types';
import { IInstanceType, OwnerType } from '../types';

export abstract class Instance {
  game: Game;

  abstract image: HTMLImageElement;
  abstract type: IInstanceType;

  abstract getConfig(): any;
  abstract getPositions(): Vector[];
  abstract draw(): void;

  owner: OwnerType = 'player';
  pos: Vector;
  options: IInstanceOptions;

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
    this.game = game;
    this.pos = position;
    this.options = options;
    this.owner = options.owner;
  }
}
