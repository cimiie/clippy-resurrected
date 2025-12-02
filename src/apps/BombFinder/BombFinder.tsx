'use client';

import { useMinesweeperLogic, Cell } from './BombFinderGame';
import styles from './BombFinder.module.css';

interface MinesweeperAppProps {
  difficulty?: 'beginner' | 'intermediate' | 'expert';
}

const DIFFICULTY_SETTINGS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export default function MinesweeperApp({ difficulty = 'beginner' }: MinesweeperAppProps) {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const {
    grid,
    gameStatus,
    flagCount,
    timeElapsed,
    revealCell,
    toggleFlag,
    resetGame,
  } = useMinesweeperLogic({
    rows: settings.rows,
    cols: settings.cols,
    mineCount: settings.mines,
  });

  const handleCellClick = (row: number, col: number) => {
    revealCell(row, col);
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    toggleFlag(row, col);
  };

  const renderCell = (cell: Cell) => {
    const { isRevealed, isFlagged, isMine, adjacentMines, position } = cell;
    
    let cellContent = '';
    let cellClass = styles.cell;

    if (isFlagged) {
      cellContent = '🚩';
      cellClass += ` ${styles.cellUnrevealed}`;
    } else if (isRevealed) {
      cellClass += ` ${styles.cellRevealed}`;
      if (isMine) {
        cellContent = '💣';
        cellClass += ` ${styles.cellMine}`;
      } else if (adjacentMines > 0) {
        cellContent = adjacentMines.toString();
        cellClass += ` ${styles[`cellNumber${adjacentMines}`]}`;
      }
    } else {
      cellClass += ` ${styles.cellUnrevealed}`;
    }

    return (
      <button
        key={`${position.row}-${position.col}`}
        className={cellClass}
        onClick={() => handleCellClick(position.row, position.col)}
        onContextMenu={(e) => handleCellRightClick(e, position.row, position.col)}
        disabled={gameStatus !== 'playing'}
      >
        {cellContent}
      </button>
    );
  };

  const getFaceEmoji = () => {
    if (gameStatus === 'won') return '😎';
    if (gameStatus === 'lost') return '😵';
    return '🙂';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.counter}>
            {String(settings.mines - flagCount).padStart(3, '0')}
          </div>
          <button className={styles.resetButton} onClick={resetGame}>
            {getFaceEmoji()}
          </button>
          <div className={styles.timer}>
            {String(Math.min(timeElapsed, 999)).padStart(3, '0')}
          </div>
        </div>
        
        <div 
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${settings.cols}, 1fr)`,
            gridTemplateRows: `repeat(${settings.rows}, 1fr)`,
          }}
        >
          {grid.map((row) => row.map((cell) => renderCell(cell)))}
        </div>

        {gameStatus !== 'playing' && (
          <div className={styles.gameOver}>
            {gameStatus === 'won' ? 'You Win! 🎉' : 'Game Over!'}
          </div>
        )}
      </div>
    </div>
  );
}
