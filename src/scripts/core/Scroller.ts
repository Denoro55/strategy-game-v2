import Vector from '../components/Vector';
import Game from './Game';

interface IScrollerOptions {
  onScroll: (offset: Vector) => void
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
    const { viewOffset, convertPosition } = this.game;
    const offsetPxPosition = convertPosition(viewOffset, true);

    this.isDragging = true;
    this.startPos = new Vector(event.offsetX + offsetPxPosition.x, event.offsetY + offsetPxPosition.y);
  }

  handleMouseUp(): void {
    this.isDragging = false;
  }

  handleMouseMove(event: MouseEvent): void {
    const { onScroll } = this.options;

    if (this.isDragging) {
      const newPosition: Vector = new Vector(event.offsetX, event.offsetY);
      onScroll(this.startPos.diff(newPosition));
    }
  }

  handleMouseLeave(): void {
    this.isDragging = false;
  }
}

export default Scroller;