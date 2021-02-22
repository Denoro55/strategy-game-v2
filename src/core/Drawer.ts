import { CONFIG } from 'constants/config';
import { IActorSelectedEventOptions } from './Player';
import { Vector } from 'components';
import { Game } from 'core';
import { createHexon, isPointInCells } from 'helpers';

interface IHexonOptions {
  color: string;
  alpha?: number;
}

export class Drawer {
  game: Game;
  $ctx: CanvasRenderingContext2D;
  config: typeof CONFIG['drawer'];
  stagePadding: number;

  constructor(game: Game) {
    this.game = game;
    this.$ctx = game.$ctx;
    this.config = game.config.drawer;
    this.stagePadding = game.config.stage.stagePadding;
  }

  draw(): void {
    const { width, height } = this.game.config.stage;

    this.$ctx.clearRect(0, 0, width, height);

    this.drawBackground();
    this.drawGrid();
    this.drawHighlightedHexons();
    this.drawActiveHexons();
    this.drawHoveredHexon();
    this.drawBuildings();
    this.drawActors();
  }

  drawBackground(): void {
    const $ctx = this.$ctx;
    const {
      config: {
        stage: {
          cellSize,
          grid: { x, y },
        },
      },
      utils,
    } = this.game;
    const {
      background: { color },
    } = this.config;

    // TODO: нужно доделать размеры (правый край) в зависимости от паддинга экрана
    $ctx.beginPath();
    $ctx.fillStyle = color;
    // из-за сдвига гексонов прибавим 1 дополнительную ячейку для фона
    $ctx.fillRect(
      ...utils
        .getDrawPosition(
          new Vector(-this.stagePadding, -this.stagePadding * 1.75)
        )
        .spread(),
      (x + 0.5 + this.stagePadding * 2) * cellSize.x,
      (y + 0.25 + this.stagePadding * 3.25) * cellSize.y
    );
    $ctx.fill();
  }

  drawGrid(): void {
    const {
      grid: { x, y },
    } = this.game.config.stage;
    const { viewOffset, stageCells } = this.game;
    const {
      cell: { color },
    } = this.config;

    const lenX = stageCells.x;
    const lenY = stageCells.y;

    const startX = Math.min(
      Math.max(Math.floor(viewOffset.x - 0.5), 0),
      x - lenX
    );
    const startY = Math.min(
      Math.max(Math.floor(viewOffset.y - 0.5), 0),
      y - lenY
    );
    const endX = startX + lenX;
    const endY = startY + lenY;

    for (let xx = startX; xx < endX; xx++) {
      for (let yy = startY; yy < endY; yy++) {
        this.drawHexon(xx, yy, { color });
      }
    }
  }

  drawHighlightedHexons(): void {
    const { actors, buildings } = this.game;
    const colors = this.config.field.color;

    actors.forEach((actor) => {
      // подсветка полей в зависимости от статуса хода
      const color = actor.canTurn ? colors.canTurn : colors.cannotTurn;
      this.drawHexon(actor.pos.x, actor.pos.y, {
        color,
        alpha: 0.5,
      });

      actor.draw(this.game);
    });

    buildings.forEach((building) => {
      building.posArray.forEach((subPos: Vector) => {
        this.drawHexon(subPos.x, subPos.y, {
          color: colors.building,
        });
      });

      building.draw(this.game);
    });
  }

  drawHoveredHexon(): void {
    const { player } = this.game;
    const event = player.event;

    const { field: { color } } = this.config;
    const hoveredPos = this.game.utils.getHoveredCell(this.game.mousePos);

    // выбран активный объект
    if (event && event.type === 'actorSelected') {
      if (hoveredPos && isPointInCells(hoveredPos, event.options.activeTurnCells)) {
        this.drawHexon(hoveredPos.x, hoveredPos.y, {
          color: color.hover
        })
      }
    }
  }

  drawActiveHexons(): void {
    const { player } = this.game;
    const colors = this.config.field.color;
    const event = player.event;

    // выбран активный объект
    if (event && event.type === 'actorSelected') {
      const eventOptions = event.options as IActorSelectedEventOptions;
      const selected = eventOptions.selected;

      // позиция объекта
      this.drawHexon(selected.pos.x, selected.pos.y, {
        color: colors.selectedActor,
        alpha: 0.5,
      });

      // позиции доступных ходов
      eventOptions.activeTurnCells.forEach((activeCell) => {
        this.drawHexon(activeCell.x, activeCell.y, {
          color: colors.activeCell,
          alpha: 0.8,
        });
      });
    }
  }

  drawHexon(x: number, y: number, options: IHexonOptions): void {
    const $ctx = this.$ctx;
    const {
      cell: { width, borderColor },
    } = this.config;
    const {
      game: { utils },
    } = this;

    const hexon = createHexon(new Vector(x, y));

    const alpha = options.alpha ?? 1;
    $ctx.globalAlpha = alpha;

    const drawPolygon = () => {
      $ctx.beginPath();
      $ctx.moveTo(
        ...utils.getDrawPosition(new Vector(hexon[0].x, hexon[0].y)).spread()
      );
      for (let i = 1; i < hexon.length; i++) {
        $ctx.lineTo(
          ...utils.getDrawPosition(new Vector(hexon[i].x, hexon[i].y)).spread()
        );
      }
      $ctx.closePath();
    };

    // заливка
    $ctx.fillStyle = options.color;
    drawPolygon();
    $ctx.fill();

    // обводка
    $ctx.lineWidth = width;
    $ctx.strokeStyle = borderColor;
    $ctx.stroke();

    $ctx.globalAlpha = 1;
  }

  drawActors(): void {
    const { actors } = this.game;

    actors.forEach((actor) => {
      actor.draw(this.game);
    });
  }

  drawBuildings(): void {
    const { buildings } = this.game;

    buildings.forEach((building) => {
      building.draw(this.game);
    });
  }
}
