export interface Enemy {
  x: number;
  y: number;
  health: number;
  angle: number;
  exploding: boolean;
  explosionFrame: number;
  shootCooldown: number;
}

export interface Projectile {
  x: number;
  y: number;
  angle: number;
  speed: number;
}

export interface ArmorPickup {
  x: number;
  y: number;
  active: boolean;
}

export interface GameState {
  playerX: number;
  playerY: number;
  playerAngle: number;
  playerHealth: number;
  playerArmor: number;
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  gunRecoil: number;
  muzzleFlash: number;
  screenFlash: number;
  armorDropped: boolean;
  armorDropTime: number;
  lastCollisionTime: number;
}
