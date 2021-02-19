import { Vector } from 'components';
import { INITIAL_DRAWER_OPTIONS } from '../const';
import { Game } from 'core';
import { createHexon } from 'helpers';

interface IHexonOptions {
  color: string;
}

interface IDrawerOptions {
  cell: {
    color: string;
    borderColor: string;
    width: number;
  },
  background: {
    color: string;
  },
  field: {
    activeColor: string;
    inactiveColor: string;
    buildingColor: string;
    selectedActiveColor: string;
  }
}

class Drawer {
  game: Game;
  $ctx: CanvasRenderingContext2D;
  options: IDrawerOptions;
  stagePadding: number;

  constructor(game: Game, options?: IDrawerOptions) {
    this.game = game;
    this.$ctx = game.$ctx;
    this.options = {
      ...INITIAL_DRAWER_OPTIONS,
      ...options
    };
    this.stagePadding = game.options.stagePadding;
  }

  draw(): void {
    const { width, height } = this.game.options;

    this.$ctx.clearRect(0, 0, width, height);
    
    this.drawBackground();
    this.drawGrid();
    this.drawHighlightedHexons();
    this.drawActiveHexon();
    // this.drawHoveredHexon();
    this.drawBuildings();
    this.drawActors();
  }

  drawBackground(): void {
    const $ctx = this.$ctx;
    const { options: { cellSize, grid: { x, y } }, utils } = this.game;
    const { background: { color } } = this.options;

    $ctx.beginPath();
    $ctx.fillStyle = color;
    // из-за сдвига гексонов прибавим 1 дополнительную ячейку для фона
    $ctx.fillRect(
      utils.getDrawPosition(-this.stagePadding), 
      utils.getDrawPosition(-this.stagePadding * 2, 'y'), 
      (x + 2.5) * cellSize.x,
      (y + 3) * cellSize.y,
    )
    $ctx.fill();
  }

  drawGrid(): void {
    const { grid: { x, y } } = this.game.options;
    const { viewOffset, stageCells } = this.game;
    const { cell: { color } } = this.options;

    const lenX = stageCells.x;
    const lenY = stageCells.y;

    const startX = Math.min(Math.max(Math.floor(viewOffset.x - 0.5), 0), x - lenX);
    const startY = Math.min(Math.max(Math.floor(viewOffset.y - 0.5), 0), y - lenY);
    const endX = startX + (lenX + 1);
    const endY = startY + (lenY + 1);

    for (let xx = startX; xx < endX; xx++) {
      for (let yy = startY; yy < endY; yy++) {
        this.drawHexon(xx, yy, { color });
      }
    }
  }

  drawHighlightedHexons(): void {
    const { actors, buildings } = this.game;
    const { field: { activeColor, inactiveColor, buildingColor } } = this.options;

    actors.forEach(actor => {
      // подсветка полей в зависимости от статуса хода
      const color = actor.canTurn ? activeColor : inactiveColor
      this.drawHexon(actor.pos.x, actor.pos.y, {
        color
      })

      actor.draw(this.game);
    })

    buildings.forEach(building => {
      building.posArray.forEach((subPos: Vector) => {
        this.drawHexon(subPos.x, subPos.y, {
          color: buildingColor
        })
      });

      building.draw(this.game);
    })
  }

  // drawHoveredHexon(): void {
  //   const { field: { selectedActiveColor } } = this.options;
  //   const hoveredPos = this.game.utils.getHoveredCell(this.game.mousePos)

  //   if (hoveredPos) {
  //     this.drawHexon(hoveredPos.x, hoveredPos.y, {
  //       color: selectedActiveColor
  //     })
  //   }
  // }

  drawActiveHexon(): void {
    const { selector } = this.game;
    const { field: { selectedActiveColor } } = this.options;

    if (selector.isSelected()) {
      const selected = selector.getSelected();

      this.drawHexon(selected.pos.x, selected.pos.y, {
        color: selectedActiveColor
      })
    }
  }

  drawHexon(x: number, y: number, options: IHexonOptions): void {
    const $ctx = this.$ctx;
    const { cell: { width, borderColor } } = this.options;
    const { game: { utils } } = this;

    const hexon = createHexon(new Vector(x, y));

    const drawPolygon = () => {
      $ctx.beginPath();
      $ctx.moveTo(utils.getDrawPosition(hexon[0].x), utils.getDrawPosition(hexon[0].y, 'y'));
      for (let i = 1; i < hexon.length; i++) {
        $ctx.lineTo(utils.getDrawPosition(hexon[i].x), utils.getDrawPosition(hexon[i].y, 'y'));
      }
      $ctx.closePath();
    }

    // заливка
    $ctx.fillStyle = options.color;
    drawPolygon();
    $ctx.fill();

    // обводка
    $ctx.lineWidth = width;
    $ctx.strokeStyle = borderColor;
    $ctx.stroke();
  }

  drawActors(): void {
    const { actors } = this.game;

    actors.forEach(actor => {
      actor.draw(this.game);
    })
  }

  drawBuildings(): void {
    const { buildings } = this.game;

    buildings.forEach(building => {
      building.draw(this.game);
    })
  }
}

export default Drawer;