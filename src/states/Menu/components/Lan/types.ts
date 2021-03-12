import { IPlayerGameInfo } from 'types';

// actions
export interface IProfileInfoEvent {
  id: number;
  firstName: string;
  lastName: string;
}

// responses
export interface IProfileInfoResponse {
  id: number;
  firstName: string;
  lastName: string;
  money: number;
}

export type IStartGameResponse = {
  players: Record<string, IPlayerGameInfo>;
};
