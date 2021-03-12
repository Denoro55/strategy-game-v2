import { Menu, Game } from 'states';
import { IClient } from 'types';

export interface IAppOptions {
  container: HTMLDivElement;
  isDevMode: boolean;
  client: IClient;
  socketHost: string;
  logs: boolean;
  states: IStatesConstructors
}

export interface IStates {
  menu: Menu;
  game: Game;
}

export interface IStatesConstructors {
  menu: new (...args: any[]) => Menu;
  game: new (...args: any[]) => Game;
}