import { Vector } from 'components';
import { SocketActions, SocketListeners } from './enums';

export interface ISocketAction<T = any> {
  type: SocketActions | SocketListeners;
  payload: T;
}

export interface IPlayerGameInfo {
  startPosition: Vector
}

// actions
export interface IProfileInfoEvent {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IAttackEvent {
  id: string;
  damage: number;
}

// responses
export interface IProfileInfoResponse {
  id: number;
  firstName: string;
  lastName: string;
  money: number;
}

export interface IAttackResponse {
  id: string;
  hp: number;
}

export type IStartGameResponse = {
  players: Record<string, IPlayerGameInfo>
}
