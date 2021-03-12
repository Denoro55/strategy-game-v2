import {
  IProfileInfoResponse,
  IStartGameResponse,
} from 'states/Menu/components/Lan/types';
import { CONFIG } from 'constants/config';

import { EventListener } from './EventListener';
import { Lan } from './Lan';
import { IAppOptions, IStates, IStatesConstructors } from './types';

export class App {
  $container: HTMLDivElement;
  states: IStatesConstructors;
  activeState: IStates[keyof IStates];

  lan: Lan;
  eventListener: EventListener;

  options: IAppOptions;

  client: IAppOptions['client'];
  profileInfo: IProfileInfoResponse | null = null;

  constructor(options: IAppOptions) {
    this.$container = options.container;
    this.options = options;
    this.client = options.client;
    this.states = options.states;

    this.lan = new Lan(this);
    this.eventListener = new EventListener(this);

    this.activeState = new this.states.menu(this);
    this.activeState.init();
  }

  init(): void {
    // code
  }

  setState(stateName: keyof IStates, options: any = {}): void {
    const State = this.states[stateName];

    // TODO (d.chertenko) сделать типизацию
    this.activeState = new State(this, options);
    this.activeState.init();
  }

  setProfileInfo(profileInfo: IProfileInfoResponse): void {
    this.profileInfo = profileInfo;
  }

  startGame(options: IStartGameResponse): void {
    // TODO (d.chertenko) сделать типизацию
    this.setState('game', {
      init: options,
      container: this.$container,
      config: CONFIG,
      log: process.env.NODE_ENV !== 'development' ? false : this.options.logs,
    });
  }

  clearMenu(): void {
    this.$container.innerHTML = ``;
  }
}
