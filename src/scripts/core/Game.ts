import { Drawer, Scroller, Utils, Selector } from 'core';
import { Vector, Actor, Building } from 'components';
import { Warrior } from 'actors';
import { MainBuilding } from 'buildings';

interface IGameOptions {
  width: number;
  height: number;
  cellSize: Vector;
  grid: Vector,
  log: boolean;
  stagePadding: number;
}

class Game {
  $container: HTMLDivElement | null;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;

  options: IGameOptions;

  drawer: Drawer;
  scroller: Scroller;
  utils: Utils;
  selector: Selector;

  viewOffset: Vector = new Vector(-0.5, -1); // сдвиг экрана (не в px)
  mousePos: Vector = new Vector(0, 0); // нативная позиция мышки на канвасе (в px)
  stageCells: Vector; // количество видимых ячеек по x и y

  actors: Actor[] = [];
  buildings: Building[] = [];

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
    this.utils = new Utils(this);
    this.selector = new Selector(this);
    this.scroller = new Scroller(this, {
      onScroll: this.handleViewScroll.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseDown: this.handleMouseDown.bind(this),
    });

    this.stageCells = new Vector(
      Math.ceil(width / cellSize.x) + 1, 
      Math.ceil(height / cellSize.y) + 1
    )

    this.init();
  }

  init(): void {
    this.initPlayer();
    this.render();
  }

  handleViewScroll(offset: Vector): void {
    this.viewOffset = this.utils.convertPosition(offset);
  }

  handleMouseMove(offset: Vector): void {
    this.mousePos = offset;
  }

  handleMouseDown(mousePos: Vector): void {
    const clickedCellPos = this.utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      this.selector.select(clickedCellPos);
    }
  }

  initPlayer(): void {
    this.actors.push(new Warrior(new Vector(0, 0)))
    this.actors.push(new Warrior(new Vector(3, 3)))
    this.actors.push(new Warrior(new Vector(2, 1)))
    this.actors.push(new Warrior(new Vector(1, 1)))
    this.buildings.push(new MainBuilding(new Vector(1, 3)))
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