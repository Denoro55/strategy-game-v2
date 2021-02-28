import { IActionType } from 'core/EventEmitter';
import { Game } from 'core';
import { EventType } from './enums';
import { IAttackEventResponse, IAttackEventOptions } from './types';

export class LanPlayerImitator {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  imitateResponse(
    event: IActionType<any>
  ): IActionType<any> {
    switch (event.type) {
      case EventType.attackActor: {
        return this.attackActor(event);
      }
      default: {
        throw new Error('no implemented method for imitatating response!');
      }
    }
  }

  attackActor(
    event: IActionType<IAttackEventOptions>
  ): IActionType<IAttackEventResponse> {
    const { utils } = this.game;
    const { id, damage } = event.payload;
    let nextHp = 0;

    const actor = utils.instances.getActorById(id);
    if (actor) {
      nextHp = actor.hp - damage;
    }

    return {
      type: event.type,
      payload: {
        id,
        hp: nextHp,
      },
    };
  }
}
