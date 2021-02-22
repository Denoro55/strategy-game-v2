import { Vector } from 'components';
import { Warrior } from 'actors';
import { MainBuilding } from 'buildings';
import { Actor } from 'instances';
import { Game } from 'core';
import { ISelected } from './Selector';
import { getEmptyCells } from 'helpers';

type EventType = 'actorSelected' | null;

export interface IActorSelectedEventOptions {
  selected: ISelected;
  activeTurnCells: Vector[];
}

export class Player {
  game: Game;
  eventType: EventType = null;
  eventOptions: IActorSelectedEventOptions | null = null;

  constructor(game: Game) {
    this.game = game;
  }

  init(): void {
    const { actors, buildings } = this.game;

    actors.push(new Warrior(this.game, new Vector(0, 0)));
    actors.push(new Warrior(this.game, new Vector(3, 3)));
    actors.push(new Warrior(this.game, new Vector(2, 1)));
    actors.push(new Warrior(this.game, new Vector(1, 1)));
    actors.push(new Warrior(this.game, new Vector(2, 3)));
    buildings.push(new MainBuilding(new Vector(1, 3)));
  }

  handleClick(mousePos: Vector): void {
    const { utils, selector } = this.game;

    const clickedCellPos = utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      selector.select(clickedCellPos);

      if (selector.selected.instance) {
        this.handleSelect(selector.selected);
      }
    }
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
      const collides = [...actors, ...buildings].reduce(
        (acc: Vector[], instance) => {
          return [...acc, ...instance.getPositions()];
        },
        []
      );
      const activeTurnCells = getEmptyCells(turnCells, collides);

      this.eventOptions = {
        selected,
        activeTurnCells,
      };
    }
  }
}
