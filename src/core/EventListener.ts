import { Vector } from 'components';
import { Game } from 'core';

interface IScrollerOptions {
  onScroll: (offset: Vector) => void;
  onMouseMove: (offset: Vector) => void;
  onMouseDown: (offset: Vector) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onMouseClick: (event: Vector) => void;
}

export class EventListener {
  game: Game;
  $canvas: HTMLCanvasElement;
  isDragging: boolean;
  options: IScrollerOptions;
  startPos: Vector;

  constructor(game: Game, options: IScrollerOptions) {
    this.game = game;
    this.$canvas = game.$canvas;
    this.options = options;

    this.startPos = new Vector(0, 0);
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

    this.$canvas.addEventListener('click', this.handleMouseClick.bind(this));

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleMouseDown(event: MouseEvent): void {
    const {
      viewOffset,
      utils: { convertPosition },
    } = this.game;
    const { onMouseDown } = this.options;
    const offsetPxPosition = convertPosition(viewOffset, true);

    onMouseDown(new Vector(event.offsetX, event.offsetY));

    this.isDragging = true;
    this.startPos = new Vector(
      event.offsetX + offsetPxPosition.x,
      event.offsetY + offsetPxPosition.y
    );
  }

  handleMouseClick(event: MouseEvent): void {
    const { onMouseClick } = this.options;

    onMouseClick(new Vector(event.offsetX, event.offsetY));
  }

  handleMouseUp(): void {
    this.isDragging = false;
  }

  handleMouseMove(event: MouseEvent): void {
    const { onScroll, onMouseMove } = this.options;

    const mousePos = new Vector(event.offsetX, event.offsetY);

    onMouseMove(mousePos);

    if (this.isDragging) {
      onScroll(this.startPos.diff(mousePos));
    }
  }

  handleMouseLeave(): void {
    this.isDragging = false;
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { onKeyDown } = this.options;

    onKeyDown(event);
  }
}
