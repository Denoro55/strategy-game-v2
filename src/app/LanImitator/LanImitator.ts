import { App } from 'app';
import { LanCoreImitator } from 'core';
import { ISocketAction } from 'core/LanCore/types';

export class LanImitator extends LanCoreImitator {
  constructor(app: App) {
    super(app);
  }

  imitateResponse(event: ISocketAction): ISocketAction {
    switch (event.type) {
      default: {
        throw new Error('no implemented method for imitatating response!');
      }
    }
  }
}
