export const GAME_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

export const INITIAL_ENEMIES = [
  { x: 1.5, y: 1.5, health: 3, angle: 0, exploding: false, explosionFrame: 0, shootCooldown: 0 },
  { x: 6.5, y: 1.5, health: 3, angle: Math.PI, exploding: false, explosionFrame: 0, shootCooldown: 0 },
  { x: 1.5, y: 6.5, health: 3, angle: Math.PI / 2, exploding: false, explosionFrame: 0, shootCooldown: 0 },
];

export const MOVE_SPEED = 0.05;
export const ROT_SPEED = 0.05;
export const FOV = Math.PI / 3;
export const ARMOR_DROP_DELAY = 15000; // 15 seconds
