import 'assets/styles/index.scss';

import { Game } from 'core';
import { CONFIG } from 'constants/config';

const LOGS = true;

new Game('#app', CONFIG, {
  log: process.env.NODE_ENV !== 'development' ? false : LOGS,
});
