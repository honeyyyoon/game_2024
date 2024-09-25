export type Cell = number | null;
export type Map2048 = Cell[][];
export type Direction = 'up' | 'left' | 'right' | 'down';
type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;
export type MergeInfo = { mergedValue: number; count: number };
type MoveResult = {
  result: Map2048;
  isMoved: boolean;
  mergeInfo: MergeInfo[];
};

export const moveMapIn2048Rule = (
  map: Map2048,
  direction: Direction,
): MoveResult => {
  if (!validateMapIsNByM(map)) throw new Error('Map is not N by M');
  const rotatedMap = rotateMapCounterClockwise(map, rotateDegreeMap[direction]);
  const { result, isMoved, mergeInfo } = moveLeft(rotatedMap);
  return {
    result: rotateMapCounterClockwise(result, revertDegreeMap[direction]),
    isMoved,
    mergeInfo,
  };
};

const validateMapIsNByM = (map: Map2048): boolean => {
  const firstColumnCount = map[0]?.length ?? 0;
  return map.every((row) => row.length === firstColumnCount);
};

const rotateMapCounterClockwise = (
  map: Map2048,
  degree: RotateDegree,
): Map2048 => {
  const rowLength = map.length;
  const columnLength = map[0]?.length ?? 0;
  switch (degree) {
    case 0:
      return map;
    case 90:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex): Cell =>
            map[rowIndex]?.[columnLength - columnIndex - 1] ?? null,
        ),
      ) as Map2048;
    case 180:
      return Array.from({ length: rowLength }, (_, rowIndex) =>
        Array.from(
          { length: columnLength },
          (_, columnIndex): Cell =>
            map[rowLength - rowIndex - 1]?.[columnLength - columnIndex - 1] ??
            null,
        ),
      ) as Map2048;
    case 270:
      return Array.from({ length: columnLength }, (_, columnIndex) =>
        Array.from(
          { length: rowLength },
          (_, rowIndex): Cell =>
            map[rowLength - rowIndex - 1]?.[columnIndex] ?? null,
        ),
      ) as Map2048;
  }
};

const moveLeft = (map: Map2048): MoveResult => {
  const movedRows = map.map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  const mergeInfo = movedRows.flatMap((movedRow) => movedRow.mergeInfo);
  return { result, isMoved, mergeInfo };
};

const moveRowLeft = (
  row: Cell[],
): { result: Cell[]; isMoved: boolean; mergeInfo: MergeInfo[] } => {
  const mergeInfo: MergeInfo[] = [];
  const reduced = row.reduce(
    (acc: { lastCell: Cell; result: Cell[] }, cell) => {
      if (cell === null) {
        return acc;
      } else if (acc.lastCell === null) {
        return { ...acc, lastCell: cell };
      } else if (acc.lastCell === cell) {
        mergeInfo.push({ mergedValue: cell * 2, count: 1 });
        return { result: [...acc.result, cell * 2], lastCell: null };
      } else {
        return { result: [...acc.result, acc.lastCell], lastCell: cell };
      }
    },
    { lastCell: null, result: [] },
  );

  const result = [...reduced.result, reduced.lastCell];
  const resultRow = Array.from(
    { length: row.length },
    (_, i) => result[i] ?? null,
  );

  return {
    result: resultRow,
    isMoved: row.some((cell, i) => cell !== resultRow[i]),
    mergeInfo,
  };
};

const rotateDegreeMap: DirectionDegreeMap = {
  up: 90,
  right: 180,
  down: 270,
  left: 0,
};

const revertDegreeMap: DirectionDegreeMap = {
  up: 270,
  right: 180,
  down: 90,
  left: 0,
};
