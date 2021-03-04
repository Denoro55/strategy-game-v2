import { Game } from 'core';
import { Instance } from 'instances';
import { OwnerType } from 'instances/types';
import { Vector } from 'components';

export type InstanceNameType =
  | 'actor:warrior'
  | 'actor:spearman'
  | 'actor:worker'
  | 'building:main';

export interface IInstanceOptions {
  owner: OwnerType;
  id: string;
}

export interface IInstanceUpdateOptions {
  hp?: number;
  canAttack?: boolean;
  canTurn?: boolean;
}

export interface IInstanceImages {
  player: string;
  enemy: string;
}

export interface IInstanceConstructor {
  new (game: Game, position: Vector, options: IInstanceOptions): Instance;
}
