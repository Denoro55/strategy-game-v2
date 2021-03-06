import { App } from 'app';
import { LanCoreImitator } from 'core';
import { Game } from 'states';
import { Actor, Building } from 'states/Game/components/instances';
import { ISocketAction } from 'core/LanCore/types';
import { SocketActions } from 'core/LanCore/enums';
import { IAttackResponse } from '../Lan/types';

export class LanImitator extends LanCoreImitator {
  game: Game;

  constructor(app: App, game: Game) {
    super(app);
    this.game = game;
  }

  imitateResponse(event: ISocketAction): ISocketAction {
    switch (event.type) {
      case SocketActions.attackInstance: {
        return this.attackInstance(event);
      }

      default: {
        throw new Error('no implemented method for imitatating response!');
      }
    }
  }

  attackInstance(event: ISocketAction): ISocketAction<IAttackResponse> {
    const { utils } = this.game;
    const { id, damage } = event.payload;
    // TODO (d.chertenko): подумать, что можно сделать вместо 0
    let nextHp = 0;

    const instance = utils.instances.getInstanceById(id);

    if (instance && (instance instanceof Actor || instance instanceof Building)) {
      nextHp = instance.hp - damage;
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
