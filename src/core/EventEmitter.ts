export interface IActionType {
  type: string;
  payload: any;
}

interface IListener {
  type: string;
  cb: (action: IActionType) => void;
}

export class Emitter {
  listeners: IListener[] = [];

  subscribe(type: string, listener: IListener['cb']): void {
    this.listeners.push({
      type,
      cb: listener,
    });
  }

  dispatch(action: IActionType): void {
    this.listeners.forEach((l) => {
      if (l.type === action.type) {
        l.cb(action);
      }
    });
  }
}

const EventEmitter = new Emitter();

export { EventEmitter };
