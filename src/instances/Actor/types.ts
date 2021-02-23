import { OwnerType } from 'instances/types';

export type ActorNameType = 'warrior' | 'spearman' | 'worker';
export type MoveVariantType = '1' | '2';
export type ValidatorType = '2' | null;

export interface IActorOptions {
  owner: OwnerType
}

export interface IActorImages {
  player: string,
  enemy: string
}