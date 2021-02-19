import Vector from '../components/Vector';
import Game from '../core/Game';

export interface IActorOptions {

}

class Actor {
  pos: Vector;
  options: IActorOptions;

  constructor(position: Vector, options: IActorOptions) {
    this.pos = position;
    this.options = options;
  }

  getImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;

    return image;
  }

  draw(game: Game): void {}
}

export default Actor;