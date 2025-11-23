'use client';

import { useState, useCallback, useEffect } from 'react';

export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  position: { row: number; col: number };
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface MinesweeperState {
  grid: Cell[][];
  gameStatus: GameStatus;
  flagCount: number;
  timeElapsed: number;
}

interface MinesweeperLogicProps {
  rows?: number;
  cols?: number;
  mineCount?: number;
  onStateChange?: (state: MinesweeperState) => void;
}

// Helper function to create initial grid
function createInitialGrid(rows: number, cols: number, mineCount: number): Cell[][] {
  const newGrid: Cell[][] = [];
    
    // Create empty grid
    for (let row = 0; row < rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        newGrid[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
          position: { row, col },
        };
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                newGrid[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[row][col].adjacentMines = count;
        }
      }
    }

  return newGrid;
}

export function useMinesweeperLogic({
  rows = 9,
  cols = 9,
  mineCount = 10,
  onStateChange,
}: MinesweeperLogicProps = {}) {
  const [grid, setGrid] = useState<Cell[][]>(() => createInitialGrid(rows, cols, mineCount));
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid = createInitialGrid(rows, cols, mineCount);
    setGrid(newGrid);
    setGameStatus('playing');
    setFlagCount(0);
    setTimeElapsed(0);
    setGameStarted(false);
  }, [rows, cols, mineCount]);

  // Timer
  useEffect(() => {
    if (gameStarted && gameStatus === 'playing') {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameStatus]);

  // Notify state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ grid, gameStatus, flagCount, timeElapsed });
    }
  }, [grid, gameStatus, flagCount, timeElapsed, onStateChange]);

  // Reveal cell with cascade for empty cells
  const revealCell = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const cell = newGrid[row][col];

      if (cell.isRevealed || cell.isFlagged) return prevGrid;

      cell.isRevealed = true;

      // If mine, game over
      if (cell.isMine) {
        // Reveal all mines
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (newGrid[r][c].isMine) {
              newGrid[r][c].isRevealed = true;
            }
          }
        }
        setGameStatus('lost');
        return newGrid;
      }

      // If empty cell (no adjacent mines), cascade reveal
      if (cell.adjacentMines === 0) {
        const queue: [number, number][] = [[row, col]];
        const visited = new Set<string>();
        visited.add(`${row},${col}`);

        while (queue.length > 0) {
          const [r, c] = queue.shift()!;

          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const newRow = r + dr;
              const newCol = c + dc;
              const key = `${newRow},${newCol}`;

              if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                !visited.has(key)
              ) {
                visited.add(key);
                const adjacentCell = newGrid[newRow][newCol];
                
                if (!adjacentCell.isMine && !adjacentCell.isFlagged) {
                  adjacentCell.isRevealed = true;
                  
                  if (adjacentCell.adjacentMines === 0) {
                    queue.push([newRow, newCol]);
                  }
                }
              }
            }
          }
        }
      }

      // Check win condition
      let allNonMinesRevealed = true;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!newGrid[r][c].isMine && !newGrid[r][c].isRevealed) {
            allNonMinesRevealed = false;
            break;
          }
        }
        if (!allNonMinesRevealed) break;
      }

      if (allNonMinesRevealed) {
        setGameStatus('won');
      }

      return newGrid;
    });
  }, [gameStatus, gameStarted, rows, cols]);

  // Toggle flag
  const toggleFlag = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      const cell = newGrid[row][col];

      if (cell.isRevealed) return prevGrid;

      cell.isFlagged = !cell.isFlagged;
      setFlagCount((prev) => (cell.isFlagged ? prev + 1 : prev - 1));

      return newGrid;
    });
  }, [gameStatus]);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGrid();
  }, [initializeGrid]);

  return {
    grid,
    gameStatus,
    flagCount,
    timeElapsed,
    revealCell,
    toggleFlag,
    resetGame,
  };
}
