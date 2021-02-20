import '../styles/index.scss';

import { Game } from 'core';
import config from 'config';

const LOGS = true;

new Game('#app', config, {
  log: process.env.NODE_ENV !== 'development' ? false : LOGS
})
