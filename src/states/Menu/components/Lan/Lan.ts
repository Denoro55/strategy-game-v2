import { Menu } from 'states';
import { App } from 'app';
import { LanCore } from 'core';
import { IClient } from 'types';
import { SocketActions, SocketListeners } from 'core/LanCore/enums';
import { LanImitator } from '../LanImitator';
import {
  IProfileInfoEvent,
  IProfileInfoResponse,
  IStartGameResponse,
} from './types';

export class Lan extends LanCore {
  menu: Menu;

  constructor(app: App, menu: Menu) {
    super(app, new LanImitator(app));
    this.menu = menu;

    this.initListeners();
  }

  initListeners(): void {
    this.subscribe(
      SocketListeners.getProfileInfo,
      (data: IProfileInfoResponse) => {
        this.app.setProfileInfo(data);
        this.menu.draw();
      }
    );

    this.subscribe(SocketListeners.startGame, (options: IStartGameResponse) => {
      this.app.startGame(options);
    });
  }

  getProfileInfo(): void {
    this.emit<IProfileInfoEvent>(
      SocketActions.getProfileInfo,
      this.app.options.client
    );
  }

  startGame(client: IClient): void {
    this.emit<IClient>(SocketActions.startGame, client);
  }
}
