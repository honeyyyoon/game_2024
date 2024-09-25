import React from 'react';

import type { Map2048 } from '../gameLogic';
import Tile from './Tile';

interface BoardProps {
  board: Map2048;
}

const Board: React.FC<BoardProps> = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, i) =>
        row.map((value, j) => <Tile key={`${i}-${j}`} value={value} />),
      )}
    </div>
  );
};

export default Board;
