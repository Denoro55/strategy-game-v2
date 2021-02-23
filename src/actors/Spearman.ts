import { Vector } from 'components';
import { Actor } from 'instances';
import { IActorOptions } from 'instances/Actor/Actor';
import {
  ActorNameType,
  ValidatorType,
  MoveVariantType,
} from 'instances/Actor/types';
import { Game } from 'core';
import spriteUrl from 'assets/images/actors/spearman.png';

export class Spearman extends Actor {
  image: HTMLImageElement;
  name: ActorNameType = 'spearman';
  cellsForMoveVariant: MoveVariantType = '1';
  validatorType: ValidatorType = null;

  constructor(game: Game, pos: Vector, options: IActorOptions = {}) {
    super(game, pos, options);
    this.image = this.getImage(spriteUrl);
  }

  draw(game: Game): void {
    const { $ctx, utils } = game;
    const { cellSize } = game.config.stage;
    const config = this.getConfig();

    const cellOffset: Vector = utils.getDrawCellOffset(config.size, cellSize);

    const pos = utils.getDrawVector(
      new Vector(
        this.pos.x + 0.5 - cellOffset.x,
        this.pos.y + 0.5 - cellOffset.y
      ),
      this.pos
    );

    $ctx.drawImage(this.image, pos.x, pos.y, config.size.x, config.size.y);
  }
}
