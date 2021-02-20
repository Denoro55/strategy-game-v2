import 'assets/styles/index.scss';

import { Game } from 'core';
import config from 'config';

const LOGS = false;

new Game('#app', config, {
  log: process.env.NODE_ENV !== 'development' ? false : LOGS
})
