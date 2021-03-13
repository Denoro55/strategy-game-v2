import { Vector } from 'components';
import { isCellInCells, getCellsRange, getValidatedCells } from 'helpers';

import { IActorImages, IActorUpdateOptions } from './types';
import { ActorNames } from './enums';
import { Instance } from '../Instance';

export abstract class Actor extends Instance {
  abstract hp: number;
  abstract maxHp: number;
  abstract viewRange: number;
  abstract damage: number;
  abstract cellsForMoveRange: number;
  abstract attackRange: number;
  abstract name: ActorNames;

  canTurn = true;
  canAttack = true;

  getCellsForMove(): Vector[] {
    return getCellsRange(this.pos, this.cellsForMoveRange);
  }

  getCellsForAttack(): Vector[] {
    return getCellsRange(this.pos, this.attackRange);
  }

  validateCellsForMove(cells: Vector[], blockers: Instance[]): Vector[] {
    return getValidatedCells(this.pos, this.cellsForMoveRange, cells, blockers);
  }

  getAvailableCellsForAttack(blockers: Instance[]): Instance[] {
    const currentRange = getCellsRange(this.pos, this.attackRange);

    // TODO (d.chertenko) подумать и убрать as
    return blockers.filter((blocker) => {
      const positions = blocker.getPositions();

      return positions.some(
        (pos) => isCellInCells(pos, currentRange) && blocker.owner === 'enemy'
      );
    });
  }

  newTurn(): void {
    this.canTurn = true;
    this.canAttack = true;
  }

  getPositions(): Vector[] {
    return [new Vector(this.pos.x, this.pos.y)];
  }

  setPosition(pos: Vector): void {
    this.pos = new Vector(pos.x, pos.y);
  }

  getConfig(): any {
    const { game } = this;

    return game.config.instances.actors[this.name];
  }

  getImage(images: IActorImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  update(options: IActorUpdateOptions): void {
    const { utils } = this.game;

    if (options.hp !== undefined) {
      this.hp = options.hp;
    }

    if (options.canAttack !== undefined) {
      this.canAttack = options.canAttack;
    }

    if (options.canTurn !== undefined) {
      this.canTurn = options.canTurn;
    }

    if (this.hp <= 0) {
      utils.instances.removeInstanceById(this.options.id);
    }
  }

  drawHealthbar(): void {
    this.game.utils.draw.drawHealthbar(this);
  }

  draw(): void {
    this.game.utils.draw.drawInstance(this, {
      yOffset: 0,
    });
    this.drawHealthbar();
  }
}
