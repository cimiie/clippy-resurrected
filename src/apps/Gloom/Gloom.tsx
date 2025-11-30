'use client';

import { useEffect, useRef, useState } from 'react';
import { Enemy, Projectile, ArmorPickup, GameState } from './types';
import { GAME_MAP, INITIAL_ENEMIES, MOVE_SPEED, ROT_SPEED, ARMOR_DROP_DELAY } from './constants';
import { shoot, updateEnemies, updateProjectiles, checkEnemyCollision, resetGame } from './gameLogic';
import {
  renderRaycasting,
  renderMinimap,
  renderEnemies,
  renderProjectiles,
  renderArmorPickup,
  renderGun,
  renderCrosshair,
  renderHUD,
  renderStartScreen,
  renderGameOverScreen,
} from './rendering';

interface GloomAppProps {
  onClose: () => void;
}

export default function GloomApp({ onClose: _onClose }: GloomAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    const state: GameState = {
      playerX: 3.5,
      playerY: 3.5,
      playerAngle: 0,
      playerHealth: 100,
      playerArmor: 0,
      score: 0,
      gameOver: false,
      gameStarted: false,
      gunRecoil: 0,
      muzzleFlash: 0,
      screenFlash: 0,
      armorDropped: false,
      armorDropTime: 0,
      lastCollisionTime: 0,
    };

    const enemies: Enemy[] = INITIAL_ENEMIES.map((e) => ({ ...e }));
    const projectiles: Projectile[] = [];
    const armorPickup: ArmorPickup = { x: 4, y: 4, active: false };
    const keys: { [key: string]: boolean } = {};
    let spacePressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys[key] = true;

      if ((key === ' ' || key === 'space') && !spacePressed) {
        spacePressed = true;
        e.preventDefault();

        if (state.gameStarted && !state.gameOver) {
          const result = shoot(state.playerX, state.playerY, state.playerAngle, enemies);
          state.score += result.score;
          state.gunRecoil = 10;
          state.muzzleFlash = 5;
        }
      }

      if (key === 'enter') {
        e.preventDefault();
        if (!state.gameStarted) {
          state.gameStarted = true;
          state.armorDropTime = Date.now();
        } else if (state.gameOver) {
          const reset = resetGame();
          enemies.length = 0;
          enemies.push(...reset.enemies);
          projectiles.length = 0;
          Object.assign(state, reset.state);
          state.gameStarted = true;
          armorPickup.active = false;
          spacePressed = false;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys[key] = false;
      if (key === ' ' || key === 'space') {
        spacePressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, width, height / 2);
      ctx.fillStyle = '#555';
      ctx.fillRect(0, height / 2, width, height / 2);

      renderRaycasting(ctx, width, height, state.playerX, state.playerY, state.playerAngle);
      renderMinimap(ctx, state.playerX, state.playerY, enemies, projectiles, armorPickup);
      renderEnemies(ctx, width, height, state.playerX, state.playerY, state.playerAngle, enemies);
      renderProjectiles(ctx, width, height, state.playerX, state.playerY, state.playerAngle, projectiles);
      renderArmorPickup(ctx, width, height, state.playerX, state.playerY, state.playerAngle, armorPickup);
      renderGun(ctx, width, height, state.gunRecoil, state.muzzleFlash);
      renderCrosshair(ctx, width, height);
      renderHUD(ctx, width, height, state, enemies.length);

      if (state.screenFlash > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, ${state.screenFlash / 30})`;
        ctx.fillRect(0, 0, width, height);
        state.screenFlash--;
      }

      if (state.gunRecoil > 0) state.gunRecoil -= 1;
      if (state.muzzleFlash > 0) state.muzzleFlash -= 1;

      if (!state.gameStarted) {
        renderStartScreen(ctx, width, height);
      }

      if (state.gameOver) {
        renderGameOverScreen(ctx, width, height, state.playerHealth, state.score);
      }
    };

    let lastFrameTime = performance.now();
    const targetFPS = 60;
    const frameDelay = 1000 / targetFPS;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Skip frame if not enough time has passed (cap at 60fps)
      if (deltaTime < frameDelay) {
        requestAnimationFrame(gameLoop);
        return;
      }
      
      lastFrameTime = currentTime - (deltaTime % frameDelay);

      if (state.gameStarted && !state.gameOver) {
        if (!state.armorDropped && Date.now() - state.armorDropTime > ARMOR_DROP_DELAY) {
          armorPickup.active = true;
          state.armorDropped = true;
        }

        if (armorPickup.active) {
          const dx = armorPickup.x - state.playerX;
          const dy = armorPickup.y - state.playerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            state.playerArmor = Math.min(100, state.playerArmor + 50);
            armorPickup.active = false;
          }
        }

        if (keys['w'] || keys['arrowup']) {
          const newX = state.playerX + Math.cos(state.playerAngle) * MOVE_SPEED;
          const newY = state.playerY + Math.sin(state.playerAngle) * MOVE_SPEED;
          if (GAME_MAP[Math.floor(newY)][Math.floor(newX)] === 0) {
            state.playerX = newX;
            state.playerY = newY;
          }
        }
        if (keys['s'] || keys['arrowdown']) {
          const newX = state.playerX - Math.cos(state.playerAngle) * MOVE_SPEED;
          const newY = state.playerY - Math.sin(state.playerAngle) * MOVE_SPEED;
          if (GAME_MAP[Math.floor(newY)][Math.floor(newX)] === 0) {
            state.playerX = newX;
            state.playerY = newY;
          }
        }
        if (keys['a'] || keys['arrowleft']) {
          state.playerAngle -= ROT_SPEED;
        }
        if (keys['d'] || keys['arrowright']) {
          state.playerAngle += ROT_SPEED;
        }

        updateEnemies(enemies, projectiles, state.playerX, state.playerY);

        const projResult = updateProjectiles(projectiles, state.playerX, state.playerY, state);
        if (projResult.damaged) state.screenFlash = 10;
        if (projResult.gameOver) {
          state.gameOver = true;
          spacePressed = false;
        }

        const collisionResult = checkEnemyCollision(
          enemies,
          state.playerX,
          state.playerY,
          state,
          state.lastCollisionTime
        );
        state.playerX = collisionResult.newPlayerX;
        state.playerY = collisionResult.newPlayerY;
        state.lastCollisionTime = collisionResult.newCollisionTime;
        if (collisionResult.damaged) state.screenFlash = 10;
        if (collisionResult.gameOver) {
          state.gameOver = true;
          spacePressed = false;
        }

        if (enemies.length === 0 && !state.gameOver) {
          state.gameOver = true;
          spacePressed = false;
        }
      }

      render();
      requestAnimationFrame(gameLoop);
    };

    // Start game loop
    requestAnimationFrame(gameLoop);
    
    // Set loading false after initial setup
    setTimeout(() => setLoading(false), 0);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading && (
        <div style={{ color: '#0f0', fontFamily: 'monospace', marginBottom: 20 }}>
          Loading GLOOM Engine...
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={960}
        height={720}
        style={{
          imageRendering: 'pixelated',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
      <div
        style={{
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: 12,
          marginTop: 10,
          textAlign: 'center',
        }}
      >
        WASD or Arrow Keys to move | A/D to rotate | SPACE to shoot
      </div>
    </div>
  );
}
