import React from 'react';

import type { Cell } from '../gameLogic';

interface TileProps {
  value: Cell;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  const tileClass = value != null && !isNaN(value) ? `tile tile-${value}` : 'tile tile-empty';


  return (
    <div className={tileClass}>
      {value !== null ? value : ''}
    </div>
  );
};

export default Tile;


