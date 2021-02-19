import Drawer from './Drawer';
import Scroller from './Scroller';
import Vector from '../components/Vector';
import { Actor, Warrior } from '../actors'

interface IGameOptions {
  width: number;
  height: number;
  cellSize: Vector;
  grid: Vector,
  log: boolean;
}

class Game {
  $container: HTMLDivElement | null;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;
  options: IGameOptions;
  drawer: Drawer;
  scroller: Scroller;
  viewOffset: Vector = new Vector(-0.5, -1);
  stageCells: Vector; // количество видимых ячеек по x и y
  actors: Actor[] = [];

  constructor(selector: string, options: IGameOptions) {
    this.$container = document.querySelector(selector);
    this.options = options;

    const { width, height, cellSize } = this.options;

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

    this.stageCells = new Vector(
      Math.ceil(width / cellSize.x) + 1, 
      Math.ceil(height / cellSize.y) + 1
    )

    this.convertPosition = this.convertPosition.bind(this)

    this.init();
  }

  init(): void {
    this.initPlayer();
    this.render();
  }

  handleViewScroll(offset: Vector): void {
    this.viewOffset = this.convertPosition(offset);
  }

  convertPosition(vector: Vector, toPx?: boolean): Vector {
    const { cellSize } = this.options;

    if (toPx) {
      return new Vector(vector.x * cellSize.x, vector.y * cellSize.y)
    }

    return new Vector(vector.x / cellSize.x, vector.y / cellSize.y)
  }

  initPlayer(): void {
    this.actors.push(new Warrior(new Vector(0, 0)))
    this.actors.push(new Warrior(new Vector(3, 3)))
    this.actors.push(new Warrior(new Vector(2, 1)))
    this.actors.push(new Warrior(new Vector(1, 1)))
  }

  render(): void {
    const { log } = this.options;

    const loop = () => {
      const time: number = performance.now()

      this.drawer.draw();

      log && console.log('Время выполнения: ', performance.now() - time);

      window.requestAnimationFrame(loop);
    }

    loop();
  }
}

export default Game;