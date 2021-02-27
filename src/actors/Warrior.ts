import { Vector } from 'components';
import { Actor } from 'instances';
import {
  ActorNameType,
  IActorOptions,
} from 'instances/Actor/types';
import { Game } from 'core';
import spriteUrl from 'assets/images/actors/warrior.png';

export class Warrior extends Actor {
  image: HTMLImageElement;
  name: ActorNameType = 'warrior';
  cellsForMoveRange = 4;
  viewRange = 4;
  attackRange = 1;

  constructor(game: Game, pos: Vector, options: IActorOptions) {
    super(game, pos, options);
    this.image = this.getImage({
      player: spriteUrl,
      enemy: spriteUrl
    });
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
