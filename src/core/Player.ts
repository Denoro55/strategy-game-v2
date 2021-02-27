import { Vector } from 'components';
import { Warrior, Spearman, Worker } from 'actors';
import { MainBuilding } from 'buildings';
import { Actor, Building } from 'instances';
import { Game } from 'core';
import { ISelected } from './Selector';
import { getEmptyCells, isCellInCells, getCellsRange } from 'helpers';

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

    [...actors].forEach((instance) => {
      const viewCells = getCellsRange(instance.pos, instance.viewRange);
      this.viewRange.push(...viewCells);
    });
  }

  initInstances(): void {
    const { buildings, utils } = this.game;

    utils.instances.addActor(Warrior, new Vector(0, 0), { owner: 'player' });
    utils.instances.addActor(Warrior, new Vector(3, 3), { owner: 'player' });
    utils.instances.addActor(Warrior, new Vector(1, 1), { owner: 'player' });
    utils.instances.addActor(Warrior, new Vector(2, 3), { owner: 'player' });

    utils.instances.addActor(Spearman, new Vector(2, 1), { owner: 'player' });
    utils.instances.addActor(Spearman, new Vector(5, 2), { owner: 'player' });
    utils.instances.addActor(Spearman, new Vector(6, 4), { owner: 'player' });

    utils.instances.addActor(Worker, new Vector(5, 0), { owner: 'player' });
    utils.instances.addActor(Worker, new Vector(6, 3), { owner: 'player' });

    utils.instances.addActor(Spearman, new Vector(7, 8), { owner: 'enemy' });
    utils.instances.addActor(Spearman, new Vector(5, 9), { owner: 'enemy' });

    utils.instances.addActor(Spearman, new Vector(9, 11), { owner: 'enemy' });
    utils.instances.addActor(Spearman, new Vector(11, 11), { owner: 'enemy' });

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

    if (instance.canTurn) {
      const instances = [...actors, ...buildings];

      const turnCells = utils.getCellsOnlyOnStage(instance.getCellsForMove());
      const { emptyCells, colliders } = getEmptyCells(turnCells, instances);

      const availableCellsForMove = instance.validateCellsForMove(
        emptyCells,
        colliders
      );

      const { colliders: instancesForAttack } = getEmptyCells(
        instance.getCellsForAttack(),
        instances
      );

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
  }

  handleMove(clickedCellPos: Vector): void {
    const currentEvent = this.event;

    if (currentEvent && currentEvent.type === 'actorSelected') {
      const options = currentEvent.options as IActorSelectedEventOptions;

      if (isCellInCells(clickedCellPos, options.availableCellsForMove)) {
        const selectedInstance = options.selected.instance;
        this.moveActor(selectedInstance, clickedCellPos);
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
    // selectedInstance.endTurn();
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
    const { lan } = this.game;

    this.resetEvent();

    lan.attackActor({
      id: enemyInstance.options.id,
      damage: 10,
    });
  }
}
