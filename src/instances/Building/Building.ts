import { Game } from 'core';
import { Vector } from 'components';
import { IInstanceType, OwnerType } from 'instances/types';
import { getPercent } from 'helpers';
import {
  IBuildingOptions,
  IBuildingImages,
  BuildingNameType,
  IBuildingUpdateOptions,
} from './types';

const HEALTHBAR_HEIGHT = 7;

export abstract class Building {
  game: Game;

  abstract name: BuildingNameType;
  abstract image: HTMLImageElement;
  abstract viewRange: number;
  abstract hp: number;
  abstract maxHp: number;

  pos: Vector;
  posArray: Vector[] = [];
  options: IBuildingOptions;
  type: IInstanceType = 'building';
  owner: OwnerType = 'player';

  constructor(game: Game, position: Vector, options: IBuildingOptions) {
    this.game = game;
    this.pos = position;
    this.options = options;
    this.owner = options.owner;
    this.setPosition();
  }

  getPositions(): Vector[] {
    return this.posArray;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.buildings[this.name];
  }

  getImage(images: IBuildingImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  update(options: IBuildingUpdateOptions): void {
    const { utils } = this.game;

    if (options.hp !== undefined) {
      this.hp = options.hp;
    }

    if (this.hp <= 0) {
      utils.instances.removeInstanceById(this.options.id);
    }
  }

  abstract setPosition(): void;

  drawHealthbar(): void {
    const {
      $ctx,
      utils,
      config: {
        stage: { cellSize },
      },
    } = this.game;

    const startPos = utils.draw.getVector(
      new Vector(this.pos.x + 0.25, this.pos.y - 0.15),
      this.pos
    );

    $ctx.beginPath();
    $ctx.fillStyle = this.owner === 'enemy' ? 'red' : 'green';
    $ctx.strokeStyle = '#000';
    $ctx.lineWidth = 2;
    $ctx.rect(
      ...startPos.spread(),
      cellSize.x * getPercent(this.hp, this.maxHp, 0.5),
      HEALTHBAR_HEIGHT
    );
    $ctx.fill();
    $ctx.closePath();

    $ctx.beginPath();
    $ctx.rect(...startPos.spread(), cellSize.x * 0.5, HEALTHBAR_HEIGHT);
    $ctx.stroke();
    $ctx.closePath();
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;

    const config = this.getConfig();

    const cellOffset: Vector = utils.draw.getCellOffset(config.size, cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.85 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, config.size.x, config.size.y);

    this.drawHealthbar();
  }
}
