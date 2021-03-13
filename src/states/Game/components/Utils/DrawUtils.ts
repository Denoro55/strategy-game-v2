import { Instance, Actor, Building } from 'states/Game/components/instances';
import { getPercent } from 'helpers';
import { Game } from 'states';
import { Vector } from 'components';
import { getEvenXOffset } from 'helpers';

interface IDrawInstanceOptions {
  yOffset: number;
}

export class DrawUtils {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  getPosition(pos: Vector): Vector {
    const {
      viewOffset,
      config: {
        stage: { cellSize },
      },
    } = this.game;
    const viewPxOffset: Vector = this.game.utils.convertPosition(
      viewOffset,
      true
    );

    return new Vector(
      pos.x * cellSize.x - viewPxOffset.x,
      pos.y * cellSize.y - viewPxOffset.y
    );
  }

  getVector(pos: Vector, basePos: Vector): Vector {
    const { x, y } = pos;
    const evenXOffset = getEvenXOffset(Math.floor(basePos.y)); // сдвиг четных рядов для корректного отображения гексонов

    return this.getPosition(new Vector(x + evenXOffset, y));
  }

  getCellOffset(size: Vector, cellSize: Vector): Vector {
    return new Vector(size.x / cellSize.x / 2, size.y / cellSize.y / 2);
  }

  drawInstance(instance: Instance, options: IDrawInstanceOptions): void {
    const { game } = this;
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;
    const config = instance.getConfig();

    const cellOffset: Vector = utils.draw.getCellOffset(config.size, cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        instance.pos.x + 0.5 - cellOffset.x,
        instance.pos.y + (0.5 + options.yOffset) - cellOffset.y
      ),
      instance.pos
    );

    $ctx.drawImage(instance.image, pos.x, pos.y, config.size.x, config.size.y);
  }

  drawHealthbar(instance: Actor | Building): void {
    const { pos, owner, hp, maxHp } = instance;

    const { $ctx, utils, config } = this.game;
    const cellSize = config.stage.cellSize;
    const healthbarHeight = config.drawer.instance.healthbarHeight;

    const startPos = utils.draw.getVector(
      new Vector(pos.x + 0.25, pos.y - 0.15),
      pos
    );

    $ctx.beginPath();
    $ctx.fillStyle = owner === 'enemy' ? 'red' : 'green';
    $ctx.strokeStyle = '#000';
    $ctx.lineWidth = 2;
    $ctx.rect(
      ...startPos.spread(),
      cellSize.x * getPercent(hp, maxHp, 0.5),
      healthbarHeight
    );
    $ctx.fill();
    $ctx.closePath();

    $ctx.beginPath();
    $ctx.rect(...startPos.spread(), cellSize.x * 0.5, healthbarHeight);
    $ctx.stroke();
    $ctx.closePath();
  }
}
