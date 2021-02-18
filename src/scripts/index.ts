import '../styles/index.scss';
import Game from './core/Game';

new Game('#app', {
  width: 800,
  height: 600,
  cellSize: { x: 90, y: 60 },
  grid: { x: 15, y: 15 },
  log: true
})