import { App } from 'core';
import { Vector } from 'components';

export class EventListener {
  app: App;
  $canvas: HTMLCanvasElement;
  isDragging: boolean;
  startPos: Vector;
  startOffset: Vector;

  constructor(app: App) {
    this.app = app;
    this.$canvas = app.game.$canvas;

    this.startPos = new Vector(0, 0);
    this.startOffset = new Vector(0, 0);
    this.isDragging = false;

    this.initListeners();
  }

  initListeners(): void {
    this.$canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

    this.$canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

    this.$canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this.$canvas.addEventListener(
      'mouseleave',
      this.handleMouseLeave.bind(this)
    );

    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    document.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  handleMouseDown(event: MouseEvent): void {
    const { game } = this.app;

    const {
      viewOffset,
      utils: { convertPosition },
    } = game;
    const offsetPxPosition = convertPosition(viewOffset, true);

    this.isDragging = true;
    this.startPos = new Vector(
      event.offsetX + offsetPxPosition.x,
      event.offsetY + offsetPxPosition.y
    );
    this.startOffset = new Vector(viewOffset.x, viewOffset.y);
  }

  handleMouseUp(event: MouseEvent): void {
    const { game } = this.app;
    const { viewOffset } = game;

    this.isDragging = false;

    const range = 0.08;

    if (
      Math.abs(viewOffset.x - this.startOffset.x) < range &&
      Math.abs(viewOffset.x - this.startOffset.x) < range
    ) {
      game.handleMouseClick(new Vector(event.offsetX, event.offsetY));
    }
  }

  handleMouseMove(event: MouseEvent): void {
    const { game } = this.app;

    const mousePos = new Vector(event.offsetX, event.offsetY);

    game.handleMouseMove(mousePos);

    if (this.isDragging) {
      game.handleViewScroll(this.startPos.diff(mousePos));
    }
  }

  handleMouseLeave(): void {
    this.isDragging = false;
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { game, lan } = this.app;

    if (event.key === 's') {
      this.app.profileInfo && lan.startGame(this.app.client);
    }

    game.handleKeyDown(event);
  }
}
