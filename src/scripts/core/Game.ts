import Drawer from './Drawer';
import Scroller from './Scroller';
import Vector from '../components/Vector';

interface IGameOptions {
  width: number;
  height: number;
  cellSize: number;
  grid: {
    x: number;
    y: number;
    offset: number;
  }
}

class Game {
  $container: HTMLDivElement | null;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;
  options: IGameOptions;
  drawer: Drawer;
  scroller: Scroller;
  viewOffset: Vector = new Vector(0, 0);

  constructor(selector: string, options: IGameOptions) {
    this.$container = document.querySelector(selector);
    this.options = options;

    const { width, height } = this.options;

    const $canvas = document.createElement('canvas');
    $canvas.className = 'canvas-game';
    $canvas.width = width;
    $canvas.height = height;
    this.$container?.appendChild($canvas);

    this.$canvas = $canvas;
    this.$ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;
    this.drawer = new Drawer(this);
    this.scroller = new Scroller(this, {
      onScroll: this.handleViewScroll.bind(this)
    });

    this.init();
  }

  init(): void {
    this.drawer.draw();
  }

  handleViewScroll(offset: Vector): void {
    this.viewOffset = offset;
    this.drawer.draw();
  }
}

export default Game;