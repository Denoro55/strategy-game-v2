import { App } from 'core';
import { Vector } from 'components';

import { ISocketAction, IProfileInfoResponse, IAttackResponse, IStartGameResponse } from './types';
import { SocketActions, SocketListeners } from './enums';

export class LanImitator {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  imitateResponse(event: ISocketAction): ISocketAction {
    switch (event.type) {
      case SocketActions.getProfileInfo: {
        return this.profileGetInfo();
      }

      case SocketActions.attackActor: {
        return this.attackActor(event);
      }

      case SocketActions.startGame: {
        return this.startGame();
      }

      default: {
        throw new Error('no implemented method for imitatating response!');
      }
    }
  }

  startGame(): ISocketAction<IStartGameResponse> {
    return {
      type: SocketListeners.startGame,
      payload: {
        players: {
          1: {
            startPosition: new Vector(3, 3)
          },
          2: {
            startPosition: new Vector(8, 6)
          },
          3: {
            startPosition: new Vector(3, 8)
          }
        }
      },
    };
  }

  profileGetInfo(): ISocketAction<IProfileInfoResponse> {
    return {
      type: SocketListeners.getProfileInfo,
      payload: {
        id: 1,
        firstName: 'Denis',
        lastName: 'Chertenko',
        money: 100,
      },
    };
  }

  attackActor(event: ISocketAction): ISocketAction<IAttackResponse> {
    const { utils } = this.app.game;
    const { id, damage } = event.payload;
    let nextHp = 0;

    const actor = utils.instances.getActorById(id);
    if (actor) {
      nextHp = actor.hp - damage;
    }

    return {
      type: event.type,
      payload: {
        id: id,
        hp: nextHp,
      },
    };
  }
}
