import { uniqBy } from 'lodash';
import { Game } from 'core';
import { IStartGameResponse, IPlayerGameInfo } from 'core/Lan/types';
import { Vector } from 'components';
import { Actor, Building } from 'instances';
import { OwnerType } from 'instances/types';
import { getEmptyCells, isCellInCells, getCellsRange } from 'helpers';

import { ISelected } from './Selector';

export interface IActorSelectedEventOptions {
  selected: ISelected<Actor>;
  availableCellsForMove: Vector[];
  blockers: (Actor | Building)[];
  availableBlockersForAttack: (Actor | Building)[];
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
  otherPlayers: Record<string, IPlayerGameInfo> = {}

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
    })

    this.updateViewRange();
  }

  updateViewRange(): void {
    const { actors, buildings } = this.game;
    this.viewRange = [];

    [...actors, ...buildings].forEach((instance) => {
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
    const { actors } = this.game;

    this.event = null;

    actors.forEach((instance) => {
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

    const clickedCellPos = utils.getHoveredCell(mousePos);

    if (clickedCellPos) {
      selector.select(clickedCellPos);

      const selected = selector.selected;
      const selectedInstance = selected.instance;

      if (selectedInstance) {
        if (
          selectedInstance.owner === 'player' &&
          selectedInstance.type === 'actor'
        ) {
          this.handleSelect(selected as ISelected<Actor>);
        } else if (selectedInstance.owner === 'enemy') {
          this.handleAttack(clickedCellPos);
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
        this.handleSelectActor(selected);
      }
    }
  }

  handleSelectActor(selected: ISelected<Actor>): void {
    const { actors, buildings, utils } = this.game;
    const instance = selected.instance as Actor;

    const instances = [...actors, ...buildings];

    const turnCells = instance.canTurn ? utils.getCellsOnlyOnStage(instance.getCellsForMove()) : [];
    const { emptyCells, colliders } = getEmptyCells(turnCells, instances);

    const availableCellsForMove = instance.validateCellsForMove(
      emptyCells,
      colliders
    );

    const { colliders: instancesForAttack } = instance.canAttack ? getEmptyCells(
      instance.getCellsForAttack(),
      instances
    ) : { colliders: [] };

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

  handleMove(clickedCellPos: Vector): void {
    const currentEvent = this.event;

    if (currentEvent && currentEvent.type === 'actorSelected') {
      const options = currentEvent.options as IActorSelectedEventOptions;

      if (isCellInCells(clickedCellPos, options.availableCellsForMove)) {
        const selectedInstance = options.selected.instance;
        this.moveActor(selectedInstance, clickedCellPos);
      } else {
        this.event = null;
      }
    }
  }

  handleAttack(clickedCellPos: Vector): void {
    const { selector } = this.game;
    const currentEvent = this.event;

    if (currentEvent && currentEvent.type === 'actorSelected') {
      const options = currentEvent.options as IActorSelectedEventOptions;

      if (
        isCellInCells(clickedCellPos, options.availableBlockersCellsForAttack)
      ) {
        const selectedInstance = options.selected.instance;
        const enemyInstance = selector.selected.instance as Actor;
        this.attackActor(selectedInstance, enemyInstance);
      }
    }
  }

  moveActor(instance: Actor, pos: Vector): void {
    instance.setPosition(pos);
    this.resetEvent();
    this.updateViewRange();
    instance.update({
      canTurn: false,
    });
  }

  selectActor(
    selected: ISelected<Actor>,
    availableCellsForMove: Vector[],
    blockers: (Actor | Building)[],
    availableBlockersForAttack: (Actor | Building)[]
  ): void {
    this.event = {
      type: 'actorSelected',
      options: {
        selected,
        availableCellsForMove,
        availableBlockersForAttack,
        availableBlockersCellsForAttack: availableBlockersForAttack.map(
          (e) => e.pos
        ),
        blockers,
      },
    };
  }

  attackActor(selectedInstance: Actor, enemyInstance: Actor): void {
    const { lan } = this.game.app;

    this.resetEvent();

    selectedInstance.update({
      canAttack: false
    })

    lan.attackActor({
      id: enemyInstance.options.id,
      damage: selectedInstance.damage,
    });
  }
}
