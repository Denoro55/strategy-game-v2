import { CONFIG } from 'constants/config';
import {
  Drawer,
  EventListener,
  Utils,
  Selector,
  Player,
  Lan,
} from 'core';
import { Vector } from 'components';
import { Actor, Building } from 'instances';
import { logger } from 'helpers';

const timeLogger = logger();

interface IGameOptions {
  log: boolean;
}

export class Game {
  $container: HTMLDivElement | null;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;

  options: IGameOptions;
  config: typeof CONFIG;

  drawer: Drawer;
  eventListener: EventListener;
  utils: Utils;
  selector: Selector;
  player: Player;
  lan: Lan;

  viewOffset: Vector = new Vector(0, 0); // сдвиг экрана (не в px)
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
    this.lan = new Lan(this);

    this.eventListener = new EventListener(this, {
      onScroll: this.handleViewScroll.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseDown: this.handleMouseDown.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      onMouseClick: this.handleMouseClick.bind(this),
    });

    this.stageCells = new Vector(
      Math.ceil(width / cellSize.x) + 1,
      Math.ceil(height / cellSize.y) + 1
    );

    this.viewOffset = new Vector(
      -config.stage.stagePadding,
      -config.stage.stagePadding * 1.75
    );

    this.init();
  }

  init(): void {
    this.player.init();
    this.render();
  }

  handleViewScroll(offset: Vector): void {
    this.viewOffset = this.utils.convertPosition(offset);
  }

  handleMouseMove(offset: Vector): void {
    this.mousePos = offset;
  }

  handleMouseDown(): void {
    return;
  }

  handleMouseClick(mousePos: Vector): void {
    const { player } = this;

    player.handleClick(mousePos);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { player } = this;


    if (event.key === 'i') {
      console.log(this);
    }

    if (event.key === 'r') {
      player.refreshTurn();
    }
  }

  render(): void {
    const { log } = this.options;

    const loop = () => {
      const time: number = performance.now();

      this.drawer.draw();

      log && timeLogger('Время выполнения: ' + (performance.now() - time));

      window.requestAnimationFrame(loop);
    };

    loop();
  }
}
