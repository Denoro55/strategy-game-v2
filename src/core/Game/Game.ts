import { Drawer, Utils, Selector, Player, App } from 'core';
import { IStartGameResponse } from 'core/App/Lan/types';
import { CONFIG } from 'constants/config';
import { Vector } from 'components';
import { Instance } from 'instances';
import { logger } from 'helpers';

const timeLogger = logger();

interface IGameOptions {
  log: boolean;
}

export class Game {
  $container: HTMLDivElement;
  $canvas: HTMLCanvasElement;
  $ctx: CanvasRenderingContext2D;

  options: IGameOptions;
  config: typeof CONFIG;

  app: App;
  drawer: Drawer;
  utils: Utils;
  selector: Selector;
  player: Player;

  viewOffset: Vector = new Vector(0, 0); // сдвиг экрана (не в px)
  mousePos: Vector = new Vector(0, 0); // нативная позиция мышки на канвасе (в px)
  stageCells: Vector; // количество видимых ячеек по x и y

  instances: Instance[] = [];

  isInitialized = false;

  constructor(
    app: App,
    container: HTMLDivElement,
    config: typeof CONFIG,
    options: IGameOptions
  ) {
    this.app = app;
    this.$container = container;

    this.config = config;
    this.options = options;

    const { width, height, cellSize } = config.stage;

    const $canvas = document.createElement('canvas');
    $canvas.className = 'canvas-game';
    $canvas.width = width;
    $canvas.height = height;

    this.$canvas = $canvas;
    this.$ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;

    this.drawer = new Drawer(this);
    this.utils = new Utils(this);
    this.selector = new Selector(this);
    this.player = new Player(this);

    this.stageCells = new Vector(
      Math.ceil(width / cellSize.x) + 1,
      Math.ceil(height / cellSize.y) + 1
    );

    this.viewOffset = new Vector(
      -config.stage.stagePadding,
      -config.stage.stagePadding * 1.75
    );
  }

  init(options: IStartGameResponse): void {
    if (this.isInitialized) return;

    this.isInitialized = true;

    this.app.clearMenu();
    this.$container.appendChild(this.$canvas);

    this.player.init(options);

    this.render();
  }

  handleViewScroll(offset: Vector): void {
    this.viewOffset = this.utils.convertPosition(offset);
  }

  handleMouseMove(offset: Vector): void {
    this.mousePos = offset;
  }

  handleMouseClick(mousePos: Vector): void {
    const { player } = this;

    player.handleClick(mousePos);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { player } = this;
    const key = event.key.toLocaleLowerCase();

    if (event.key === 'i') {
      console.log(this);
    }

    if (key === 'r' || key === 'к') {
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
