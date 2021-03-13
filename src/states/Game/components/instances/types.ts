import { Game } from 'states/Game';
import { Vector } from 'components';

export type IInstanceType = 'actor' | 'building';
export type OwnerType = 'ally' | 'enemy' | 'player' | 'neutral';

export interface IInstanceOptions {
  owner: OwnerType;
  id: string;
}

export interface IInstanceConstructor<T> {
  new (game: Game, position: Vector, options: IInstanceOptions): T;
}