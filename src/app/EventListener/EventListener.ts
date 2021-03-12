import { App } from 'app';

export class EventListener {
  app: App;

  constructor(app: App) {
    this.app = app;
  
    this.initListeners();
  }

  initListeners(): void {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
  }
}
