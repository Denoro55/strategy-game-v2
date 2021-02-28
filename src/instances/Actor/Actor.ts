import { Vector } from 'components';
import { Game } from 'core';
import { Building } from 'instances';
import { IInstanceType, OwnerType } from 'instances/types';
import {
  ActorNameType,
  IActorOptions,
  IActorImages,
  IActorUpdateOptions,
} from './types';
import {
  isCellInCells,
  getCellsRange,
  getValidatedCells,
  getPercent,
} from 'helpers';

const HEALTHBAR_HEIGHT = 7;

export abstract class Actor {
  game: Game;

  abstract image: HTMLImageElement;
  abstract name: ActorNameType;
  abstract cellsForMoveRange: number;
  abstract viewRange: number;
  abstract attackRange: number;
  abstract hp: number;
  abstract maxHp: number;
  abstract damage: number;

  type: IInstanceType = 'actor';
  owner: OwnerType = 'player';

  pos: Vector;
  options: IActorOptions;
  canTurn = true;
  canAttack = true;

  constructor(game: Game, position: Vector, options: IActorOptions) {
    this.pos = position;
    this.options = options;
    this.game = game;
    this.owner = options.owner;
  }

  getImage(images: IActorImages): HTMLImageElement {
    const image = new Image();
    image.src = this.options.owner === 'player' ? images.player : images.enemy;

    return image;
  }

  getConfig(): any {
    const { game } = this;

    return game.config.actors[this.name];
  }

  setPosition(pos: Vector): void {
    this.pos = new Vector(pos.x, pos.y);
  }

  getPositions(): Vector[] {
    return [new Vector(this.pos.x, this.pos.y)];
  }

  newTurn(): void {
    this.canTurn = true;
    this.canAttack = true;
  }

  getCellsForMove(): Vector[] {
    return getCellsRange(this.pos, this.cellsForMoveRange);
  }

  getCellsForAttack(): Vector[] {
    return getCellsRange(this.pos, this.attackRange);
  }

  validateCellsForMove(
    cells: Vector[],
    blockers: (Actor | Building)[]
  ): Vector[] {
    return getValidatedCells(this.pos, this.cellsForMoveRange, cells, blockers);
  }

  getAvailableCellsForAttack(
    blockers: (Actor | Building)[]
  ): (Actor | Building)[] {
    const currentRange = getCellsRange(this.pos, this.attackRange);

    return blockers.filter(
      (blocker) =>
        isCellInCells(blocker.pos, currentRange) &&
        blocker.owner === 'enemy' &&
        blocker.type === 'actor'
    );
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

  update(options: IActorUpdateOptions): void {
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
      utils.instances.removeActorById(this.options.id);
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
