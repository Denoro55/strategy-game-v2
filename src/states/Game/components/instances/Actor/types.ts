export interface IActorImages {
  player: string;
  enemy: string;
}

export interface IActorUpdateOptions {
  hp?: number;
  canAttack?: boolean;
  canTurn?: boolean;
}