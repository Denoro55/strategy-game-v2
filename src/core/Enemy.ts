import { Game } from 'core';
import { Vector } from 'components';

export class Enemy {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  init(): void {
    const { options } = this.game;
    const basePos = options.lan.enemy.startPosition;

    this.spawnBase(basePos);
  }

  spawnBase(basePos: Vector): void {
    const { utils } = this.game;

    utils.instances.spawnBase(basePos, 'enemy');
  }
}
