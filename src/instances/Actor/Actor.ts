import { Vector } from 'components';
import { Game } from 'core';
import { IInstanceType, OwnerType } from 'instances/types';
import { ActorNameType, IActorOptions, IActorImages } from './types';
import { isCellInCells, getCellsRange, getValidatedCells } from 'helpers';

export abstract class Actor {
  game: Game;

  abstract name: ActorNameType;
  abstract cellsForMoveRange: number;
  abstract viewRange: number;
  abstract attackRange: number;

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
    return getCellsRange(this.pos, this.cellsForMoveRange);
  }

  validateCellsForMove(cells: Vector[], blockers: Actor[]): Vector[] {
    return getValidatedCells(this.pos, this.cellsForMoveRange, cells, blockers);
  }

  getAvailableCellsForAttack(blockers: Actor[]): Actor[] {
    const currentRange = getCellsRange(this.pos, this.attackRange);
    return blockers.filter(blocker => isCellInCells(blocker.pos, currentRange))
  }

  abstract draw(game: Game): void;
}
