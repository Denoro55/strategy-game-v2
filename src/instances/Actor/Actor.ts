import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType, OwnerType } from 'instances/types';
import { ActorNameType, ValidatorType, IActorOptions, IActorImages } from './types';
import { getValidatedCells, getCellsRange } from 'helpers/actor';

export abstract class Actor {
  game: Game;

  abstract name: ActorNameType;
  abstract cellsForMoveRange: Vector;
  abstract validatorType: ValidatorType;
  abstract viewRange: Vector;

  type: IInstanceType = 'actor';
  owner: OwnerType = 'player';

  pos: Vector;
  options: IActorOptions;
  canTurn = true;

  constructor(game: Game, position: Vector, options: IActorOptions) {
    this.pos = position;
    this.options = options;
    this.game = game;
    this.owner = options.owner;
  }

  getImage(images: IActorImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

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
    return getCellsRange(this.cellsForMoveRange, this.pos);
  }

  validateCellsForMove(cells: Vector[], blockers: Actor[]): Vector[] {
    return getValidatedCells(this.pos, this.cellsForMoveRange, cells, blockers);
  }

  abstract draw(game: Game): void;
}
