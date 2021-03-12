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

    this.handleStartGame = this.handleStartGame.bind(this);
    this.handleGetProfileInfo = this.handleGetProfileInfo.bind(this);

    this.initListeners();
  }

  initListeners(): void {
    this.subscribe(SocketListeners.getProfileInfo, this.handleGetProfileInfo);
    this.subscribe(SocketListeners.startGame, this.handleStartGame);
  }

  destroyListeners(): void {
    this.unsubscribe(SocketListeners.getProfileInfo, this.handleGetProfileInfo);
    this.unsubscribe(SocketListeners.startGame, this.handleStartGame);
  }

  handleStartGame(options: IStartGameResponse): void {
    this.app.startGame(options);
  }

  handleGetProfileInfo(data: IProfileInfoResponse): void {
    this.app.setProfileInfo(data);
    this.menu.draw();
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
