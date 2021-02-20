class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  diff(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }

  spread(): [x: number, y: number] {
    return [this.x, this.y];
  }
}

export default Vector;