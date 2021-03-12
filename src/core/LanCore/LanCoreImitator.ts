import { App } from 'app';
import { ISocketAction } from './types';

export abstract class LanCoreImitator {
  app: App;
  abstract imitateResponse(event: ISocketAction): ISocketAction;

  constructor(app: App) {
    this.app = app;
  }
}
