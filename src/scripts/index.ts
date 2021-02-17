import '../styles/index.scss';
import Game from './core/Game';

new Game('#app', {
  width: 800,
  height: 600,
  cellSize: 80,
  grid: {
    x: 30,
    y: 30,
    offset: 1
  }
})