import { Enemy, Projectile, ArmorPickup, GameState } from './types';
import { GAME_MAP, FOV } from './constants';
import { checkLineOfSight } from './utils';

export const renderRaycasting = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  playerX: number,
  playerY: number,
  playerAngle: number
) => {
  const numRays = width;

  for (let i = 0; i < numRays; i++) {
    const rayAngle = playerAngle - FOV / 2 + (FOV * i) / numRays;
    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);

    let distance = 0;
    let hit = false;

    while (!hit && distance < 20) {
      distance += 0.1;
      const testX = Math.floor(playerX + rayDirX * distance);
      const testY = Math.floor(playerY + rayDirY * distance);

      if (
        testX < 0 ||
        testX >= GAME_MAP[0].length ||
        testY < 0 ||
        testY >= GAME_MAP.length ||
        GAME_MAP[testY][testX] === 1
      ) {
        hit = true;
      }
    }

    distance *= Math.cos(rayAngle - playerAngle);
    const wallHeight = (height / distance) * 0.5;
    const wallTop = height / 2 - wallHeight / 2;
    const brightness = Math.max(0, 255 - distance * 30);
    
    ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.5}, ${brightness * 0.5})`;
    ctx.fillRect(i, wallTop, 1, wallHeight);
  }
};

export const renderMinimap = (
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  enemies: Enemy[],
  projectiles: Projectile[],
  armorPickup: ArmorPickup
) => {
  const miniSize = 150;
  const cellSize = miniSize / GAME_MAP.length;
  const offset = 15;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(offset, offset, miniSize, miniSize);

  // Draw walls
  ctx.fillStyle = '#fff';
  for (let y = 0; y < GAME_MAP.length; y++) {
    for (let x = 0; x < GAME_MAP[y].length; x++) {
      if (GAME_MAP[y][x] === 1) {
        ctx.fillRect(offset + x * cellSize, offset + y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw player
  ctx.fillStyle = '#0f0';
  ctx.fillRect(offset + playerX * cellSize - 3, offset + playerY * cellSize - 3, 6, 6);

  // Draw enemies
  ctx.fillStyle = '#f00';
  for (let i = 0; i < enemies.length; i++) {
    if (!enemies[i].exploding) {
      ctx.fillRect(offset + enemies[i].x * cellSize - 3, offset + enemies[i].y * cellSize - 3, 6, 6);
    }
  }

  // Draw projectiles
  ctx.fillStyle = '#ff0';
  for (let i = 0; i < projectiles.length; i++) {
    ctx.fillRect(offset + projectiles[i].x * cellSize - 1.5, offset + projectiles[i].y * cellSize - 1.5, 3, 3);
  }

  // Draw armor
  if (armorPickup.active) {
    ctx.fillStyle = '#0af';
    ctx.fillRect(offset + armorPickup.x * cellSize - 3, offset + armorPickup.y * cellSize - 3, 6, 6);
  }
};

export const renderEnemies = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  playerX: number,
  playerY: number,
  playerAngle: number,
  enemies: Enemy[]
) => {
  const halfFov = FOV / 2;
  
  for (let idx = 0; idx < enemies.length; idx++) {
    const enemy = enemies[idx];
    const dx = enemy.x - playerX;
    const dy = enemy.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Early exit for far enemies
    if (distance >= 10) continue;
    
    const angleToEnemy = Math.atan2(dy, dx);
    let angleDiff = angleToEnemy - playerAngle;
    
    // Inline normalize for performance
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    // Early exit for enemies outside FOV
    if (Math.abs(angleDiff) >= halfFov) continue;
    
    const hasLineOfSight = checkLineOfSight(playerX, playerY, enemy.x, enemy.y, GAME_MAP);

    if (hasLineOfSight) {
      const enemySize = (height / distance) * 0.3;
      const enemyX = width / 2 + (angleDiff / (FOV / 2)) * (width / 2) - enemySize / 2;
      const enemyY = height / 2 - enemySize / 2;

      if (enemy.exploding) {
        const frame = enemy.explosionFrame;
        const explosionSize = enemySize * (1 + frame / 10);
        const explosionX = enemyX - (explosionSize - enemySize) / 2;
        const explosionY = enemyY - (explosionSize - enemySize) / 2;

        ctx.fillStyle = frame < 5 ? '#fff' : frame < 10 ? '#ff0' : '#f80';
        ctx.beginPath();
        ctx.arc(explosionX + explosionSize / 2, explosionY + explosionSize / 2, explosionSize / 2, 0, Math.PI * 2);
        ctx.fill();

        for (let p = 0; p < 8; p++) {
          const angle = (Math.PI * 2 * p) / 8;
          const dist = frame * 3;
          ctx.fillStyle = '#f00';
          ctx.fillRect(
            explosionX + explosionSize / 2 + Math.cos(angle) * dist,
            explosionY + explosionSize / 2 + Math.sin(angle) * dist,
            4,
            4
          );
        }
      } else {
        ctx.fillStyle = '#f00';
        ctx.fillRect(enemyX, enemyY, enemySize, enemySize);
        ctx.fillStyle = '#ff0';
        ctx.fillRect(enemyX + enemySize * 0.2, enemyY + enemySize * 0.2, enemySize * 0.2, enemySize * 0.2);
        ctx.fillRect(enemyX + enemySize * 0.6, enemyY + enemySize * 0.2, enemySize * 0.2, enemySize * 0.2);
      }
    }
  }
};

export const renderProjectiles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  playerX: number,
  playerY: number,
  playerAngle: number,
  projectiles: Projectile[]
) => {
  const halfFov = FOV / 2;
  
  for (let idx = 0; idx < projectiles.length; idx++) {
    const proj = projectiles[idx];
    const dx = proj.x - playerX;
    const dy = proj.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance >= 10) continue;
    
    const angleToProj = Math.atan2(dy, dx);
    let angleDiff = angleToProj - playerAngle;
    
    // Inline normalize
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    if (Math.abs(angleDiff) < halfFov) {
      const projSize = (height / distance) * 0.1;
      const projX = width / 2 + (angleDiff / (FOV / 2)) * (width / 2) - projSize / 2;
      const projY = height / 2 - projSize / 2;

      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      ctx.arc(projX + projSize / 2, projY + projSize / 2, projSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(projX + projSize / 2, projY + projSize / 2, projSize / 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const renderArmorPickup = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  playerX: number,
  playerY: number,
  playerAngle: number,
  armorPickup: ArmorPickup
) => {
  if (!armorPickup.active) return;

  const dx = armorPickup.x - playerX;
  const dy = armorPickup.y - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance >= 10) return;
  
  const angleToArmor = Math.atan2(dy, dx);
  let angleDiff = angleToArmor - playerAngle;
  
  // Inline normalize
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  
  if (Math.abs(angleDiff) >= FOV / 2) return;
  
  const hasLineOfSight = checkLineOfSight(playerX, playerY, armorPickup.x, armorPickup.y, GAME_MAP);

  if (hasLineOfSight) {
    const armorSize = (height / distance) * 0.3;
    const armorX = width / 2 + (angleDiff / (FOV / 2)) * (width / 2) - armorSize / 2;
    const armorY = height / 2 - armorSize / 2;

    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 0.2 + 0.8;

    ctx.fillStyle = `rgba(0, 170, 255, ${pulse})`;
    ctx.fillRect(armorX, armorY, armorSize, armorSize);

    ctx.fillStyle = '#0af';
    ctx.fillRect(armorX + armorSize * 0.2, armorY + armorSize * 0.2, armorSize * 0.6, armorSize * 0.6);

    ctx.fillStyle = '#fff';
    ctx.font = `${armorSize * 0.4}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('A', armorX + armorSize / 2, armorY + armorSize * 0.65);
    ctx.textAlign = 'left';
  }
};

export const renderGun = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gunRecoil: number,
  muzzleFlash: number
) => {
  const gunWidth = 180;
  const gunHeight = 225;
  const gunX = width / 2 - gunWidth / 2;
  const gunY = height - gunHeight + gunRecoil;

  ctx.fillStyle = '#444';
  ctx.fillRect(gunX + 60, gunY + 75, 60, 150);

  ctx.fillStyle = '#222';
  ctx.fillRect(gunX + 75, gunY, 30, 90);

  if (muzzleFlash > 0) {
    ctx.fillStyle = '#ff0';
    ctx.fillRect(gunX + 67.5, gunY - 30, 45, 30);
    ctx.fillStyle = '#f80';
    ctx.fillRect(gunX + 75, gunY - 22.5, 30, 22.5);
  }
};

export const renderCrosshair = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 15, height / 2);
  ctx.lineTo(width / 2 + 15, height / 2);
  ctx.moveTo(width / 2, height / 2 - 15);
  ctx.lineTo(width / 2, height / 2 + 15);
  ctx.stroke();
};

export const renderHUD = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GameState,
  enemyCount: number
) => {
  ctx.fillStyle = '#0f0';
  ctx.font = '24px monospace';
  ctx.fillText(`Score: ${state.score}`, 15, height - 105);
  ctx.fillText(`Enemies: ${enemyCount}`, width - 180, height - 105);

  const healthBarWidth = 300;
  const healthBarHeight = 30;
  const healthBarX = 15;
  const healthBarY = height - 70;

  ctx.fillStyle = '#000';
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
  ctx.strokeStyle = '#0f0';
  ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

  const healthColor = state.playerHealth > 50 ? '#0f0' : state.playerHealth > 25 ? '#ff0' : '#f00';
  ctx.fillStyle = healthColor;
  ctx.fillRect(healthBarX + 2, healthBarY + 2, (healthBarWidth - 4) * (state.playerHealth / 100), healthBarHeight - 4);

  ctx.fillStyle = '#fff';
  ctx.font = '18px monospace';
  ctx.fillText(`HP: ${state.playerHealth}`, healthBarX + 8, healthBarY + 21);

  if (state.playerArmor > 0) {
    const armorBarWidth = 300;
    const armorBarHeight = 30;
    const armorBarX = 15;
    const armorBarY = height - 35;

    ctx.fillStyle = '#000';
    ctx.fillRect(armorBarX, armorBarY, armorBarWidth, armorBarHeight);
    ctx.strokeStyle = '#0af';
    ctx.strokeRect(armorBarX, armorBarY, armorBarWidth, armorBarHeight);

    ctx.fillStyle = '#0af';
    ctx.fillRect(armorBarX + 2, armorBarY + 2, (armorBarWidth - 4) * (state.playerArmor / 100), armorBarHeight - 4);

    ctx.fillStyle = '#fff';
    ctx.font = '18px monospace';
    ctx.fillText(`ARMOR: ${state.playerArmor}`, armorBarX + 8, armorBarY + 21);
  }
};

export const renderStartScreen = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = 'bold 96px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f00';
  ctx.fillText('GLOOM', width / 2, height / 2 - 180);

  ctx.font = '30px monospace';
  ctx.fillStyle = '#0f0';
  ctx.fillText('MISSION:', width / 2, height / 2 - 60);
  ctx.font = '24px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('Eliminate all demons before they kill you!', width / 2, height / 2 - 15);

  ctx.font = '27px monospace';
  ctx.fillStyle = '#0f0';
  ctx.fillText('CONTROLS:', width / 2, height / 2 + 45);
  ctx.font = '21px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('W/↑ - Move Forward', width / 2, height / 2 + 83);
  ctx.fillText('S/↓ - Move Backward', width / 2, height / 2 + 113);
  ctx.fillText('A/← - Turn Left', width / 2, height / 2 + 143);
  ctx.fillText('D/→ - Turn Right', width / 2, height / 2 + 173);
  ctx.fillText('SPACE - Shoot', width / 2, height / 2 + 203);

  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = '#ff0';
  ctx.fillText('Press ENTER to Start', width / 2, height / 2 + 270);
  ctx.textAlign = 'left';
};

export const renderGameOverScreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  playerHealth: number,
  score: number
) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, width, height);
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';

  if (playerHealth <= 0) {
    ctx.fillStyle = '#f00';
    ctx.fillText('YOU DIED', width / 2, height / 2 - 40);
    ctx.font = '24px monospace';
    ctx.fillText(`Final Score: ${score}`, width / 2, height / 2 + 20);
    ctx.fillText('The demons have won...', width / 2, height / 2 + 60);
  } else {
    ctx.fillStyle = '#0f0';
    ctx.fillText('VICTORY!', width / 2, height / 2 - 40);
    ctx.font = '24px monospace';
    ctx.fillText(`Final Score: ${score}`, width / 2, height / 2 + 20);
    ctx.fillText('All demons eliminated!', width / 2, height / 2 + 60);
  }

  ctx.font = '20px monospace';
  ctx.fillStyle = '#ff0';
  ctx.fillText('Press ENTER to Restart', width / 2, height / 2 + 110);
  ctx.textAlign = 'left';
};
