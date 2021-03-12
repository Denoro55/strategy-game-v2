import { Vector } from 'components';
import { isCellInCells, getCellsRange, getValidatedCells } from 'helpers';

import { ActorNames } from './enums';
import { Instance } from '../Instance';

export abstract class Actor extends Instance {
  abstract damage: number;
  abstract cellsForMoveRange: number;
  abstract attackRange: number;
  abstract name: ActorNames;

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

    return blockers.filter((blocker) => {
      const positions = blocker.getPositions();

      return positions.some(
        (pos) => isCellInCells(pos, currentRange) && blocker.owner === 'enemy'
      );
    });
  }

  getPositions(): Vector[] {
    return [new Vector(this.pos.x, this.pos.y)];
  }

  getConfig(): any {
    const { game } = this;

    return game.config.instances.actors[this.name];
  }
}
