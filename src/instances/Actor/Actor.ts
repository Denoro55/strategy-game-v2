import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType } from 'instances/types';
import { ActorNameType, MoveVariantType, ValidatorType } from './types';
import { getValidatedCells, getGeneratedCellsForMove } from 'helpers/actor';

export interface IActorOptions {}

export abstract class Actor {
  game: Game;

  abstract name: ActorNameType;
  abstract cellsForMoveVariant: MoveVariantType;
  abstract validatorType: ValidatorType;

  type: IInstanceType = 'actor';

  pos: Vector;
  options: IActorOptions;
  canTurn = true;

  constructor(game: Game, position: Vector, options: IActorOptions) {
    this.pos = position;
    this.options = options;
    this.game = game;
  }

  getImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;

    return image;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.actors[this.name];
  }

  setPosition(pos: Vector): void {
    this.pos = new Vector(pos.x, pos.y);
  }

  getPositions(): Vector[] {
    return [new Vector(this.pos.x, this.pos.y)];
  }

  endTurn(): void {
    this.canTurn = false;
  }

  getCellsForMove(): Vector[] {
    return getGeneratedCellsForMove(this.cellsForMoveVariant, this.pos);
  }

  validateCellsForMove(cells: Vector[]): Vector[] {
    return getValidatedCells(this.validatorType, this.pos, cells);
  }

  abstract draw(game: Game): void;
}
