export interface IActionType<T> {
  type: string;
  payload: T;
}

interface IListener {
  type: string;
  cb: (action: IActionType<any>) => void;
}

export class Emitter {
  listeners: IListener[] = [];

  subscribe(type: string, listener: IListener['cb']): void {
    this.listeners.push({
      type,
      cb: listener,
    });
  }

  dispatch(action: IActionType<any>): void {
    this.listeners.forEach((l) => {
      if (l.type === action.type) {
        l.cb(action);
      }
    });
  }
}

const EventEmitter = new Emitter();

export { EventEmitter };
