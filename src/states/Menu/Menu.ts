import { App } from 'app';
import { Lan, EventListener } from './components';

export class Menu {
  app: App;
  $container: HTMLDivElement;

  lan: Lan;
  eventListener: EventListener;

  constructor(app: App) {
    this.app = app;
    this.$container = app.$container;

    this.lan = new Lan(app, this);
    this.eventListener = new EventListener(app, this);
  }

  init(): void {
    this.draw();

    this.lan.getProfileInfo();
  }

  draw(): void {
    const { profileInfo, client } = this.app;

    if (!profileInfo) {
      this.$container.innerHTML = `
      <div class="menu">
        <h3>Привет, ${client.firstName}!</h3>
        <p>Загружаем твои данные...</p>
      </div>
    `;
    } else {
      this.$container.innerHTML = `
      <div class="menu">
        <h3>Привет, ${profileInfo.firstName}!</h3>
        <p>У тебя ${profileInfo.money} ед. золота</p>
        <p>Нажми "S" чтобы начать игру</p>
        <br>
        <p>Двигай камеру с помощью мыши. Клавиша "R" - завершить ход</p>
      </div>
    `;
    }
  }
}
