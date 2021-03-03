import { Game } from 'core';
import { Vector } from 'components';
import { getEvenXOffset } from 'helpers';

export class DrawUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  getPosition(pos: Vector): Vector {
    const {
      viewOffset,
      config: {
        stage: { cellSize },
      },
    } = this.game;
    const viewPxOffset: Vector = this.game.utils.convertPosition(
      viewOffset,
      true
    );

    return new Vector(
      pos.x * cellSize.x - viewPxOffset.x,
      pos.y * cellSize.y - viewPxOffset.y
    );
  }

  getVector(pos: Vector, basePos: Vector): Vector {
    const { x, y } = pos;
    const evenXOffset = getEvenXOffset(Math.floor(basePos.y)); // сдвиг четных рядов для корректного отображения гексонов

    return this.getPosition(new Vector(x + evenXOffset, y));
  }

  getCellOffset(size: Vector, cellSize: Vector): Vector {
    return new Vector(size.x / cellSize.x / 2, size.y / cellSize.y / 2);
  }
}
