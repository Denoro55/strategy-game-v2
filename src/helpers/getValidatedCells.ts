import { Vector } from 'components';

export interface IValidator {
  blocker: Vector;
  deps: Vector[];
}

export const getValidatedCells = (
  validators: IValidator[],
  cells: Vector[]
): Vector[] => {
  let filteredCells = [...cells];

  validators.forEach((validator) => {
    const isCellBlocked = !cells.find(
      (cell) => cell.x === validator.blocker.x && cell.y === validator.blocker.y
    );
    if (isCellBlocked) {
      validator.deps.forEach((dep) => {
        filteredCells = filteredCells.filter(
          (cl) => !(cl.x === dep.x && cl.y === dep.y)
        );
      });
    }
  });

  return filteredCells;
};
