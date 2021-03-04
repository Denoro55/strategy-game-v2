import { Game } from 'core';
import { Vector } from 'components';
import { IInstanceType, OwnerType } from 'instances/types';
import { getPercent } from 'helpers';
import {
  IInstanceOptions,
  IInstanceImages,
  IInstanceUpdateOptions,
} from './types';

const HEALTHBAR_HEIGHT = 7;

export abstract class Instance {
  game: Game;

  abstract image: HTMLImageElement;
  abstract type: IInstanceType;

  abstract viewRange: number;

  abstract hp: number;
  abstract maxHp: number;

  abstract getConfig(): any;
  abstract getPositions(): Vector[];

  owner: OwnerType = 'player';

  pos: Vector;
  posArray: Vector[] = [];
  options: IInstanceOptions;
  canTurn = true;
  canAttack = true;

  constructor(game: Game, position: Vector, options: IInstanceOptions) {
    this.pos = position;
    this.options = options;
    this.game = game;
    this.owner = options.owner;

    this.setPosition(this.pos);
  }

  getImage(images: IInstanceImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  setPosition(pos: Vector): void {
    this.pos = new Vector(pos.x, pos.y);
  }

  newTurn(): void {
    this.canTurn = true;
    this.canAttack = true;
  }

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

  update(options: IInstanceUpdateOptions): void {
    const { utils } = this.game;

    if (options.hp !== undefined) {
      this.hp = options.hp;
    }

    if (options.canAttack !== undefined) {
      this.canAttack = options.canAttack;
    }

    if (options.canTurn !== undefined) {
      this.canTurn = options.canTurn;
    }

    if (this.hp <= 0) {
      utils.instances.removeInstanceById(this.options.id);
    }
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;
    const config = this.getConfig();

    const cellOffset: Vector = utils.draw.getCellOffset(config.size, cellSize);

    const pos = utils.draw.getVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.5 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, config.size.x, config.size.y);

    this.drawHealthbar();
  }
}
