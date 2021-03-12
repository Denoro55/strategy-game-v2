import { App } from 'app';
import { EventEmitter } from 'core';

import { SocketListeners, SocketActions } from './enums';
import { LanCoreImitator } from './LanCoreImitator';

export class LanCore {
  app: App;
  lanImitator: LanCoreImitator;

  constructor(app: App, lanImitator: LanCoreImitator) {
    this.app = app;
    this.lanImitator = lanImitator;
  }

  subscribe(type: SocketListeners, cb: (...args: any[]) => void): void {
    EventEmitter.subscribe(type, cb);
  }

  unsubscribe(type: SocketListeners, cb: (...args: any[]) => void): void {
    EventEmitter.unsubscribe(type, cb);
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
