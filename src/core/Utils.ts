import { Vector } from 'components';
import { Game } from 'core';
import { createHexon, isPointInPolygon, getEvenXOffset } from 'helpers';

export class Utils {
  game: Game;

  constructor(game: Game) {
    this.game = game;

    this.convertPosition = this.convertPosition.bind(this);
  }

  convertPosition(vector: Vector, toPx?: boolean): Vector {
    const { cellSize } = this.game.config.stage;

    if (toPx) {
      return new Vector(vector.x * cellSize.x, vector.y * cellSize.y);
    }

    return new Vector(vector.x / cellSize.x, vector.y / cellSize.y);
  }

  getViewPosition = (pos: Vector): Vector => {
    const { viewOffset } = this.game;

    return new Vector(pos.x + viewOffset.x, pos.y + viewOffset.y);
  };

  // pos = нативная позиция мыши
  getHoveredCell = (pos: Vector): Vector | null => {
    const {
      game: {
        utils,
        mousePos,
        viewOffset,
        config: {
          stage: {
            cellSize,
            grid: { x, y },
          },
        },
      },
    } = this;

    let isHovered = false;
    let hoveredPos: Vector = new Vector(0, 0);

    const mousePosition = utils.getViewPosition(utils.convertPosition(pos));

    const startX = Math.max(
      Math.floor(mousePos.x / cellSize.x + viewOffset.x) - 1,
      0
    );
    const startY = Math.max(
      Math.floor(mousePos.y / cellSize.y + viewOffset.y) - 1,
      0
    );

    let stop = false;
    for (let xx = startX; xx < Math.min(startX + 3, x) && !stop; xx++) {
      for (let yy = startY; yy < Math.min(startY + 3, y) && !stop; yy++) {
        if (
          isPointInPolygon(
            new Vector(mousePosition.x, mousePosition.y),
            createHexon(new Vector(xx, yy))
          )
        ) {
          isHovered = true;
          hoveredPos = new Vector(xx, yy);
          stop = true;
        }
      }
    }

    if (isHovered) {
      return new Vector(hoveredPos.x, hoveredPos.y);
    }

    return null;
  };

  // удалить клетки вне сцены
  getCellsOnlyOnStage = (cells: Vector[]): Vector[] => {
    const { config } = this.game;

    return cells.filter((cell) => {
      if (
        cell.x < 0 ||
        cell.y < 0 ||
        cell.x > config.stage.grid.x - 1 ||
        cell.y > config.stage.grid.y - 1
      )
        return false;
      return true;
    });
  };

  getDrawPosition(pos: Vector): Vector {
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

  getDrawVector(pos: Vector, basePos: Vector): Vector {
    const { x, y } = pos;
    const evenXOffset = getEvenXOffset(Math.floor(basePos.y)); // сдвиг четных рядов для корректного отображения гексонов

    return this.getDrawPosition(new Vector(x + evenXOffset, y));
  }

  getDrawCellOffset(size: Vector, cellSize: Vector): Vector {
    return new Vector(size.x / cellSize.x / 2, size.y / cellSize.y / 2);
  }
}
