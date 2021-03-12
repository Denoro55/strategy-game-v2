import { App } from 'app';
import { LanCore } from 'core';

import { LanImitator } from '../LanImitator';

export class Lan extends LanCore {
  constructor(app: App) {
    super(app, new LanImitator(app));

    this.initListeners();
  }

  initListeners(): void {
    // code
  }
}
