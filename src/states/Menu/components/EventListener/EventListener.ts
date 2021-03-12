import { App } from 'app';
import { Menu } from 'states';

export class EventListener {
  app: App;
  menu: Menu;

  constructor(app: App, menu: Menu) {
    this.app = app;
    this.menu = menu;

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.initListeners();
  }

  initListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  destroyListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { lan } = this.menu;
    const key = event.key.toLowerCase();

    if (key === 's' || key === 'ы') {
      this.app.profileInfo && lan.startGame(this.app.client);
    }
  }
}
