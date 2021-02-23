import { Vector } from 'components';
import { Warrior, Spearman, Worker } from 'actors';
import { MainBuilding } from 'buildings';
import { Actor } from 'instances';
import { Game } from 'core';
import { ISelected } from './Selector';
import { getEmptyCells, isPointInCells } from 'helpers';
import { getCellsRange } from 'helpers/actor';

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
  viewRange: Vector[] = [];
  event: IActorSelectedEvent | null = null;

  constructor(game: Game) {
    this.game = game;
  }

  init(): void {
    this.initInstances();
    this.updateViewRange();
  }

  updateViewRange(): void {
    const { actors } = this.game;
    this.viewRange = [];

    [...actors].forEach(instance => {
      const viewCells = getCellsRange(instance.viewRange, instance.pos);
      this.viewRange.push(...viewCells);
    })
  }

  initInstances(): void {
    const { actors, buildings } = this.game;

    actors.push(new Warrior(this.game, new Vector(0, 0), { owner: 'player' }));
    actors.push(new Warrior(this.game, new Vector(3, 3), { owner: 'player' }));
    actors.push(new Warrior(this.game, new Vector(1, 1), { owner: 'player' }));
    actors.push(new Warrior(this.game, new Vector(2, 3), { owner: 'player' }));

    actors.push(new Spearman(this.game, new Vector(2, 1), { owner: 'player' }));
    actors.push(new Spearman(this.game, new Vector(5, 2), { owner: 'player' }));
    actors.push(new Spearman(this.game, new Vector(6, 4), { owner: 'player' }));

    actors.push(new Worker(this.game, new Vector(5, 0), { owner: 'player' }));
    actors.push(new Worker(this.game, new Vector(6, 3), { owner: 'player' }));

    actors.push(new Spearman(this.game, new Vector(7, 7), { owner: 'enemy' }));

    buildings.push(new MainBuilding(new Vector(1, 3), { owner: 'player' }));
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
      const selectedInstance = selected.instance

      if (selectedInstance) {
        if (selectedInstance.owner === 'player' && selectedInstance.type === 'actor') {
          this.handleSelect(selected as ISelected<Actor>);
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

      const activeTurnCells = instance.validateCellsForMove(getEmptyCells(turnCells, collides));

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
        selectedInstance.setPosition(clickedCellPos);
        this.resetEvent();
        this.updateViewRange();
        // selectedInstance.endTurn();
      }
    }
  }
}
