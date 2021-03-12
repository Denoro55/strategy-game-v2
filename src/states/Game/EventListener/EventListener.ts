import { Game } from 'states';
import { Vector } from 'components';

export class EventListener {
  game: Game;
  $canvas: HTMLCanvasElement;
  isDragging: boolean;
  startPos: Vector;
  startOffset: Vector;

  constructor(game: Game) {
    this.game = game;
    this.$canvas = game.$canvas;

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
  }

  handleMouseDown(event: MouseEvent): void {
    const { game } = this;

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
    const { game } = this;
    const { viewOffset, player } = game;

    this.isDragging = false;

    const range = 0.08;

    if (
      Math.abs(viewOffset.x - this.startOffset.x) < range &&
      Math.abs(viewOffset.x - this.startOffset.x) < range
    ) {
      player.handleClick(new Vector(event.offsetX, event.offsetY));
    }
  }

  handleMouseMove(event: MouseEvent): void {
    const { game } = this;

    const mousePos = new Vector(event.offsetX, event.offsetY);

    game.mousePos = mousePos;

    if (this.isDragging) {
      game.viewOffset = game.utils.convertPosition(this.startPos.diff(mousePos));
    }
  }

  handleMouseLeave(): void {
    this.isDragging = false;
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { player } = this.game;
    const key = event.key.toLocaleLowerCase();

    if (event.key === 'i') {
      console.log(this);
    }

    if (key === 'r' || key === 'к') {
      player.refreshTurn();
    }
  }
}
