import '../styles/index.scss';
import Game from './core/Game';
import Vector from './components/Vector';

new Game('#app', {
  width: 800,
  height: 600,
  cellSize: new Vector(120, 80),
  grid: new Vector(15, 15),
  log: true
})