import { Game, Lan, EventListener } from 'core';
import { IProfileInfoResponse, IStartGameResponse } from 'core/App/Lan/types';
import { CONFIG } from 'constants/config';

import { IAppOptions } from './types';

export class App {
  $container: HTMLDivElement;

  game: Game;
  lan: Lan;
  eventListener: EventListener;

  options: IAppOptions;

  client: IAppOptions['client'];
  profileInfo: IProfileInfoResponse | null = null;

  constructor(options: IAppOptions) {
    this.$container = options.container;
    this.options = options;

    this.client = options.client;

    this.game = new Game(this, options.container, CONFIG, {
      log: process.env.NODE_ENV !== 'development' ? false : options.logs
    });

    this.lan = new Lan(this);
    this.eventListener = new EventListener(this);

    this.init();
  }

  init(): void {
    this.renderMenu();

    this.lan.getProfileInfo();
  }

  setProfileInfo(profileInfo: IProfileInfoResponse): void {
    this.profileInfo = profileInfo;

    this.renderMenu();
  }

  startGame(options: IStartGameResponse): void {
    this.game.init(options);
  }

  clearMenu(): void {
    this.$container.innerHTML = ``;
  }

  renderMenu(): void {
    const { profileInfo, client } = this;

    if (!profileInfo) {
      this.$container.innerHTML = `
      <div class="menu">
        <h3>Привет, ${client.firstName}!</h3>
        <p>Загружаем твои данные...</p>
      </div>
    `;
    } else {
      this.$container.innerHTML = `
      <div class="menu">
        <h3>Привет, ${profileInfo.firstName}!</h3>
        <p>У тебя ${profileInfo.money} ед. золота</p>
        <p>Нажми "s" чтобы начать игру</p>
      </div>
    `;
    }
  }
}
