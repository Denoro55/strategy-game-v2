import { App } from 'app';

export class EventListener {
  app: App;

  constructor(app: App) {
    this.app = app;

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.initListeners();
  }

  initListeners(): void {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    document.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if (key === 'ь' || key === 'm') {
      this.app.setState('menu');
    }
  }
}
