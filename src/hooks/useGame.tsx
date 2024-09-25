import { useCallback, useState } from 'react';

import type { Direction, Map2048, MergeInfo } from '../gameLogic';
import { moveMapIn2048Rule } from '../gameLogic';

export const useGame = () => {
  const [board, setBoard] = useState<Map2048>(
    Array(4).fill(Array(4).fill(null)),
  );
  const [score, setScore] = useState<number>(0);

  const initializeBoard = useCallback(() => {
    let newBoard = Array(4).fill(Array(4).fill(null)) as Map2048;
    newBoard = addNewTile(newBoard);
    newBoard = addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
  }, []);

  const addNewTile = (currentBoard: Map2048): Map2048 => {
    const emptyPositions = currentBoard
      .flatMap((row, i) => row.map((cell, j) => ({ i, j, value: cell })))
      .filter((cell) => cell.value === null);

    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const selectedPosition = emptyPositions[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    return currentBoard.map((row, rowIndex) =>
      rowIndex === selectedPosition?.i
        ? row.map((cell, colIndex) =>
            colIndex === selectedPosition.j ? newValue : cell,
          )
        : row,
    );
  };

  const calculateScoreIncrease = (mergeInfo: MergeInfo[]): number => {
    return mergeInfo.reduce(
      (sum, info) => sum + info.mergedValue * info.count,
      0,
    );
  };

  const move = useCallback(
    (direction: Direction) => {
      const { result, isMoved, mergeInfo } = moveMapIn2048Rule(
        board,
        direction,
      );
      if (isMoved) {
        const newBoard = addNewTile(result);
        setBoard(newBoard);
        const scoreIncrease = calculateScoreIncrease(mergeInfo);
        setScore((prevScore) => prevScore + scoreIncrease);
        return true;
      }
      return false;
    },
    [board],
  );

  const checkGameOver = useCallback((): boolean => {
    const isBoardFull = board.every((row) =>
      row.every((cell) => cell !== null),
    );

    if (isBoardFull) {
      return ['up', 'down', 'left', 'right'].every(
        (direction) =>
          !moveMapIn2048Rule(board, direction as Direction).isMoved,
      );
    }

    return false;
  }, [board]);

  const checkWin = useCallback((): boolean => {
    return board.some((row) => row.some((cell) => cell === 128));
  }, [board]);

  return {
    board,
    score,
    initializeBoard,
    move,
    checkGameOver,
    checkWin,
  };
};
