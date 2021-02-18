import Vector from '../components/Vector';
import { INITIAL_DRAWER_OPTIONS } from '../const';
import Game from './Game';

const CELL_WIDTH_COEF = 0.15;
const STAGE_PADDING = 0.25;

interface IDrawerOptions {
  cell: {
    color: string,
    borderColor: string
    width: number
  },
  background: {
    color: string;
  }
}

class Drawer {
  game: Game;
  $ctx: CanvasRenderingContext2D;
  options: IDrawerOptions;

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
  }

  drawBackground(): void {
    const $ctx = this.$ctx;
    const { options: { cellSize, grid: { x, y } } } = this.game;
    const { background: { color } } = this.options;

    $ctx.beginPath();
    $ctx.fillStyle = color;
    // из-за сдвига гексонов прибавим 1 дополнительную ячейку для фона
    $ctx.fillRect(
      this.getDrawPosition(0), 
      this.getDrawPosition(0, 'y'), 
      (x + 1) * cellSize.x,
      (y + 1) * cellSize.y,
    )
    $ctx.fill();
  }

  drawGrid(): void {
    const { grid: { x, y } } = this.game.options;
    const { viewOffset, stageCells } = this.game;

    const lenX = stageCells.x;
    const lenY = stageCells.y;

    const startX = Math.min(Math.max(Math.floor(0 - viewOffset.x), 0), x - lenX);
    const startY = Math.min(Math.max(Math.floor(0 - viewOffset.y), 0), y - lenY);
    const endX = startX + lenX;
    const endY = startY + lenY;

    for (let xx = startX; xx < endX; xx++) {
      for (let yy = startY; yy < endY; yy++) {
        const xOffset = yy % 2 !== 0 ? 0.5 : 0; // сдвиг четных рядов для корректного отображения гексонов
        this.drawHexon(xx + xOffset + STAGE_PADDING, yy + STAGE_PADDING + (CELL_WIDTH_COEF * 2));
      }
    }
  }

  drawHexon(x: number, y: number): void {
    const $ctx = this.$ctx;
    const { cell: { width, borderColor, color } } = this.options;

    const centerX = x + 0.5; // центр ячейки
    const partSize = 1 / 3; // треть ячейки
    const sideOffset = CELL_WIDTH_COEF;

    const drawPolygon = () => {
      $ctx.beginPath();
      $ctx.moveTo(this.getDrawPosition(centerX), this.getDrawPosition(y, 'y'));
      $ctx.lineTo(this.getDrawPosition(x + 1 - sideOffset), this.getDrawPosition(y + partSize, 'y'));
      $ctx.lineTo(this.getDrawPosition(x + 1 - sideOffset), this.getDrawPosition(y + (partSize * 2), 'y'));
      $ctx.lineTo(this.getDrawPosition(centerX), this.getDrawPosition(y + 1, 'y'));
      $ctx.lineTo(this.getDrawPosition(x + sideOffset), this.getDrawPosition(y + (partSize * 2), 'y'));
      $ctx.lineTo(this.getDrawPosition(x + sideOffset), this.getDrawPosition(y + partSize, 'y'));
      $ctx.closePath();
    }

    // заливка
    $ctx.fillStyle = color;
    drawPolygon();
    $ctx.fill();

    // обводка
    $ctx.lineWidth = width;
    $ctx.strokeStyle = borderColor;
    drawPolygon();
    $ctx.stroke();
  }

  getDrawPosition(coord: number, axis: 'x' | 'y' = 'x'): number {
    const { viewOffset, options: { cellSize } } = this.game;
    const viewPxOffset: Vector = this.game.convertPosition(viewOffset, true);

    if (axis === 'x') return coord * cellSize.x + viewPxOffset.x;

    return coord * cellSize.y + viewPxOffset.y;
  }
}

export default Drawer;