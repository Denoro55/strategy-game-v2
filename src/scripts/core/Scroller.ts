import { Vector } from 'components';
import { Game } from 'core';

interface IScrollerOptions {
  onScroll: (offset: Vector) => void;
  onMouseMove: (offset: Vector) => void;
  onMouseDown: (offset: Vector) => void;
}

class Scroller {
  game: Game;
  $canvas: HTMLCanvasElement;
  isDragging: boolean;
  options: IScrollerOptions;
  startPos: Vector;

  constructor(game: Game, options: IScrollerOptions) {
    this.game = game;
    this.$canvas = game.$canvas;
    this.options = options;

    this.startPos = new Vector(0, 0)
    this.isDragging = false;

    this.initListeners();
  }

  initListeners(): void {
    this.$canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

    this.$canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

    this.$canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this.$canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  handleMouseDown(event: MouseEvent): void {
    const { viewOffset, utils: { convertPosition } } = this.game;
    const { onMouseDown } = this.options;
    const offsetPxPosition = convertPosition(viewOffset, true);

    onMouseDown(new Vector(event.offsetX, event.offsetY))

    this.isDragging = true;
    this.startPos = new Vector(event.offsetX + offsetPxPosition.x, event.offsetY + offsetPxPosition.y);
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
}

export default Scroller;