/**************************
 * interface Robot {
 *   move(): boolean;
 *   rotate(): void;
 *   cleanSpot(): void;
 * }
 **************************/

function cleanFloor(robot) {
  const controller = new RobotController(robot, 0, 0);
  const visited = new Set();
  robotDfs(robot, controller, visited, null);
}

const Directions = {
  north: 0,
  east: 1,
  south: 2,
  west: 3,
};
const numOfDirections = Object.keys(Directions).length;

class RobotController {
  rotation = Directions.north;
  get position() {
    return `x=${this.x},y=${this.y}`;
  }

  getPositionNorth() {
    return `x=${this.x},y=${this.y - 1}`;
  }
  getPositionEast() {
    return `x=${this.x + 1},y=${this.y}`;
  }
  getPositionSouth() {
    return `x=${this.x},y=${this.y + 1}`;
  }
  getPositionWest() {
    return `x=${this.x - 1},y=${this.y}`;
  }

  constructor(robot, initialX, initialY) {
    this.robot = robot;
    this.x = initialX;
    this.y = initialY;
  }
  move(direction) {
    if (direction == null || direction < 0 || direction >= numOfDirections) {
      throw "error: illegal direction";
    }
    while (this.rotation !== direction) {
      this.rotate();
    }
    let moveSucceeded = this.robot.move();
    if (!moveSucceeded) return false;
    switch (this.rotation) {
      case Directions.north:
        this.y--;
        break;
      case Directions.east:
        this.x++;
        break;
      case Directions.south:
        this.y++;
        break;
      case Directions.west:
        this.x--;
        break;
    }
    return true;
  }
  rotate() {
    this.rotation = (this.rotation + 1) % numOfDirections;
    return this.robot.rotate();
  }
  moveNorth() {
    return this.move(Directions.north);
  }
  moveEast() {
    return this.move(Directions.east);
  }
  moveSouth() {
    return this.move(Directions.south);
  }
  moveWest() {
    return this.move(Directions.west);
  }
}

function robotDfs(robot, controller, visited, goBackCallback) {
  robot.cleanSpot();
  visited.add(controller.position);

  if (!visited.has(controller.getPositionNorth())) {
    if (controller.moveNorth())
      robotDfs(robot, controller, visited, () => controller.moveSouth());
  }
  if (!visited.has(controller.getPositionEast())) {
    if (controller.moveEast())
      robotDfs(robot, controller, visited, () => controller.moveWest());
  }
  if (!visited.has(controller.getPositionSouth())) {
    if (controller.moveSouth())
      robotDfs(robot, controller, visited, () => controller.moveNorth());
  }
  if (!visited.has(controller.getPositionWest())) {
    if (controller.moveWest())
      robotDfs(robot, controller, visited, () => controller.moveEast());
  }
  goBackCallback?.();
}
