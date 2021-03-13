import { Game } from 'states';
import { App } from 'app';
import { LanCore } from 'core';
import { Actor, Building } from 'states/Game/components/instances';
import { SocketActions, SocketListeners } from 'core/LanCore/enums';
import { LanImitator } from '../LanImitator';
import { IAttackEvent, IAttackResponse } from './types';

export class Lan extends LanCore {
  game: Game;

  constructor(app: App, game: Game) {
    super(app, new LanImitator(app, game));
    this.game = game;

    this.handleAttackInstance = this.handleAttackInstance.bind(this);

    this.initListeners();
  }

  initListeners(): void {
    this.subscribe(SocketListeners.attackInstance, this.handleAttackInstance);
  }

  destroyListeners(): void {
    this.unsubscribe(SocketListeners.attackInstance, this.handleAttackInstance);
  }

  handleAttackInstance(data: IAttackResponse): void {
    const { hp, id } = data;

    const instance = this.game.utils.instances.getInstanceById(id);

    if (instance && (instance instanceof Actor || instance instanceof Building)) {
      instance.update({
        hp,
      });
    }
  }

  attackInstance(options: IAttackEvent): void {
    this.emit<IAttackEvent>(SocketActions.attackInstance, options);
  }
}
