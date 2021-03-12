import { Vector } from 'components';

export interface IClient {
  authKey: string;
  id: number;
  firstName: string;
  lastName: string;
}

export interface IPlayerGameInfo {
  startPosition: Vector;
}
