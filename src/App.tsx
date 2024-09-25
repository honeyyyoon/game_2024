import './App.css';

import React, { useCallback, useEffect } from 'react';

import Board from './components/Board';
import type { Direction } from './gameLogic';
import { useGame } from './hooks/useGame';

const App: React.FC = () => {
  const { board, score, move, initializeBoard, checkGameOver, checkWin } =
    useGame();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const directions: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = directions[event.key];
      if (direction !== undefined) {
        const moved = move(direction);
        if (moved) {
          if (checkWin()) {
            alert('You win!');
            initializeBoard();
          }
        }

        if (checkGameOver()) {
          alert('Game Over!');
          initializeBoard();
        }
      }
    },
    [move, checkWin, checkGameOver, initializeBoard],
  );

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleRestartClick = () => {
    initializeBoard();
  };

  return (
    <div className="app">
      <h1>2048 Game</h1>
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <button className="restart-button" onClick={handleRestartClick}>
          Restart Game
        </button>
      </div>
      <Board board={board} />
    </div>
  );
};

export default App;
