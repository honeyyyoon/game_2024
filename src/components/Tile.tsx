import type { Cell } from '../gameLogic';

interface TileProps {
  value: Cell;
}

const Tile = ({ value }: TileProps) => {
  const tileClass = `tile tile-${value ?? 'empty'}`;
  return <div className={tileClass}>{value ?? ''}</div>;
};

export default Tile;
