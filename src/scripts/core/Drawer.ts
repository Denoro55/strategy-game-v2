import { Vector } from 'components';
import { INITIAL_DRAWER_OPTIONS } from '../const';
import { Game } from 'core';

const STAGE_PADDING = 0.5;

interface IHexonOptions {
  color: string;
}

// сдвиг четных рядов для корректного отображения гексонов
const getEvenXOffset = (value: number) => value % 2 !== 0 ? 0.5 : 0

interface IDrawerOptions {
  cell: {
    color: string;
    borderColor: string;
    width: number;
  },
  background: {
    color: string;
  },
  field: {
    activeColor: string;
    inactiveColor: string;
    buildingColor: string;
  }
}

class Drawer {
  game: Game;
  $ctx: CanvasRenderingContext2D;
  options: IDrawerOptions;
  stagePadding: number = STAGE_PADDING

  constructor(game: Game, options?: IDrawerOptions) {
    this.game = game;
    this.$ctx = game.$ctx;
    this.options = {
      ...INITIAL_DRAWER_OPTIONS,
      ...options
    };
  }

  draw(): void {
    const { width, height } = this.game.options;

    this.$ctx.clearRect(0, 0, width, height);
    
    this.drawBackground();
    this.drawGrid();
    this.drawBuildings();
    this.drawActors();
  }

  drawBackground(): void {
    const $ctx = this.$ctx;
    const { options: { cellSize, grid: { x, y } } } = this.game;
    const { background: { color } } = this.options;

    $ctx.beginPath();
    $ctx.fillStyle = color;
    // из-за сдвига гексонов прибавим 1 дополнительную ячейку для фона
    $ctx.fillRect(
      this.getDrawPosition(-this.stagePadding), 
      this.getDrawPosition(-this.stagePadding * 2, 'y'), 
      (x + 1.5) * cellSize.x,
      (y + 2) * cellSize.y,
    )
    $ctx.fill();
  }

  drawGrid(): void {
    const { grid: { x, y } } = this.game.options;
    const { viewOffset, stageCells } = this.game;
    const { cell: { color } } = this.options;

    const lenX = stageCells.x;
    const lenY = stageCells.y;

    const startX = Math.min(Math.max(Math.floor(viewOffset.x - 0.5), 0), x - lenX);
    const startY = Math.min(Math.max(Math.floor(viewOffset.y - 0.5), 0), y - lenY);
    const endX = startX + lenX;
    const endY = startY + lenY;

    for (let xx = startX; xx < endX; xx++) {
      for (let yy = startY; yy < endY; yy++) {
        this.drawHexon(xx, yy, { color });
      }
    }
  }

  drawHexon(x: number, y: number, options: IHexonOptions): void {
    const $ctx = this.$ctx;
    const { cell: { width, borderColor } } = this.options;

    const eventXOffset = getEvenXOffset(y);
    const xx = x + eventXOffset;

    const centerX = xx + 0.5; // центр ячейки
    const partSize = 1.5 / 3; // треть ячейки

    const yy = y - 0.25;

    const drawPolygon = () => {
      $ctx.beginPath();
      $ctx.moveTo(this.getDrawPosition(centerX), this.getDrawPosition(yy, 'y'));
      $ctx.lineTo(this.getDrawPosition(xx + 1), this.getDrawPosition(yy + partSize, 'y'));
      $ctx.lineTo(this.getDrawPosition(xx + 1), this.getDrawPosition(yy + (partSize * 2), 'y'));
      $ctx.lineTo(this.getDrawPosition(centerX), this.getDrawPosition(yy + 1 + 0.5, 'y'));
      $ctx.lineTo(this.getDrawPosition(xx), this.getDrawPosition(yy + (partSize * 2), 'y'));
      $ctx.lineTo(this.getDrawPosition(xx), this.getDrawPosition(yy + partSize, 'y'));
      $ctx.closePath();
    }

    // заливка
    $ctx.fillStyle = options.color;
    drawPolygon();
    $ctx.fill();

    // обводка
    $ctx.lineWidth = width;
    $ctx.strokeStyle = borderColor;
    $ctx.stroke();
  }

  drawActors(): void {
    const { actors } = this.game;
    const { field: { activeColor, inactiveColor } } = this.options;

    actors.forEach(actor => {
      // подсветка полей в зависимости от статуса хода
      const color = actor.canTurn ? activeColor : inactiveColor
      this.drawHexon(actor.pos.x, actor.pos.y, {
        color
      })

      actor.draw(this.game);
    })
  }

  drawBuildings(): void {
    const { buildings } = this.game;
    const { field: { buildingColor } } = this.options;

    buildings.forEach(building => {
      building.posArray.forEach((subPos: Vector) => {
        this.drawHexon(subPos.x, subPos.y, {
          color: buildingColor
        })
      });

      building.draw(this.game);
    })
  }

  getDrawPosition(coord: number, axis: 'x' | 'y' = 'x'): number {
    const { viewOffset, options: { cellSize } } = this.game;
    const viewPxOffset: Vector = this.game.convertPosition(viewOffset, true);

    if (axis === 'x') return coord * cellSize.x - viewPxOffset.x;

    return coord * cellSize.y - viewPxOffset.y;
  }

  getDrawVector(pos: Vector, basePos: Vector): Vector {
    const { x, y } = pos;
    const evenXOffset = getEvenXOffset(Math.floor(basePos.y)); // сдвиг четных рядов для корректного отображения гексонов

    return new Vector(this.getDrawPosition(x + evenXOffset), this.getDrawPosition(y, 'y'))
  }

  getDrawCellOffset(size: Vector, cellSize: Vector): Vector {
    return new Vector((size.x / cellSize.x) / 2, (size.y / cellSize.y) / 2)
  }
}

export default Drawer;