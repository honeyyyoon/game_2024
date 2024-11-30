import type { Map2048 } from '../gameLogic';
import Tile from './Tile';

interface BoardProps {
  board: Map2048;
}

const Board = ({ board }: BoardProps) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        )),
      )}
    </div>
  );
};

export default Board;
