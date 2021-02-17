import { INITIAL_DRAWER_OPTINS } from '../const';
import Game from './Game';

interface IDrawerOptions {
  cell: {
    color: string,
    borderColor: string
    width: number
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
      ...INITIAL_DRAWER_OPTINS,
      ...options
    };
  }

  draw(): void {
    const { width, height } = this.game.options;

    this.$ctx.clearRect(0, 0, width, height);
    this.drawGrid();
  }

  drawGrid(): void {
    const { grid: { x, y, offset }, cellSize } = this.game.options;

    for (let xx = 0; xx < x; xx++) {
      for (let yy = 0; yy < y; yy++) {
        this.drawCell(xx, yy, cellSize, offset);
      }
    }
  }

  drawCell(x: number, y: number, cellSize: number, offset: number): void {
    const $ctx = this.$ctx;
    const { viewOffset } = this.game;
    const { cell: { width, color, borderColor } } = this.options;

    $ctx.beginPath();
    $ctx.lineWidth = width;
    $ctx.fillStyle = color;
    $ctx.fillRect(x * cellSize + offset + viewOffset.x, y * cellSize + offset + viewOffset.y, cellSize, cellSize);
    $ctx.fill();

    $ctx.beginPath();
    $ctx.lineWidth = width;
    $ctx.strokeStyle = borderColor;
    $ctx.rect(x * cellSize + offset + viewOffset.x, y * cellSize + offset + viewOffset.y, cellSize, cellSize);
    $ctx.stroke();
  }
}

export default Drawer;