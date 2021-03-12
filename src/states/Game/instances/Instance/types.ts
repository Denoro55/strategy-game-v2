import { OwnerType } from '../types';

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
