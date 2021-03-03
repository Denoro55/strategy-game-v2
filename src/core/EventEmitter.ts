import { ISocketAction } from 'core/Lan/types';

interface IListener {
  type: string;
  cb: (data: any) => void;
}

export class Emitter {
  listeners: IListener[] = [];

  subscribe(type: string, listener: IListener['cb']): void {
    this.listeners.push({
      type,
      cb: listener,
    });
  }

  dispatch(action: ISocketAction): void {
    this.listeners.forEach((l) => {
      if (l.type === action.type) {
        console.log('=== dispatch action ===', action);
        l.cb(action.payload);
      }
    });
  }
}

const EventEmitter = new Emitter();

export { EventEmitter };
