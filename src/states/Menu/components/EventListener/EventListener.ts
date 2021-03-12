import { App } from 'app';
import { Menu } from 'states';

export class EventListener {
  app: App;
  menu: Menu;

  constructor(app: App, menu: Menu) {
    this.app = app;
    this.menu = menu;

    this.initListeners();
  }

  initListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { lan } = this.menu;
    const key = event.key.toLowerCase();

    if (key === 's' || key === 'ы') {
      this.app.profileInfo && lan.startGame(this.app.client);
    }
  }
}
