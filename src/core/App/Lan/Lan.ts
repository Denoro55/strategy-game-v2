import { EventEmitter, LanImitator, App } from 'core';
import { IClient } from 'types';

import { SocketListeners, SocketActions } from './enums';
import {
  IAttackEvent,
  IProfileInfoResponse,
  IProfileInfoEvent,
  IAttackResponse,
  IStartGameResponse,
} from './types';

export class Lan {
  app: App;
  lanImitator: LanImitator;

  constructor(app: App) {
    this.app = app;
    this.lanImitator = new LanImitator(app);

    this.initListeners();
  }

  initListeners(): void {
    const app = this.app;
    const { game } = app;
    const { utils } = game;

    this.subscribe(
      SocketListeners.attackInstance,
      (data: IAttackResponse) => {
        const { hp, id } = data;

        const instance = utils.instances.getInstanceById(id);
        if (instance) {
          instance.update({
            hp,
          });
        }
      }
    );

    this.subscribe(
      SocketListeners.getProfileInfo,
      (data: IProfileInfoResponse) => {
        this.app.setProfileInfo(data);
      }
    );

    this.subscribe(
      SocketListeners.startGame,
      (options: IStartGameResponse) => {
        app.startGame(options)
      }
    );
  }

  getProfileInfo(): void {
    this.emit<IProfileInfoEvent>(
      SocketActions.getProfileInfo,
      this.app.options.client
    );
  }

  attackInstance(options: IAttackEvent): void {
    this.emit<IAttackEvent>(SocketActions.attackInstance, options);
  }

  startGame(client: IClient): void {
    this.emit<IClient>(SocketActions.startGame, client);
  }

  subscribe(type: SocketListeners, cb: (...args: any[]) => void): void {
    EventEmitter.subscribe(type, cb);
  }

  emit<T>(type: SocketActions, options: T): void {
    EventEmitter.dispatch(
      this.lanImitator.imitateResponse({
        type,
        payload: options,
      })
    );
  }
}
