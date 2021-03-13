import { Building, Actor, Neutral } from 'states/Game/components/instances';
import { App } from 'app';
import {
  Drawer,
  Utils,
  Selector,
  Player,
  EventListener,
  Lan,
} from './components';
import { CONFIG } from 'constants/config';
import { Vector } from 'components';
import { logger } from 'helpers';
import { IStartGameResponse } from 'states/Menu/components/Lan/types';

const timeLogger = logger();

interface IGameOptions {
  init: IStartGameResponse;
  log: boolean;
  container: HTMLDivElement;
  config: typeof CONFIG;
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
  eventListener: EventListener;
  lan: Lan;

  viewOffset: Vector = new Vector(0, 0); // сдвиг экрана (не в px)
  mousePos: Vector = new Vector(0, 0); // нативная позиция мышки на канвасе (в px)
  stageCells: Vector; // количество видимых ячеек по x и y

  actors: Actor[] = [];
  buildings: Building[] = [];
  neutrals: Neutral[] = []

  isInitialized = false;
  isDestroyed = false;

  constructor(app: App, options: IGameOptions) {
    this.app = app;
    this.$container = options.container;

    this.config = options.config;
    this.options = options;

    const { width, height, cellSize } = options.config.stage;

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
    this.eventListener = new EventListener(this);
    this.lan = new Lan(app, this);

    this.stageCells = new Vector(
      Math.ceil(width / cellSize.x) + 1,
      Math.ceil(height / cellSize.y) + 1
    );

    this.viewOffset = new Vector(
      -this.config.stage.stagePadding,
      -this.config.stage.stagePadding * 1.75
    );
  }

  init(): void {
    if (this.isInitialized) return;

    this.isInitialized = true;

    this.app.clearMenu();
    this.$container.appendChild(this.$canvas);

    this.player.init(this.options.init);

    this.render();
  }

  destroy(): void {
    this.eventListener.destroyListeners();
    this.lan.destroyListeners();
    this.isDestroyed = true;
  }

  render(): void {
    const { log } = this.options;

    const loop = () => {
      if (this.isDestroyed) return;

      const time: number = performance.now();

      this.drawer.draw();

      log && timeLogger('Время выполнения: ' + (performance.now() - time));

      window.requestAnimationFrame(loop);
    };

    loop();
  }
}
