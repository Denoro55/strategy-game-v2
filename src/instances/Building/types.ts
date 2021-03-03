import { Game } from 'core';
import { Vector } from 'components';
import { Building } from 'instances';
import { OwnerType } from 'instances/types';

export interface IBuildingOptions {
  owner: OwnerType;
  id: string;
}

export interface IBuildingImages {
  player: string;
  enemy: string;
}

export type BuildingNameType = 'main';

export interface IBuildingConstructor {
  new (game: Game, position: Vector, options: IBuildingOptions): Building;
}

export interface IBuildingUpdateOptions {
  hp?: number;
}