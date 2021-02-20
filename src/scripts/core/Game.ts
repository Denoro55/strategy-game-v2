import CONFIG from 'config';
import { Drawer, Scroller, Utils, Selector, Player } from 'core';
import { Vector } from 'components';
import { Actor, Building } from 'instances';
import { Warrior } from 'actors';
import { MainBuilding } from 'buildings';

interface IGameOptions {
  log: boolean;
}

class Game {
  $container: HTMLDivElement | null;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;

  options: IGameOptions;
  config: typeof CONFIG;

  drawer: Drawer;
  scroller: Scroller;
  utils: Utils;
  selector: Selector;
  player: Player;

  viewOffset: Vector = new Vector(-0.5, -1); // сдвиг экрана (не в px)
  mousePos: Vector = new Vector(0, 0); // нативная позиция мышки на канвасе (в px)
  stageCells: Vector; // количество видимых ячеек по x и y

  actors: Actor[] = [];
  buildings: Building[] = [];

  constructor(selector: string, config: typeof CONFIG, options: IGameOptions) {
    this.$container = document.querySelector(selector);

    this.config = config;
    this.options = options;

    const { width, height, cellSize } = config.stage;

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
    this.player = new Player(this);
    this.scroller = new Scroller(this, {
      onScroll: this.handleViewScroll.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseDown: this.handleMouseDown.bind(this),
      onKeyDown: this.handleKeyDown.bind(this)
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
    const { selector, player } = this;
    const clickedCellPos = this.utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      selector.select(clickedCellPos);

      if (selector.selected.instance) {
        player.handleSelect(selector.selected);
      }
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'i') {
      console.log(this);
    }
  }

  initPlayer(): void {
    this.actors.push(new Warrior(new Vector(0, 0)))
    this.actors.push(new Warrior(new Vector(3, 3)))
    this.actors.push(new Warrior(new Vector(2, 1)))
    this.actors.push(new Warrior(new Vector(1, 1)))
    this.actors.push(new Warrior(new Vector(2, 3)))
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