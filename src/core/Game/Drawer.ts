import { Game } from 'core';
import { CONFIG } from 'constants/config';
import { Vector } from 'components';
import { createHexon, isCellInCells } from 'helpers';

import { IActorSelectedEventOptions } from './Player';

interface IHexonOptions {
  color: string;
  alpha?: number;
}

export class Drawer {
  game: Game;
  $ctx: CanvasRenderingContext2D;
  config: typeof CONFIG['drawer'];
  stagePadding: number;

  debugPolygon: Vector[] = [];

  constructor(game: Game) {
    this.game = game;
    this.$ctx = game.$ctx;
    this.config = game.config.drawer;
    this.stagePadding = game.config.stage.stagePadding;

    // EventEmitter.subscribe('debugArea', (action: IActionType) => {
    //   this.debugPolygon = action.payload;
    // })
  }

  draw(): void {
    const { width, height } = this.game.config.stage;

    this.$ctx.clearRect(0, 0, width, height);

    this.drawBackground();
    this.drawGrid();
    this.drawHighlightedHexons();
    this.drawActiveHexons();
    this.drawHoveredHexon();
    this.drawInstances();
    this.drawDebug();
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
      ...utils.draw
        .getPosition(
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
    const { viewOffset, stageCells, player } = this.game;
    const {
      cell: { color },
    } = this.config;
    const { colors } = this.game.config.drawer.field;

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
        if (isCellInCells(new Vector(xx, yy), player.viewRange)) {
          this.drawHexon(xx, yy, { color });
        } else {
          this.drawHexon(xx, yy, { color: colors.invisible });
        }
      }
    }
  }

  drawHighlightedHexons(): void {
    const { instances } = this.game;
    const colors = this.config.field.colors;

    instances.forEach((instance) => {
      // подсветка полей в зависимости от статуса хода
      if (instance.type === 'building') {
        instance.posArray.forEach((subPos: Vector) => {
          this.drawHexon(subPos.x, subPos.y, {
            color: colors.building,
          });
        });
      } else {
      
        let color = '';
        if (instance.owner === 'enemy') {
          return;
        } else if (instance.owner === 'player') {
          if (!instance.canTurn && !instance.canAttack) {
            color = colors.cannotTurnAndAttack;
          } else {
            color = !instance.canTurn || !instance.canAttack ? colors.cannotTurn : colors.canTurn;
          }
        }
  
        this.drawHexon(instance.pos.x, instance.pos.y, {
          color,
          alpha: 0.5,
        });
      }
    });
  }

  drawHoveredHexon(): void {
    const { player } = this.game;
    const event = player.event;

    const {
      field: { colors },
    } = this.config;
    const hoveredPos = this.game.utils.getHoveredCell(this.game.mousePos);

    // выбран активный объект
    if (hoveredPos && event && event.type === 'actorSelected') {
      // клетки для движения
      if (isCellInCells(hoveredPos, event.options.availableCellsForMove)) {
        this.drawHexon(hoveredPos.x, hoveredPos.y, {
          color: colors.hover,
        });
      }

      // клетки врагов для атаки
      if (isCellInCells(hoveredPos, event.options.availableBlockersCellsForAttack)) {
        this.drawHexon(hoveredPos.x, hoveredPos.y, {
          color: colors.enemyHover,
        });
      }
    }
  }

  drawActiveHexons(): void {
    const { player } = this.game;
    const colors = this.config.field.colors;
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
      eventOptions.availableCellsForMove.forEach((activeCell) => {
        this.drawHexon(activeCell.x, activeCell.y, {
          color: colors.activeCell,
          alpha: 0.8,
        });
      });

      // позиции врагов
      eventOptions.availableBlockersCellsForAttack.forEach((pos) => {
        this.drawHexon(pos.x, pos.y, {
          color: colors.enemy,
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
        ...utils.draw.getPosition(new Vector(hexon[0].x, hexon[0].y)).spread()
      );
      for (let i = 1; i < hexon.length; i++) {
        $ctx.lineTo(
          ...utils.draw.getPosition(new Vector(hexon[i].x, hexon[i].y)).spread()
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

  drawInstances(): void {
    const { instances, player } = this.game;
    
    instances.forEach((instance) => {
      if (instance.owner === 'enemy' && !isCellInCells(instance.pos, player.viewRange)) {
        return;
      }

      instance.draw(this.game);
    });
  }

  drawDebug(): void {
    const $ctx = this.$ctx;
    const { debugPolygon } = this;
    const {
      game: { utils },
    } = this;

    $ctx.beginPath();
    $ctx.fillStyle = 'black';

    debugPolygon.forEach((point, index) => {
      if (index === 0) {
        $ctx.moveTo(...utils.draw.getPosition(point).spread());
      } else {
        $ctx.lineTo(...utils.draw.getPosition(point).spread());
      }
    });

    $ctx.closePath();
    $ctx.fill();
  }
}
