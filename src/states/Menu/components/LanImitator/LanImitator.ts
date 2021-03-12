import { App } from 'app';
import { LanCoreImitator } from 'core';
import { Vector } from 'components';
import { ISocketAction } from 'core/LanCore/types';
import { SocketActions, SocketListeners } from 'core/LanCore/enums';
import { IProfileInfoResponse, IStartGameResponse } from '../Lan/types';

export class LanImitator extends LanCoreImitator {
  constructor(app: App) {
    super(app);
  }

  imitateResponse(event: ISocketAction): ISocketAction {
    switch (event.type) {
      case SocketActions.getProfileInfo: {
        return this.profileGetInfo();
      }

      case SocketActions.startGame: {
        return this.startGame();
      }

      default: {
        throw new Error('no implemented method for imitatating response!');
      }
    }
  }

  profileGetInfo(): ISocketAction<IProfileInfoResponse> {
    return {
      type: SocketListeners.getProfileInfo,
      payload: {
        id: 1,
        firstName: 'Гость',
        lastName: 'Неизвестный',
        money: 100,
      },
    };
  }

  startGame(): ISocketAction<IStartGameResponse> {
    return {
      type: SocketListeners.startGame,
      payload: {
        players: {
          1: {
            startPosition: new Vector(3, 3),
          },
          2: {
            startPosition: new Vector(8, 6),
          },
          3: {
            startPosition: new Vector(3, 8),
          },
        },
      },
    };
  }
}
