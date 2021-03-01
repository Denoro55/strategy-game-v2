import { Game } from 'core';
import { Vector } from 'components';
import { CONFIG } from 'constants/config';
import { IGameInitOptions } from './types';

const LOGS = true;
const GAME_START_TIMEOUT = 100;

const INIT_OPTIONS: IGameInitOptions = {
  player: {
    startPosition: new Vector(3, 3),
  },
  enemy: {
    startPosition: new Vector(7, 6),
  },
};

export class Menu {
  game: Game | null = null;

  constructor() {
    setTimeout(() => {
      this.startGame(INIT_OPTIONS);
    }, GAME_START_TIMEOUT);
  }

  startGame(options: IGameInitOptions): void {
    this.game = new Game('#app', CONFIG, {
      log: process.env.NODE_ENV !== 'development' ? false : LOGS,
      lan: options
    });
  }
}
