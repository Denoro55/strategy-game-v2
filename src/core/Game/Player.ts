import uniqBy from 'lodash.uniqby';
import { Game } from 'core';
import { IStartGameResponse, IPlayerGameInfo } from 'core/App/Lan/types';
import { Vector } from 'components';
import { Instance, Actor } from 'instances';
import { OwnerType } from 'instances/types';
import { getEmptyCells, isCellInCells, getCellsRange } from 'helpers';

import { ISelected } from './Selector';

export interface IActorSelectedEventOptions {
  selected: ISelected<Instance>;
  availableCellsForMove: Vector[];
  blockers: Instance[];
  availableBlockersForAttack: Instance[];
  availableBlockersCellsForAttack: Vector[];
}

type IActorSelectedEvent = {
  type: 'actorSelected';
  options: IActorSelectedEventOptions;
};

export class Player {
  game: Game;
  viewRange: Vector[] = [];
  event: IActorSelectedEvent | null = null;
  otherPlayers: Record<string, IPlayerGameInfo> = {};

  constructor(game: Game) {
    this.game = game;
  }

  init(options: IStartGameResponse): void {
    const players = options.players;

    Object.entries(players).forEach(([id, playerOptions]) => {
      if (+id === this.game.app.client.id) {
        this.spawnBase(playerOptions.startPosition, 'player');
      } else {
        this.spawnBase(playerOptions.startPosition, 'enemy');
        this.otherPlayers[id] = playerOptions;
      }
    });

    this.updateViewRange();
  }

  updateViewRange(): void {
    const { instances } = this.game;
    this.viewRange = [];

    instances.forEach((instance) => {
      if (instance.owner === 'enemy') return;

      const positions = instance.getPositions();
      positions.forEach((pos) => {
        const viewCells = getCellsRange(pos, instance.viewRange);
        this.viewRange.push(...viewCells);
      });
    });

    this.viewRange = uniqBy(this.viewRange, (v) => [v.x, v.y].join());
  }

  refreshTurn(): void {
    const { instances } = this.game;

    this.event = null;

    instances.forEach((instance) => {
      // TODO (d.chertenko) new turn для зданий ?
      instance.newTurn();
    });
  }

  spawnBase(basePos: Vector, owner: OwnerType): void {
    const { utils } = this.game;

    utils.instances.spawnBase(basePos, owner);
  }

  resetEvent(): void {
    this.event = null;
  }

  handleClick(mousePos: Vector): void {
    const { utils, selector } = this.game;
    const { event } = this;

    const clickedCellPos = utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      selector.select(clickedCellPos);

      const selected = selector.selected;
      const selectedInstance = selected.instance;

      if (selectedInstance) {
         // выбрана сущность игрока
        if (selectedInstance.owner === 'player') {
          if (selectedInstance.type === 'actor') {
            this.handleSelectActor(selected as ISelected<Actor>);
          }
        } else {
          // выбрана вражеская сущность
          if (event && event.type === 'actorSelected') {
            const selectedActor = event.options.selected.instance as Actor;
            const cellsForAttack = event.options.availableBlockersCellsForAttack;
            if (isCellInCells(clickedCellPos, cellsForAttack)) {
              this.attackInstance(selectedActor, selectedInstance);
            }
          }
        }
      } else {
        // выбрана пустая ячейка
        if (event && event.type === 'actorSelected') {
          const options = event.options;
          const selectedActor = options.selected.instance as Actor;

          if (isCellInCells(clickedCellPos, options.availableCellsForMove)) {
            this.moveActor(selectedActor, clickedCellPos);
          } else {
            this.event = null;
          }
        }
      }
    }
  }

  handleSelectActor(selected: ISelected<Actor>): void {
    const { instances, utils } = this.game;
    const instance = selected.instance;

    const turnCells = instance.canTurn
      ? utils.getCellsOnlyOnStage(instance.getCellsForMove())
      : [];
    const { emptyCells, colliders } = getEmptyCells(turnCells, instances);

    const availableCellsForMove = instance.validateCellsForMove(
      emptyCells,
      colliders
    );

    const { colliders: instancesForAttack } = instance.canAttack
      ? getEmptyCells(instance.getCellsForAttack(), instances)
      : { colliders: [] };

    const availableBlockersForAttack = instance.getAvailableCellsForAttack(
      instancesForAttack
    );

    this.selectActor(
      selected,
      availableCellsForMove,
      colliders,
      availableBlockersForAttack
    );
  }

  moveActor(instance: Instance, pos: Vector): void {
    instance.setPosition(pos);
    this.resetEvent();
    this.updateViewRange();
    instance.update({
      canTurn: false,
    });
  }

  selectActor(
    selected: ISelected<Instance>,
    availableCellsForMove: Vector[],
    blockers: Instance[],
    availableBlockersForAttack: Instance[]
  ): void {
    const availableBlockersCellsForAttack: Vector[] = availableBlockersForAttack.reduce(
      (acc: Vector[], instance) => {
        const positions = instance.getPositions();
        return [...acc, ...positions];
      },
      []
    );

    this.event = {
      type: 'actorSelected',
      options: {
        selected,
        availableCellsForMove,
        availableBlockersForAttack,
        availableBlockersCellsForAttack,
        blockers,
      },
    };
  }

  attackInstance(selectedInstance: Actor, enemyInstance: Instance): void {
    const { lan } = this.game.app;

    this.resetEvent();

    selectedInstance.update({
      canAttack: false,
    });

    lan.attackInstance({
      id: enemyInstance.options.id,
      damage: selectedInstance.damage,
    });
  }
}
