import { Vector } from 'components';
import { Actor } from 'instances';
import { Game } from 'core';
import { ISelected } from './Selector';
import { getEmptyCells } from 'helpers';

type EventType = 'actorSelected' | null;

export interface IActorSelectedEventOptions {
  selected: ISelected,
  activeTurnCells: Vector[]
}

class Player {
  game: Game;
  eventType: EventType = null
  eventOptions: IActorSelectedEventOptions | null = null

  constructor(game: Game) {
    this.game = game;
  }

  handleSelect(selected: ISelected): void {
    const selectedInstance = selected.instance;

    if (selectedInstance) {
      if (selectedInstance.type === 'actor') {
        this.selectActor(selected);
      }
    }
  }

  selectActor(selected: ISelected): void {
    const { actors, buildings, utils } = this.game;
    this.eventType = 'actorSelected';

    const instance = selected.instance as Actor;

    if (instance.canTurn) {
      const turnCells = utils.getCellsOnlyOnStage(instance.getCellsForMove());
      const collides = [...actors, ...buildings].reduce((acc: Vector[], instance) => {
        return [...acc, ...instance.getPositions()]
      }, [])
      const activeTurnCells = getEmptyCells(turnCells, collides);

      this.eventOptions = {
        selected,
        activeTurnCells
      }
    }
  }
}

export default Player