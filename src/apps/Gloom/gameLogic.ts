import { Enemy, Projectile, GameState } from './types';
import { GAME_MAP, INITIAL_ENEMIES } from './constants';
import { checkLineOfSight } from './utils';

export const shoot = (
  playerX: number,
  playerY: number,
  playerAngle: number,
  enemies: Enemy[]
): { score: number } => {
  let scoreGained = 0;

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (enemy.exploding) continue;

    const dx = enemy.x - playerX;
    const dy = enemy.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Early exit for far enemies
    if (distance >= 8) continue;
    
    const angleToEnemy = Math.atan2(dy, dx);
    let angleDiff = angleToEnemy - playerAngle;
    
    // Inline normalize
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    if (Math.abs(angleDiff) < 0.15) {
      enemy.health--;
      if (enemy.health <= 0) {
        enemy.exploding = true;
        enemy.explosionFrame = 0;
        scoreGained += 100;
      }
    }
  }

  return { score: scoreGained };
};

export const updateEnemies = (
  enemies: Enemy[],
  projectiles: Projectile[],
  playerX: number,
  playerY: number
) => {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    if (enemy.exploding) {
      enemy.explosionFrame++;
      if (enemy.explosionFrame > 20) {
        enemies.splice(i, 1);
      }
      continue;
    }

    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
    const angleToPlayer = Math.atan2(dy, dx);

    if (enemy.shootCooldown > 0) {
      enemy.shootCooldown--;
    }

    const hasLineOfSight = checkLineOfSight(enemy.x, enemy.y, playerX, playerY, GAME_MAP);

    if (distanceToPlayer < 6 && hasLineOfSight && enemy.shootCooldown === 0 && Math.random() < 0.03) {
      const inaccuracy = (Math.random() - 0.5) * 0.4;
      projectiles.push({
        x: enemy.x,
        y: enemy.y,
        angle: angleToPlayer + inaccuracy,
        speed: 0.04,
      });
      enemy.shootCooldown = 300;
    }

    if (Math.random() < 0.02) {
      enemy.angle += (Math.random() - 0.5) * 1.0;
    }

    const moveSpeed = 0.02;
    const newX = enemy.x + Math.cos(enemy.angle) * moveSpeed;
    const newY = enemy.y + Math.sin(enemy.angle) * moveSpeed;

    if (
      newX > 0 &&
      newX < GAME_MAP[0].length &&
      newY > 0 &&
      newY < GAME_MAP.length &&
      GAME_MAP[Math.floor(newY)][Math.floor(newX)] === 0
    ) {
      enemy.x = newX;
      enemy.y = newY;
    } else {
      enemy.angle += Math.PI / 2 + (Math.random() - 0.5);
    }
  }
};

export const updateProjectiles = (
  projectiles: Projectile[],
  playerX: number,
  playerY: number,
  state: GameState
): { damaged: boolean; gameOver: boolean } => {
  let damaged = false;
  let gameOver = false;

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];

    proj.x += Math.cos(proj.angle) * proj.speed;
    proj.y += Math.sin(proj.angle) * proj.speed;

    if (
      proj.x < 0 ||
      proj.x >= GAME_MAP[0].length ||
      proj.y < 0 ||
      proj.y >= GAME_MAP.length ||
      GAME_MAP[Math.floor(proj.y)][Math.floor(proj.x)] === 1
    ) {
      projectiles.splice(i, 1);
      continue;
    }

    const dx = proj.x - playerX;
    const dy = proj.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.3) {
      let damage = 10;

      if (state.playerArmor > 0) {
        const absorbed = Math.min(state.playerArmor, damage);
        state.playerArmor -= absorbed;
        damage -= absorbed;
      }

      state.playerHealth -= damage;
      damaged = true;
      projectiles.splice(i, 1);

      if (state.playerHealth <= 0) {
        state.playerHealth = 0;
        gameOver = true;
      }
    }
  }

  return { damaged, gameOver };
};

export const checkEnemyCollision = (
  enemies: Enemy[],
  playerX: number,
  playerY: number,
  state: GameState,
  lastCollisionTime: number
): { newPlayerX: number; newPlayerY: number; damaged: boolean; gameOver: boolean; newCollisionTime: number } => {
  const currentTime = Date.now();
  let damaged = false;
  let gameOver = false;
  let newPlayerX = playerX;
  let newPlayerY = playerY;
  let newCollisionTime = lastCollisionTime;

  enemies.forEach((enemy) => {
    if (enemy.exploding) return;

    const dx = enemy.x - playerX;
    const dy = enemy.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.4 && currentTime - lastCollisionTime > 1000) {
      let damage = 10;

      if (state.playerArmor > 0) {
        const absorbed = Math.min(state.playerArmor, damage);
        state.playerArmor -= absorbed;
        damage -= absorbed;
      }

      state.playerHealth -= damage;
      damaged = true;
      newCollisionTime = currentTime;

      const pushAngle = Math.atan2(-dy, -dx);
      const testX = playerX + Math.cos(pushAngle) * 0.3;
      const testY = playerY + Math.sin(pushAngle) * 0.3;

      if (
        testX > 0 &&
        testX < GAME_MAP[0].length &&
        testY > 0 &&
        testY < GAME_MAP.length &&
        GAME_MAP[Math.floor(testY)][Math.floor(testX)] === 0
      ) {
        newPlayerX = testX;
        newPlayerY = testY;
      }

      if (state.playerHealth <= 0) {
        state.playerHealth = 0;
        gameOver = true;
      }
    }
  });

  return { newPlayerX, newPlayerY, damaged, gameOver, newCollisionTime };
};

export const resetGame = (): {
  enemies: Enemy[];
  projectiles: Projectile[];
  state: Partial<GameState>;
} => {
  return {
    enemies: INITIAL_ENEMIES.map((e) => ({ ...e })),
    projectiles: [],
    state: {
      playerX: 3.5,
      playerY: 3.5,
      playerAngle: 0,
      playerHealth: 100,
      playerArmor: 0,
      score: 0,
      gameOver: false,
      screenFlash: 0,
      gunRecoil: 0,
      muzzleFlash: 0,
      lastCollisionTime: 0,
      armorDropped: false,
      armorDropTime: Date.now(),
    },
  };
};
