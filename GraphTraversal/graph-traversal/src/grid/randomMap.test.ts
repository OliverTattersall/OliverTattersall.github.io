import { COL_COUNT, ROW_COUNT, type Coordinate, type Grid } from './createGrid';
import { createRandomMap } from './randomMap';

const start: Coordinate = { row: 10, col: 15 };
const finish: Coordinate = { row: 10, col: 35 };

test('leaves the map empty when every roll misses', () => {
  const grid = createRandomMap(start, finish, () => 1);

  expect(count(grid, (node) => node.isWall)).toBe(0);
  expect(count(grid, (node) => node.isMud)).toBe(0);
  expect(grid[start.row][start.col].isStart).toBe(true);
  expect(grid[finish.row][finish.col].isFinish).toBe(true);
});

test('walls the open cells when mud is not seeded', () => {
  const grid = createRandomMap(start, finish, () => 0.1);

  expect(count(grid, (node) => node.isMud)).toBe(0);
  expect(count(grid, (node) => node.isWall)).toBe(ROW_COUNT * COL_COUNT - 2);
  expect(grid[start.row][start.col].isWall).toBe(false);
  expect(grid[finish.row][finish.col].isWall).toBe(false);
});

test('grows one mud seed into a puddle and walls the rest', () => {
  const seedRolls = ROW_COUNT * COL_COUNT - 2;
  let rolls = 0;
  const grid = createRandomMap(start, finish, () => {
    const roll = rolls++;
    if (roll === 0) return 0;
    if (roll < seedRolls) return 1;
    return 0;
  });

  expect(grid[0][0].isMud).toBe(true);
  expect(grid[0][1].isMud).toBe(true);
  expect(grid[1][0].isMud).toBe(true);
  expect(grid[0][2].isMud).toBe(true);
  expect(grid[1][1].isMud).toBe(true);
  expect(grid[2][0].isMud).toBe(true);
  expect(grid[0][3].isWall).toBe(true);
  expect(grid[0][3].isMud).toBe(false);
  expect(grid[start.row][start.col]).toMatchObject({ isWall: false, isMud: false, isStart: true });
  expect(grid[finish.row][finish.col]).toMatchObject({ isWall: false, isMud: false, isFinish: true });
});

test('mud from a seeded generator mostly shares an edge with other mud', () => {
  const grid = createRandomMap(start, finish, mulberry32(42));
  const mud = cells(grid).filter((node) => node.isMud);
  const clumped = mud.filter((node) =>
    orthogonal(grid, node.row, node.col).some((neighbor) => neighbor.isMud)
  );

  expect(mud.length).toBeGreaterThan(10);
  expect(count(grid, (node) => node.isWall)).toBeGreaterThan(10);
  expect(clumped.length / mud.length).toBeGreaterThan(0.7);
  expect(grid[start.row][start.col]).toMatchObject({ isWall: false, isMud: false });
  expect(grid[finish.row][finish.col]).toMatchObject({ isWall: false, isMud: false });
});

function count(grid: Grid, predicate: (node: Grid[number][number]) => boolean): number {
  return cells(grid).filter(predicate).length;
}

function cells(grid: Grid): Grid[number][number][] {
  return grid.flat();
}

function orthogonal(grid: Grid, row: number, col: number): Grid[number][number][] {
  const found = [];
  if (row > 0) found.push(grid[row - 1][col]);
  if (row < grid.length - 1) found.push(grid[row + 1][col]);
  if (col > 0) found.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) found.push(grid[row][col + 1]);
  return found;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
