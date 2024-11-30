import { describe, expect, it } from 'vitest';

import { type Map2048, moveMapIn2048Rule } from './gameLogic';

describe('moveMapIn2048Rule', () => {
  it('맵이 NxM이 아니면 에러가 뜬다. ', () => {
    const invalidMap: Map2048 = [
      [2, 2, null, null],
      [2, null, 2, null],
      [4, 4, 4, 4, null],
      [null, null, null, null],
    ];

    expect(() => moveMapIn2048Rule(invalidMap, 'left')).toThrow(
      'Map is not N by M',
    );
  });

  it('연속된 같은 숫자는 왼쪽부터 순서대로 합쳐진다', () => {
    const map: Map2048 = [
      [2, 2, 2, 2],
      [4, 4, 4, null],
      [8, 8, null, null],
      [null, null, null, null],
    ];

    const result = moveMapIn2048Rule(map, 'left');
    expect(result.result[0]).toEqual([4, 4, null, null]);
    expect(result.result[1]).toEqual([8, 4, null, null]);
    expect(result.result[2]).toEqual([16, null, null, null]);
    expect(result.result[3]).toEqual([null, null, null, null]);

    expect(result.isMoved).toBe(true);
  });

  it('이동할 수 없는 상태면 isMoved는 false이고 mergeInfo는 비어있다', () => {
    const map: Map2048 = [
      [2, 4, 8, 16],
      [null, null, null, null],
      [2, 4, 8, 16],
      [null, null, null, null],
    ];

    const result = moveMapIn2048Rule(map, 'left');
    expect(result.isMoved).toBe(false);
    expect(result.mergeInfo).toHaveLength(0);
  });
});
