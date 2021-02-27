import { IActionType } from 'core/EventEmitter';
import { EventEmitter } from 'core';
import { Game, LanPlayerImitator } from 'core';
import { EventType } from './enums';
import { IAttackEventOptions, IAttackEventResponse } from './types';

export class Lan {
  game: Game;
  lanPlayerImitator: LanPlayerImitator;

  constructor(game: Game) {
    this.game = game;

    this.lanPlayerImitator = new LanPlayerImitator(game);

    this.initListeners();
  }

  initListeners(): void {
    const { utils } = this.game;

    EventEmitter.subscribe(EventType.attackActor, (action: IActionType<IAttackEventResponse>) => {
      const { hp, id } = action.payload;

      const actor = utils.instances.getActorById(id);
      if (actor) {
        actor.update({
          hp
        })
      }
    });
  }

  attackActor(options: IAttackEventOptions): void {
    this.emit(EventType.attackActor, options);
  }

  emit(type: EventType, options: any): void {
    EventEmitter.dispatch(
      this.lanPlayerImitator.imitateResponse({
        type,
        payload: options,
      })
    );
  }
}
