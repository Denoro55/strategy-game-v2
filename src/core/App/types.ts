import { IClient } from 'types';

export interface IAppOptions {
  container: HTMLDivElement;
  isDevMode: boolean;
  client: IClient;
  socketHost: string;
  logs: boolean;
}
