import '../styles/index.scss';
import { Game } from 'core';
import { Vector } from 'components';

const LOGS = true;

new Game('#app', {
  width: 800,
  height: 600,
  cellSize: new Vector(120, 80),
  grid: new Vector(15, 15),
  log: process.env.NODE_ENV !== 'development' ? false : LOGS
})
