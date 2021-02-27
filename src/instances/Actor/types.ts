import { Actor } from 'instances';
import { OwnerType } from 'instances/types';
import { Vector } from 'components';
import { Game } from 'core';

export type ActorNameType = 'warrior' | 'spearman' | 'worker';
export type MoveVariantType = '1' | '2';

export interface IActorOptions {
  owner: OwnerType;
  id: string;
}

export interface IActorUpdateOptions {
  hp: number
}

export interface IActorImages {
  player: string;
  enemy: string;
}

export interface IActorConstructor {
  new (game: Game, position: Vector, options: IActorOptions): Actor;
}
