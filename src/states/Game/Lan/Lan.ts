import { Game } from 'states';
import { App } from 'app';
import { LanCore } from 'core';
import { SocketActions, SocketListeners } from 'core/LanCore/enums';
import { LanImitator } from '../LanImitator';
import { IAttackEvent, IAttackResponse } from './types';

export class Lan extends LanCore {
  game: Game;

  constructor(app: App, game: Game) {
    super(app, new LanImitator(app, game));
    this.game = game;

    this.initListeners();
  }

  initListeners(): void {
    this.subscribe(SocketListeners.attackInstance, (data: IAttackResponse) => {
      const { hp, id } = data;

      const instance = this.game.utils.instances.getInstanceById(id);
      if (instance) {
        instance.update({
          hp,
        });
      }
    });
  }

  attackInstance(options: IAttackEvent): void {
    this.emit<IAttackEvent>(SocketActions.attackInstance, options);
  }
}
