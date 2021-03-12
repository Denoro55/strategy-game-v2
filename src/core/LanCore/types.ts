import { SocketActions, SocketListeners } from './enums';

export interface ISocketAction<T = any> {
  type: SocketActions | SocketListeners;
  payload: T;
}