import { Vector } from 'components';
import { Warrior } from 'actors';
import { MainBuilding } from 'buildings';
import { Actor } from 'instances';
import { Game } from 'core';
import { ISelected } from './Selector';
import { getEmptyCells, isPointInCells } from 'helpers';

export interface IActorSelectedEventOptions {
  selected: ISelected<Actor>;
  activeTurnCells: Vector[];
}

type IActorSelectedEvent = {
  type: 'actorSelected',
  options: IActorSelectedEventOptions
}

export class Player {
  game: Game;
  event: IActorSelectedEvent | null = null;

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

  resetEvent(): void {
    this.event = null;
  }

  handleClick(mousePos: Vector): void {
    const { utils, selector } = this.game;

    const clickedCellPos = utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      selector.select(clickedCellPos);
      
      const selected = selector.selected;

      if (selected.instance) {
        if (selected.instance.type === 'actor') {
          this.handleSelect(selector.selected as ISelected<Actor>);
        }
      } else {
        this.handleMove(clickedCellPos);
      }
    }
  }

  handleSelect(selected: ISelected<Actor>): void {
    const selectedInstance = selected.instance;

    if (selectedInstance) {
      if (selectedInstance.type === 'actor') {
        this.selectActor(selected);
      }
    }
  }

  selectActor(selected: ISelected<Actor>): void {
    const { actors, buildings, utils } = this.game;
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

      this.event = {
        type: 'actorSelected',
        options: {
          selected,
          activeTurnCells,
        }
      }
    }
  }

  handleMove(clickedCellPos: Vector): void {
    const currentEvent = this.event;

    if (currentEvent && currentEvent.type === 'actorSelected') {
      const options = currentEvent.options as IActorSelectedEventOptions;

      if (isPointInCells(clickedCellPos, options.activeTurnCells)) {
        const selectedInstance = options.selected.instance;
        this.resetEvent();
        selectedInstance.setPosition(clickedCellPos);
        selectedInstance.endTurn();
      }
    }
  }
}
